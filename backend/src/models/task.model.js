const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Task extends Model { }

  Task.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    project_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "projects", key: "id" },
      onDelete: "CASCADE",
    },
    tenant_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "tenants", key: "id" },
      onDelete: "CASCADE",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM('todo', 'in_progress', 'completed'),
      defaultValue: 'todo',
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium',
    },
    assigned_to: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "users", key: "id" },
    },
    due_date: {
      type: DataTypes.DATEONLY,
    },
  }, {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });

  return Task;
};
