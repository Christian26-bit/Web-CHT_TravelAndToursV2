'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TripAccommodations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      TripID: {
        type: Sequelize.INTEGER
      },
      AccommodationID: {
        type: Sequelize.INTEGER
      },
      CheckInDate: {
        type: Sequelize.DATE
      },
      CheckOutDate: {
        type: Sequelize.DATE
      },
      RoomType: {
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
    await queryInterface.dropTable('TripAccommodations');
  }
};