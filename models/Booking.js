module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define("Booking", {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      spaceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "Pending",
      },
    });
  
    return Booking;
  };
  