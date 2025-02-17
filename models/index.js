// models/index.js

const { Sequelize, DataTypes } = require('sequelize');

// Ensure that the `DB_URI` is correct, and include the dialect (postgres)
const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: 'postgres', // Explicitly specify the dialect
});

// Import models
const User = require('./user')(sequelize, DataTypes);
const Space = require('./Space')(sequelize, DataTypes);

// Define relationships
User.hasMany(Space, { foreignKey: 'userId' });
Space.belongsTo(User, { foreignKey: 'userId' });

// Export models
module.exports = { sequelize, User, Space };
