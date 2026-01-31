const { Project, Tenant, User, Task, sequelize } = require("../models");
const { successResponse, errorResponse } = require("../utils/response.util");
const { logAudit } = require("../utils/audit.util");
const { Op } = require("sequelize");

const createProject = async (req, res) => {
    try {
        const { name, description, status } = req.body;
        const tenantId = req.user.tenantId;

        if (!tenantId) return errorResponse(res, "Super Admin cannot create projects directly via this API", 403);
        // Assuming super admin shouldn't create projects for tenants indiscriminately without clarifying context?
        // or just assume req.user.tenantId is the target.

        const tenant = await Tenant.findByPk(tenantId);

        // Check limits
        const currentProjects = await Project.count({ where: { tenant_id: tenantId } });
        if (currentProjects >= tenant.max_projects) {
            return errorResponse(res, "Project limit reached", 403);
        }

        const project = await Project.create({
            tenant_id: tenantId,
            created_by: req.user.userId,
            name,
            description,
            status: status || 'active'
        });

        await logAudit(tenantId, req.user.userId, 'CREATE_PROJECT', 'project', project.id, req);
        return successResponse(res, project, "Project created", 201);

    } catch (error) {
        console.error(error);
        return errorResponse(res, "Internal Server Error", 500);
    }
};

const listProjects = async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        // If super admin, maybe allow listing all? Or filter by query tenantId?
        // Spec says "Filter by user's tenantId automatically".

        const { status, search, page = 1, limit = 20 } = req.query;
        const where = { tenant_id: tenantId };

        if (req.user.role === 'super_admin') {
            // For super admin, maybe they can see all or specified?
            // "Q6: Super admin ... get all records"
            // But let's stick to simple "my tenant" for now unless explicitly asking for all.
            // Actually, if super admin has tenantId=null, this where clause fails.
            // Super admin listing projects usually implies management view.
            // I'll skip super admin logic for "my projects" unless they impersonate.
            // For now, if tenantId is null, maybe return all?
            if (!tenantId) delete where.tenant_id;
        }

        if (status) where.status = status;
        if (search) where.name = { [Op.iLike]: `%${search}%` };

        const offset = (page - 1) * limit;
        const { count, rows } = await Project.findAndCountAll({
            where,
            include: [
                { model: User, as: 'creator', attributes: ['id', 'fullName'] }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        // Task counts
        const projectsWithCounts = await Promise.all(rows.map(async (p) => {
            const taskCount = await Task.count({ where: { project_id: p.id } });
            const completedTaskCount = await Task.count({ where: { project_id: p.id, status: 'completed' } });
            const pJson = p.toJSON();
            pJson.taskCount = taskCount;
            pJson.completedTaskCount = completedTaskCount;
            return pJson;
        }));

        return successResponse(res, {
            projects: projectsWithCounts,
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

const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const updates = req.body;
        const project = await Project.findByPk(projectId);
        if (!project) return errorResponse(res, "Project not found", 404);

        if (project.tenant_id !== req.user.tenantId && req.user.role !== 'super_admin') {
            return errorResponse(res, "Project belongs to different tenant", 404);
        }

        if (req.user.role !== 'tenant_admin' && req.user.userId !== project.created_by && req.user.role !== 'super_admin') {
            return errorResponse(res, "Unauthorized", 403);
        }

        await project.update(updates);
        await logAudit(project.tenant_id, req.user.userId, 'UPDATE_PROJECT', 'project', project.id, req);
        return successResponse(res, project, "Project updated");
    } catch (error) {
        console.error(error);
        return errorResponse(res, "Internal Server Error", 500);
    }
};

const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findByPk(projectId);
        if (!project) return errorResponse(res, "Project not found", 404);

        if (project.tenant_id !== req.user.tenantId && req.user.role !== 'super_admin') {
            return errorResponse(res, "Unauthorized", 404);
        }
        if (req.user.role !== 'tenant_admin' && req.user.userId !== project.created_by && req.user.role !== 'super_admin') {
            return errorResponse(res, "Unauthorized", 403);
        }

        await project.destroy();
        await logAudit(project.tenant_id, req.user.userId, 'DELETE_PROJECT', 'project', project.id, req);
        return successResponse(res, null, "Project deleted");
    } catch (error) {
        console.error(error);
        return errorResponse(res, "Internal Server Error", 500);
    }
};

const getProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findByPk(projectId, {
            include: [{ model: User, as: 'creator', attributes: ['id', 'fullName'] }]
        });

        if (!project) return errorResponse(res, "Project not found", 404);

        if (project.tenant_id !== req.user.tenantId && req.user.role !== 'super_admin') {
            return errorResponse(res, "Unauthorized", 403);
        }

        return successResponse(res, project);
    } catch (error) {
        console.error(error);
        return errorResponse(res, "Internal Server Error", 500);
    }
};

module.exports = { createProject, listProjects, updateProject, deleteProject, getProject };

