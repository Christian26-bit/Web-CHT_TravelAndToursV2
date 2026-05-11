'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TripVehicles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      TripID: {
        type: Sequelize.INTEGER
      },
      VehicleID: {
        type: Sequelize.INTEGER
      },
      DepartureLocation: {
        type: Sequelize.STRING
      },
      ArrivalLocation: {
        type: Sequelize.STRING
      },
      DepartureDateTime: {
        type: Sequelize.DATE
      },
      ArrivalDateTime: {
        type: Sequelize.DATE
      },
      SeatNumber: {
        type: Sequelize.STRING
      },
      TicketReference: {
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
    await queryInterface.dropTable('TripVehicles');
  }
};