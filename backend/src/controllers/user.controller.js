const { User, Tenant, sequelize } = require("../models");
const { successResponse, errorResponse } = require("../utils/response.util");
const { hashPassword } = require("../utils/password.util");
const { logAudit } = require("../utils/audit.util");
const { Op } = require("sequelize");

const addUser = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const { email, password, fullName, role } = req.body;

        // Check Auth
        if (req.user.role !== 'tenant_admin') return errorResponse(res, "Unauthorized", 403);
        if (req.user.tenantId !== tenantId) return errorResponse(res, "Unauthorized", 403);

        const tenant = await Tenant.findByPk(tenantId);
        if (!tenant) return errorResponse(res, "Tenant not found", 404);

        // Limit check
        const currentUsers = await User.count({ where: { tenant_id: tenantId } });
        if (currentUsers >= tenant.max_users) {
            return errorResponse(res, "Subscription limit reached", 403);
        }

        // Check email uniqueness in tenant
        const existing = await User.findOne({ where: { email, tenant_id: tenantId } });
        if (existing) return errorResponse(res, "Email already exists in this tenant", 409);

        const hashedPassword = await hashPassword(password);
        const user = await User.create({
            tenant_id: tenantId,
            email,
            fullName,
            password_hash: hashedPassword,
            role: role || 'user',
            is_active: true
        });

        await logAudit(tenantId, req.user.userId, 'CREATE_USER', 'user', user.id, req);
        return successResponse(res, user, "User created successfully", 201);

    } catch (error) {
        console.error(error);
        return errorResponse(res, "Internal Server Error", 500);
    }
};

const listUsers = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const { page = 1, limit = 50, search, role } = req.query;

        if (req.user.tenantId !== tenantId && req.user.role !== 'super_admin') {
            return errorResponse(res, "Unauthorized", 403);
        }

        const where = { tenant_id: tenantId };
        if (role) where.role = role;
        if (search) {
            where[Op.or] = [
                { fullName: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const offset = (page - 1) * limit;
        const { count, rows } = await User.findAndCountAll({
            where,
            attributes: { exclude: ['password_hash'] },
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        return successResponse(res, {
            users: rows,
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

const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;

        const userToUpdate = await User.findByPk(userId);
        if (!userToUpdate) return errorResponse(res, "User not found", 404);

        // Auth: tenant_admin or self
        const isSelf = req.user.userId === userId;
        const isAdmin = req.user.role === 'tenant_admin' && req.user.tenantId === userToUpdate.tenant_id;

        if (!isSelf && !isAdmin) return errorResponse(res, "Unauthorized", 403);

        // Fields allowed
        const allowed = ['fullName'];
        if (isAdmin) allowed.push('role', 'is_active');

        // Filter updates
        const filteredUpdates = {};
        Object.keys(updates).forEach(key => {
            if (allowed.includes(key)) filteredUpdates[key] = updates[key];
        });

        await userToUpdate.update(filteredUpdates);
        await logAudit(userToUpdate.tenant_id, req.user.userId, 'UPDATE_USER', 'user', userToUpdate.id, req);

        return successResponse(res, userToUpdate, "User updated successfully");

    } catch (error) {
        console.error(error);
        return errorResponse(res, "Internal Server Error", 500);
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const userToDelete = await User.findByPk(userId);
        if (!userToDelete) return errorResponse(res, "User not found", 404);

        if (req.user.role !== 'tenant_admin' || req.user.tenantId !== userToDelete.tenant_id) {
            return errorResponse(res, "Unauthorized", 403);
        }

        if (req.user.userId === userId) {
            return errorResponse(res, "Cannot delete yourself", 403);
        }

        await userToDelete.destroy();
        // Associations (tasks) handled by CASCADE in model/DB
        await logAudit(userToDelete.tenant_id, req.user.userId, 'DELETE_USER', 'user', userId, req);

        return successResponse(res, null, "User deleted successfully");

    } catch (error) {
        console.error(error);
        return errorResponse(res, "Internal Server Error", 500);
    }
};

module.exports = { addUser, listUsers, updateUser, deleteUser };
