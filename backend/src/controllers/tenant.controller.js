const { Tenant, User, Project, Task, sequelize } = require("../models");
const { successResponse, errorResponse } = require("../utils/response.util");
const { logAudit } = require("../utils/audit.util");

const getTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;

    // Authz: User must belong to tenant OR be super_admin
    if (req.user.role !== 'super_admin' && req.user.tenantId !== tenantId) {
      return errorResponse(res, "Unauthorized", 403);
    }

    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) return errorResponse(res, "Tenant not found", 404);

    // Stats
    const totalUsers = await User.count({ where: { tenant_id: tenantId } });
    const totalProjects = await Project.count({ where: { tenant_id: tenantId } });
    const totalTasks = await Task.count({ where: { tenant_id: tenantId } });

    const data = tenant.toJSON();
    data.stats = { totalUsers, totalProjects, totalTasks };

    return successResponse(res, data);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

const updateTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const updates = req.body;

    // Authz: super_admin or tenant_admin
    if (req.user.role !== 'super_admin' && req.user.role !== 'tenant_admin') {
      return errorResponse(res, "Unauthorized", 403);
    }
    // If tenant_admin, only update OWN tenant
    if (req.user.role === 'tenant_admin' && req.user.tenantId !== tenantId) {
      return errorResponse(res, "Unauthorized", 403);
    }

    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) return errorResponse(res, "Tenant not found", 404);

    // Restrictions
    if (req.user.role === 'tenant_admin') {
      // Can only update name
      // Ensure restricted fields are NOT in updates
      const allowed = ['name'];
      const keys = Object.keys(updates);
      const invalid = keys.filter(k => !allowed.includes(k));
      if (invalid.length > 0) {
        return errorResponse(res, "Tenant admin can only update name", 403);
      }
    }

    await tenant.update(updates);
    await logAudit(tenant.id, req.user.userId, 'UPDATE_TENANT', 'tenant', tenant.id, req);

    return successResponse(res, tenant, "Tenant updated successfully");
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

const listTenants = async (req, res) => {
  try {
    // Authz: super_admin ONLY
    if (req.user.role !== 'super_admin') {
      return errorResponse(res, "Unauthorized", 403);
    }

    const { page = 1, limit = 10, status, subscriptionPlan } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (subscriptionPlan) where.subscription_plan = subscriptionPlan;

    const { count, rows } = await Tenant.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    // TODO: Add stats for each? Might be expensive. Requirement says "totalUsers, totalProjects".
    // I'll do subqueries or separate counts if needed, but for listing, maybe just basic info first or optimize.
    const tenantsWithStats = await Promise.all(rows.map(async (t) => {
      const totalUsers = await User.count({ where: { tenant_id: t.id } });
      const totalProjects = await Project.count({ where: { tenant_id: t.id } });
      const tJson = t.toJSON();
      tJson.totalUsers = totalUsers;
      tJson.totalProjects = totalProjects;
      return tJson;
    }));

    return successResponse(res, {
      tenants: tenantsWithStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalTenants: count,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

module.exports = { getTenant, updateTenant, listTenants };
