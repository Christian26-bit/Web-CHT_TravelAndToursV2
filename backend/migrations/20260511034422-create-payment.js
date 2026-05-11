'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      BookingID: {
        type: Sequelize.INTEGER
      },
      Amount: {
        type: Sequelize.DECIMAL
      },
      PaymentDate: {
        type: Sequelize.DATE
      },
      Method: {
        type: Sequelize.STRING
      },
      Status: {
        type: Sequelize.STRING
      },
      ReferenceNumber: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Payments');
  }
};