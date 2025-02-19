const { Sequelize, DataTypes } = require('sequelize');

// Ensure that the `DB_URI` is correct, and include the dialect (postgres)
const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: 'postgres', // Explicitly specify the dialect
});

// Import models
const User = require('./user')(sequelize, DataTypes);
const Space = require('./Space')(sequelize, DataTypes);
const Booking = require('./Booking')(sequelize, DataTypes); // Add this

// Define relationships
User.hasMany(Space, { foreignKey: 'userId' });
Space.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Booking, { foreignKey: 'userId' }); // User can have many bookings
Space.hasMany(Booking, { foreignKey: 'spaceId' }); // Space can have many bookings
Booking.belongsTo(User, { foreignKey: 'userId' });
Booking.belongsTo(Space, { foreignKey: 'spaceId' });

// Export models
module.exports = { sequelize, User, Space, Booking }; // Add Booking here
