const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class AuditLog extends Model { }

  AuditLog.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tenant_id: {
      type: DataTypes.UUID,
      references: { model: "tenants", key: "id" },
    },
    user_id: {
      type: DataTypes.UUID,
      references: { model: "users", key: "id" },
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entity_type: {
      type: DataTypes.STRING,
    },
    entity_id: {
      type: DataTypes.STRING,
    },
    ip_address: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'AuditLog',
    tableName: 'audit_logs',
    timestamps: true,
    updatedAt: false, // Audit logs usually don't have updated_at
    createdAt: "created_at",
  });

  return AuditLog;
};
