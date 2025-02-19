'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Spaces", "imageUrl", {
      type: Sequelize.STRING,
      allowNull: true, // Allow spaces without images
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Spaces", "imageUrl");
  },
};
