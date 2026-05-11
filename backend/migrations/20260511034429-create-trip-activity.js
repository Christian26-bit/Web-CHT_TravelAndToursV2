'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TripActivities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      TripID: {
        type: Sequelize.INTEGER
      },
      ActivityID: {
        type: Sequelize.INTEGER
      },
      Location: {
        type: Sequelize.STRING
      },
      StartDateTime: {
        type: Sequelize.DATE
      },
      EndDateTime: {
        type: Sequelize.DATE
      },
      GuideName: {
        type: Sequelize.STRING
      },
      EquipmentProvided: {
        type: Sequelize.STRING
      },
      IsIncluded: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('TripActivities');
  }
};