'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('vehicle', [
      {
        VehicleID: 1,
        Type: 'Bus',
        Capacity: 40,
        PlateNumber: 'HOK-1234',
        ProviderName: 'Hokkaido Tours Co. (Japan)'
      },
      {
        VehicleID: 2,
        Type: 'Bus',
        Capacity: 45,
        PlateNumber: 'HK-5678',
        ProviderName: 'Hong Kong Coaches (China)'
      },
      {
        VehicleID: 3,
        Type: 'Bus',
        Capacity: 35,
        PlateNumber: 'BALI-009',
        ProviderName: 'Bali Transport (Indonesia)'
      },
      {
        VehicleID: 4,
        Type: 'Bus',
        Capacity: 40,
        PlateNumber: 'TPE-2026',
        ProviderName: 'Taiwan Coaches (Taiwan)'
      },
      {
        VehicleID: 5,
        Type: 'Plane',
        Capacity: 180,
        PlateNumber: 'N/A',
        ProviderName: 'Various Airlines'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('vehicle', null, {});
  }
};

