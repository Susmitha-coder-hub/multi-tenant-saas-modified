const { Tenant, User, sequelize } = require("../models");
const { hashPassword, comparePassword } = require("../utils/password.util");
const { generateToken } = require("../utils/jwt.util");
const { successResponse, errorResponse } = require("../utils/response.util");
const { logAudit } = require("../utils/audit.util");

const registerTenant = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { tenantName, subdomain, adminEmail, adminPassword, adminFullName } = req.body;

    if (!tenantName || !subdomain || !adminEmail || !adminPassword || !adminFullName) {
      await transaction.rollback();
      return errorResponse(res, "Missing required fields", 400);
    }

    // Check existing
    const existingTenant = await Tenant.findOne({ where: { subdomain }, transaction });
    if (existingTenant) {
      await transaction.rollback();
      return errorResponse(res, "Subdomain already exists", 409);
    }
    const existingUser = await User.findOne({ where: { email: adminEmail }, transaction });
    if (existingUser) {
      // Note: Email unique per tenant, but for new tenant, if email exists in another tenant it's fine?
      // Wait, if we are creating a new tenant, usage of same email should be allowed if the requirement says "Unique per tenant".
      // BUT, here we don't know the tenant yet. 
      // Actually, logic: Create tenant first, then check user in that tenant.
      // Since it's a new tenant, the user definitely doesn't exist in it.
      // So no email check needed against *other* tenants.
    }

    // Create Tenant
    const tenant = await Tenant.create({
      name: tenantName,
      subdomain,
      status: 'active',
      subscription_plan: 'free', // Default
      max_users: 5,
      max_projects: 3
    }, { transaction });

    // Hash Password
    const passwordHash = await hashPassword(adminPassword);

    // Create Admin User
    const adminUser = await User.create({
      tenant_id: tenant.id,
      email: adminEmail,
      fullName: adminFullName,
      password_hash: passwordHash,
      role: 'tenant_admin',
      is_active: true
    }, { transaction });

    await transaction.commit();

    await logAudit(tenant.id, adminUser.id, 'REGISTER_TENANT', 'tenant', tenant.id, req);

    return successResponse(res, {
      tenantId: tenant.id,
      subdomain: tenant.subdomain,
      adminUser: {
        id: adminUser.id,
        email: adminUser.email,
        fullName: adminUser.fullName,
        role: adminUser.role
      }
    }, "Tenant registered successfully", 201);

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error(error);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password, tenantSubdomain, tenantId } = req.body;

    if (!email || !password || (!tenantSubdomain && !tenantId)) {
      return errorResponse(res, "Email, password, and tenant (subdomain or ID) are required", 400);
    }

    let tenant;
    if (tenantId) {
      tenant = await Tenant.findByPk(tenantId);
    } else {
      tenant = await Tenant.findOne({ where: { subdomain: tenantSubdomain } });
    }

    if (!tenant) return errorResponse(res, "Tenant not found", 404);
    if (tenant.status !== 'active') return errorResponse(res, "Tenant is not active", 403);

    const user = await User.findOne({ where: { email, tenant_id: tenant.id } });

    // Check super admin? Super admin has tenant_id NULL.
    // If login is identifying a tenant, super admin login logic might differ.
    // "Overview: Super Admin Exception: Super admin users have tenant_id as NULL"
    // "Q1: When a super_admin makes API calls, their JWT token will have tenantId: null"
    // Does super admin login via a specific tenant page? Use cases say "Login as super_admin".
    // Usually super admin logs in via a "system" portal or can login to any tenant?
    // "Q6: For super_admin ... verify tenant exists but don't check if super_admin belongs to it"
    // But for LOGIN, they need to authenticate.
    // The seeds show superadmin has NO tenant_id.
    // So if I try to login as superadmin using `tenantSubdomain: 'demo'`, the above query `where: {email, tenant_id: tenant.id}` will FAIL.

    // Logic: Look for user in tenant OR look for global superadmin.
    let targetUser = user;
    if (!targetUser) {
      // Check for super admin
      const superAdmin = await User.findOne({ where: { email, role: 'super_admin' } });
      if (superAdmin) targetUser = superAdmin;
    }

    if (!targetUser) return errorResponse(res, "Invalid credentials", 401);

    const isMatch = await comparePassword(password, targetUser.password_hash);
    if (!isMatch) return errorResponse(res, "Invalid credentials", 401);

    if (!targetUser.is_active) return errorResponse(res, "Account suspended", 403);

    const tokenPayload = {
      userId: targetUser.id,
      tenantId: targetUser.role === 'super_admin' ? null : tenant.id, // If super admin, tenantId is null? OR do they "impersonate" the tenant they logged into?
      // "Q1: JWT token will have tenantId: null"
      // So yes, null.
      role: targetUser.role
    };

    const token = generateToken(tokenPayload);

    // Optional: Create session (skipped as per instructions "if you use JWT only")

    await logAudit(tenant.id, targetUser.id, 'LOGIN', 'user', targetUser.id, req);

    return successResponse(res, {
      user: {
        id: targetUser.id,
        email: targetUser.email,
        fullName: targetUser.fullName,
        role: targetUser.role,
        tenantId: targetUser.tenant_id
      },
      token,
      expiresIn: 86400
    });

  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password_hash'] },
      include: [{ model: Tenant }]
    });

    if (!user) return errorResponse(res, "User not found", 404);

    return successResponse(res, user);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal Server Error", 500);
  }
};

const logout = async (req, res) => {
  // Statless logout, just log it
  // req.user is populated by middleware
  if (req.user) {
    await logAudit(req.user.tenantId, req.user.userId, 'LOGOUT', 'user', req.user.userId, req);
  }
  return successResponse(res, null, "Logged out successfully");
};

module.exports = { registerTenant, login, getMe, logout };
