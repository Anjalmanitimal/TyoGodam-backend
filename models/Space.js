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
    imageUrl: {
      type: DataTypes.STRING, // Store image path
      allowNull: true, // Optional field
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }, // Foreign key for space owner
  });

  // Association: A space belongs to a user (owner)
  Space.associate = (models) => {
    Space.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner' });
  };

  return Space;
};
