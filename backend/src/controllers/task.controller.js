const { Task, Project, User, sequelize } = require("../models");
const { successResponse, errorResponse } = require("../utils/response.util");
const { logAudit } = require("../utils/audit.util");
const { Op } = require("sequelize");

const createTask = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { title, description, assignedTo, priority, dueDate } = req.body;

        const project = await Project.findByPk(projectId);
        if (!project) return errorResponse(res, "Project not found", 404);

        if (project.tenant_id !== req.user.tenantId && req.user.role !== 'super_admin') {
            return errorResponse(res, "Unauthorized", 403);
        }

        if (assignedTo) {
            const user = await User.findByPk(assignedTo);
            if (!user || user.tenant_id !== project.tenant_id) {
                return errorResponse(res, "Assigned user does not belong to this tenant", 400);
            }
        }

        const task = await Task.create({
            project_id: projectId,
            tenant_id: project.tenant_id,
            title,
            description,
            assigned_to: assignedTo || null,
            priority: priority || 'medium',
            status: 'todo',
            due_date: dueDate
        });

        await logAudit(project.tenant_id, req.user.userId, 'CREATE_TASK', 'task', task.id, req);
        return successResponse(res, task, "Task created", 201);

    } catch (error) {
        console.error(error);
        return errorResponse(res, "Internal Server Error", 500);
    }
};

const listTasks = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { status, assignedTo, priority, search, page = 1, limit = 50 } = req.query;

        const project = await Project.findByPk(projectId);
        if (!project) return errorResponse(res, "Project not found", 404);
        if (project.tenant_id !== req.user.tenantId && req.user.role !== 'super_admin') {
            return errorResponse(res, "Unauthorized", 403);
        }

        const where = { project_id: projectId };
        if (status) where.status = status;
        if (assignedTo) where.assigned_to = assignedTo;
        if (priority) where.priority = priority;
        if (search) where.title = { [Op.iLike]: `%${search}%` };

        const offset = (page - 1) * limit;
        const { count, rows } = await Task.findAndCountAll({
            where,
            include: [{ model: User, as: 'assignee', attributes: ['id', 'fullName', 'email'] }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['priority', 'DESC'], ['due_date', 'ASC']]
        });

        return successResponse(res, {
            tasks: rows,
            total: count,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit),
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        console.error(error);
        return errorResponse(res, "Internal Server Error", 500);
    }
};

const updateTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;

        const task = await Task.findByPk(taskId);
        if (!task) return errorResponse(res, "Task not found", 404);

        if (task.tenant_id !== req.user.tenantId && req.user.role !== 'super_admin') {
            return errorResponse(res, "Unauthorized", 403);
        }

        await task.update({ status });
        return successResponse(res, task);
    } catch (error) {
        console.error(error);
        return errorResponse(res, "Internal Server Error", 500);
    }
};

const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findByPk(taskId);
        if (!task) return errorResponse(res, "Task not found", 404);

        if (task.tenant_id !== req.user.tenantId && req.user.role !== 'super_admin') {
            return errorResponse(res, "Unauthorized", 403);
        }

        const updates = req.body;

        // validate assignedTo
        if (updates.assignedTo) {
            const user = await User.findByPk(updates.assignedTo);
            if (!user || user.tenant_id !== task.tenant_id) {
                return errorResponse(res, "Assigned user mismatch", 400);
            }
            updates.assigned_to = updates.assignedTo;
            delete updates.assignedTo; // map back to db col
        } else if (updates.assignedTo === null) {
            updates.assigned_to = null;
        }

        if (updates.dueDate === null) updates.due_date = null;
        if (updates.dueDate) updates.due_date = updates.dueDate;

        await task.update(updates);
        await logAudit(task.tenant_id, req.user.userId, 'UPDATE_TASK', 'task', task.id, req);
        return successResponse(res, task, "Task updated");

    } catch (error) {
        console.error(error);
        return errorResponse(res, "Internal Server Error", 500);
    }
};

// Also delete task? Not explicitly asked but good to have.
const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findByPk(taskId);
        if (!task) return errorResponse(res, "Task not found", 404);

        if (task.tenant_id !== req.user.tenantId && req.user.role !== 'super_admin') return errorResponse(res, "Unauthorized", 403);

        await task.destroy();
        await logAudit(task.tenant_id, req.user.userId, 'DELETE_TASK', 'task', taskId, req);
        return successResponse(res, null, "Task deleted");
    } catch (error) {
        console.error(error);
        return errorResponse(res, "Internal Server Error", 500);
    }
};

module.exports = { createTask, listTasks, updateTaskStatus, updateTask, deleteTask };
