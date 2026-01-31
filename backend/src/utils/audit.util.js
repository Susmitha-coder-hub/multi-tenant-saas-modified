const { AuditLog } = require("../models");

const logAudit = async (tenantId, userId, action, entityType, entityId, req) => {
  try {
    const ipAddress = req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress) : null;

    await AuditLog.create({
      tenant_id: tenantId,
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      ip_address: ipAddress,
    });
  } catch (error) {
    console.error("Audit Logging Failed:", error);
    // Don't block execution if logging fails
  }
};

module.exports = { logAudit };
