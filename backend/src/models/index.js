const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
  }
);

// Import models
const TenantModel = require("./tenant.model");
const UserModel = require("./User");
const ProjectModel = require("./project.model");
const TaskModel = require("./task.model");
const AuditLogModel = require("./auditLog.model");

// Initialize models
const Tenant = TenantModel(sequelize);
const User = UserModel(sequelize);
const Project = ProjectModel(sequelize);
const Task = TaskModel(sequelize);
const AuditLog = AuditLogModel(sequelize);

// Associations
// Tenant -> User
Tenant.hasMany(User, { foreignKey: "tenant_id", onDelete: "CASCADE" });
User.belongsTo(Tenant, { foreignKey: "tenant_id" });

// Tenant -> Project
Tenant.hasMany(Project, { foreignKey: "tenant_id", onDelete: "CASCADE" });
Project.belongsTo(Tenant, { foreignKey: "tenant_id" });

// User -> Project (Creator)
User.hasMany(Project, { foreignKey: "created_by", as: "createdProjects" });
Project.belongsTo(User, { foreignKey: "created_by", as: "creator" });

// Project -> Task
Project.hasMany(Task, { foreignKey: "project_id", onDelete: "CASCADE" });
Task.belongsTo(Project, { foreignKey: "project_id" });

// Tenant -> Task
Tenant.hasMany(Task, { foreignKey: "tenant_id", onDelete: "CASCADE" });
Task.belongsTo(Tenant, { foreignKey: "tenant_id" });

// User -> Task (Assignee)
User.hasMany(Task, { foreignKey: "assigned_to", as: "assignedTasks" });
Task.belongsTo(User, { foreignKey: "assigned_to", as: "assignee" });

// AuditLog Associations
Tenant.hasMany(AuditLog, { foreignKey: "tenant_id" });
AuditLog.belongsTo(Tenant, { foreignKey: "tenant_id" });
User.hasMany(AuditLog, { foreignKey: "user_id" });
AuditLog.belongsTo(User, { foreignKey: "user_id" });

// Export
module.exports = {
  sequelize,
  Tenant,
  User,
  Project,
  Task,
  AuditLog,
};
