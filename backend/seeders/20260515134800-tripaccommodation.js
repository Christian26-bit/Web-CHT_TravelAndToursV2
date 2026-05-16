'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tripaccomodations', [
      { TripAccommodationID: 1, TripID: 31, AccommodationID: 1, CheckInDate: '2026-02-02', CheckOutDate: '2026-02-03', RoomType: 'Standard Room', IsIncluded: 1 },
      { TripAccommodationID: 2, TripID: 32, AccommodationID: 1, CheckInDate: '2026-02-03', CheckOutDate: '2026-02-04', RoomType: 'Standard Room', IsIncluded: 1 },
      { TripAccommodationID: 3, TripID: 33, AccommodationID: 1, CheckInDate: '2026-02-04', CheckOutDate: '2026-02-05', RoomType: 'Standard Room', IsIncluded: 1 },
      { TripAccommodationID: 4, TripID: 34, AccommodationID: 1, CheckInDate: '2026-02-05', CheckOutDate: '2026-02-06', RoomType: 'Standard Room', IsIncluded: 1 },
      { TripAccommodationID: 5, TripID: 35, AccommodationID: 1, CheckInDate: '2026-02-06', CheckOutDate: '2026-02-07', RoomType: 'Standard Room', IsIncluded: 1 },
      { TripAccommodationID: 6, TripID: 41, AccommodationID: 2, CheckInDate: '2026-03-05', CheckOutDate: '2026-03-06', RoomType: 'Standard Room', IsIncluded: 1 },
      { TripAccommodationID: 7, TripID: 42, AccommodationID: 2, CheckInDate: '2026-03-06', CheckOutDate: '2026-03-07', RoomType: 'Standard Room', IsIncluded: 1 },
      { TripAccommodationID: 8, TripID: 43, AccommodationID: 2, CheckInDate: '2026-03-07', CheckOutDate: '2026-03-08', RoomType: 'Standard Room', IsIncluded: 1 },
      { TripAccommodationID: 9, TripID: 51, AccommodationID: 3, CheckInDate: '2025-12-25', CheckOutDate: '2025-12-26', RoomType: 'Deluxe Room', IsIncluded: 1 },
      { TripAccommodationID: 10, TripID: 52, AccommodationID: 3, CheckInDate: '2025-12-26', CheckOutDate: '2025-12-27', RoomType: 'Deluxe Room', IsIncluded: 1 },
      { TripAccommodationID: 11, TripID: 53, AccommodationID: 3, CheckInDate: '2025-12-27', CheckOutDate: '2025-12-28', RoomType: 'Deluxe Room', IsIncluded: 1 },
      { TripAccommodationID: 12, TripID: 61, AccommodationID: 5, CheckInDate: '2026-02-27', CheckOutDate: '2026-02-28', RoomType: 'Standard Room', IsIncluded: 1 },
      { TripAccommodationID: 13, TripID: 62, AccommodationID: 5, CheckInDate: '2026-02-28', CheckOutDate: '2026-03-01', RoomType: 'Standard Room', IsIncluded: 1 },
      { TripAccommodationID: 14, TripID: 63, AccommodationID: 4, CheckInDate: '2026-03-01', CheckOutDate: '2026-03-02', RoomType: 'Standard Room', IsIncluded: 1 },
      { TripAccommodationID: 15, TripID: 64, AccommodationID: 4, CheckInDate: '2026-03-02', CheckOutDate: '2026-03-03', RoomType: 'Standard Room', IsIncluded: 1 }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tripaccomodations', null, {});
  }
};

