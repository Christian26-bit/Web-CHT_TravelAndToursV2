'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('accommodation', [
      {
        accommodationId: 1,
        name: 'Sapporo Snow Hotel',
        address: 'Sapporo, Hokkaido, Japan',
        contact: '+81-11-000001',
        amenities: 'WiFi;Breakfast;Heater',
        numberOfRooms: 80,
        defaultRoomType: 'Standard Room'
      },
      {
        accommodationId: 2,
        name: 'Hong Kong City Hotel',
        address: 'Kowloon, Hong Kong',
        contact: '+852-0000002',
        amenities: 'WiFi;Breakfast',
        numberOfRooms: 120,
        defaultRoomType: 'Standard Room'
      },
      {
        accommodationId: 3,
        name: 'Bali Beach Resort',
        address: 'Kuta, Bali, Indonesia',
        contact: '+62-361-00003',
        amenities: 'Pool;Beachfront;WiFi',
        numberOfRooms: 60,
        defaultRoomType: 'Deluxe Room'
      },
      {
        accommodationId: 4,
        name: 'Taipei Downtown Hotel',
        address: 'Taipei, Taiwan',
        contact: '+886-2-000004',
        amenities: 'WiFi;Breakfast',
        numberOfRooms: 100,
        defaultRoomType: 'Standard Room'
      },
      {
        accommodationId: 5,
        name: 'Taichung Garden Hotel',
        address: 'Taichung, Taiwan',
        contact: '+886-4-000005',
        amenities: 'WiFi;Breakfast',
        numberOfRooms: 70,
        defaultRoomType: 'Standard Room'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('accommodation', null, {});
  }
};

