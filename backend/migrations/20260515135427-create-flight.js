'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('flights', {
      FlightId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      airline: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      flightNumber: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      departureGate: {
        type: Sequelize.STRING(10)
      },
      arrivalGate: {
        type: Sequelize.STRING(10)
      },
      status: {
        type: Sequelize.ENUM('ON TIME', 'DELAYED', 'CANCELLED', 'IN AIR', 'ARRIVED'),
        defaultValue: 'ON TIME'
      },
      departureTime: {
        type: Sequelize.DATE
      },
      arrivalTime: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('flights');
  }
};