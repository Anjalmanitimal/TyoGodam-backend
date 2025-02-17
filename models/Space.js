// models/Space.js

module.exports = (sequelize, DataTypes) => {
    const Space = sequelize.define('Space', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    });
  
    return Space;
  };
  