const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Project extends Model { }

  Project.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tenant_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "tenants", key: "id" },
      onDelete: "CASCADE",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM('active', 'archived', 'completed'),
      defaultValue: 'active',
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
  }, {
    sequelize,
    modelName: 'Project',
    tableName: 'projects',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });

  return Project;
};
