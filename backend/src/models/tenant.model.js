const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Tenant", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subdomain: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'suspended', 'trial'),
      defaultValue: "active",
    },
    subscription_plan: {
      type: DataTypes.ENUM('free', 'pro', 'enterprise'),
      defaultValue: "free",
    },
    max_users: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
    max_projects: {
      type: DataTypes.INTEGER,
      defaultValue: 3,
    },
  }, {
    tableName: "tenants",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
};
