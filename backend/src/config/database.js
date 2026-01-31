const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: console.log,
  }
);

const fs = require('fs');
const path = require('path');

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully!');

    // Sync models
    await sequelize.sync({ alter: true });

    // Check if seeding is needed (check for super admin)
    try {
      const [results] = await sequelize.query("SELECT * FROM users WHERE email = 'superadmin@system.com'");
      if (results.length === 0) {
        console.log('Seeding database...');
        const seedPath = path.join(__dirname, '../../seeds/seed_data.sql');
        if (fs.existsSync(seedPath)) {
          const seedSql = fs.readFileSync(seedPath, 'utf8');
          // Execute SQL
          try {
            await sequelize.query(seedSql);
            console.log('Database seeded successfully.');
          } catch (seedError) {
            console.error('Seeding failed:', seedError);
          }
        } else {
          console.warn('Seed file not found at', seedPath);
        }
      }
    } catch (queryError) {
      console.error('Check superadmin query failed:', queryError);
    }

  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1); // stop server if DB fails
  }
};

module.exports = { sequelize, connectDB };
