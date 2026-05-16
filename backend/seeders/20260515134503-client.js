'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('client', [
      {
        clientId: 1,
        name: 'Carlos Ramirez',
        email: 'carlos@example.com',
        address: 'Manila, PH',
        contactNumber: '09180000001',
        customerType: 'REGULAR',
        dateRegistered: '2025-01-05'
      },
      {
        clientId: 2,
        name: 'Jenny Villanueva',
        email: 'jennyv@example.com',
        address: 'Quezon City, PH',
        contactNumber: '09180000002',
        customerType: 'REGULAR',
        dateRegistered: '2025-01-10'
      },
      {
        clientId: 3,
        name: 'Sunrise Corp.',
        email: 'travel@sunrisecorp.com',
        address: 'Makati, PH',
        contactNumber: '09180000003',
        customerType: 'CORPORATE',
        dateRegistered: '2025-01-15'
      },
      {
        clientId: 4,
        name: 'Miguel Santos',
        email: 'miguel.s@example.com',
        address: 'Cebu City, PH',
        contactNumber: '09180000004',
        customerType: 'REGULAR',
        dateRegistered: '2025-02-01'
      },
      {
        clientId: 5,
        name: 'Andrea Bautista',
        email: 'andrea.b@example.com',
        address: 'Davao City, PH',
        contactNumber: '09180000005',
        customerType: 'VIP',
        dateRegistered: '2025-02-10'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('client', null, {});
  }
};

