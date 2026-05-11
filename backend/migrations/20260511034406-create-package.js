'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Packages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Name: {
        type: Sequelize.STRING
      },
      Description: {
        type: Sequelize.TEXT
      },
      Destination: {
        type: Sequelize.STRING
      },
      Duration: {
        type: Sequelize.INTEGER
      },
      MaxPax: {
        type: Sequelize.INTEGER
      },
      Inclusions: {
        type: Sequelize.TEXT
      },
      Price: {
        type: Sequelize.DECIMAL
      },
      IsActive: {
        type: Sequelize.BOOLEAN
      },
      CreatedByEmployeeID: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Packages');
  }
};