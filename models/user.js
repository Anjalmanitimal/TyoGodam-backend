// models/User.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Email should be unique
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // Association: A user can have many spaces
  User.associate = (models) => {
    User.hasMany(models.Space, { foreignKey: 'ownerId', as: 'spaces' });
  };

  return User;
};
