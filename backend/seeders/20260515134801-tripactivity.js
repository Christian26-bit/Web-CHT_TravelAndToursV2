'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tripsactivities', [
      { TripActivityID: 301, TripID: 31, ActivityID: 201, Location: 'Bibai Snowland', StartDateTime: '2026-02-02 14:00:00', EndDateTime: '2026-02-02 17:00:00', GuideName: 'Local Guide', EquipmentProvided: 'Snow gear (rental)', IsIncluded: 1 },
      { TripActivityID: 302, TripID: 32, ActivityID: 202, Location: 'Hokkaido', StartDateTime: '2026-02-03 10:00:00', EndDateTime: '2026-02-03 16:00:00', GuideName: 'Local Guide', EquipmentProvided: 'Transport', IsIncluded: 1 },
      { TripActivityID: 303, TripID: 33, ActivityID: 203, Location: 'Monbetsu Port', StartDateTime: '2026-02-04 09:00:00', EndDateTime: '2026-02-04 13:00:00', GuideName: 'Cruise Staff', EquipmentProvided: 'Life vests', IsIncluded: 1 },
      { TripActivityID: 304, TripID: 33, ActivityID: 204, Location: 'Tokkari Center', StartDateTime: '2026-02-04 14:00:00', EndDateTime: '2026-02-04 16:00:00', GuideName: 'Local Guide', EquipmentProvided: 'Entrance ticket', IsIncluded: 1 },
      { TripActivityID: 305, TripID: 34, ActivityID: 205, Location: 'Asahiyama Zoo', StartDateTime: '2026-02-05 10:00:00', EndDateTime: '2026-02-05 15:00:00', GuideName: 'Zoo Guide', EquipmentProvided: 'Zoo tickets', IsIncluded: 1 },
      { TripActivityID: 306, TripID: 35, ActivityID: 206, Location: 'Odori Park', StartDateTime: '2026-02-06 10:00:00', EndDateTime: '2026-02-06 16:00:00', GuideName: 'Tour Leader', EquipmentProvided: 'Festival access', IsIncluded: 1 },
      { TripActivityID: 307, TripID: 35, ActivityID: 207, Location: 'Hokkaido Shrine', StartDateTime: '2026-02-06 16:30:00', EndDateTime: '2026-02-06 18:00:00', GuideName: 'Tour Leader', EquipmentProvided: null, IsIncluded: 1 },
      { TripActivityID: 308, TripID: 35, ActivityID: 208, Location: 'Mitsui Outlet', StartDateTime: '2026-02-06 18:00:00', EndDateTime: '2026-02-06 21:00:00', GuideName: 'Tour Leader', EquipmentProvided: null, IsIncluded: 1 },
      { TripActivityID: 309, TripID: 36, ActivityID: 209, Location: 'Lake Shikotsu', StartDateTime: '2026-02-07 09:00:00', EndDateTime: '2026-02-07 13:00:00', GuideName: 'Local Guide', EquipmentProvided: 'Entrance ticket', IsIncluded: 1 },
      { TripActivityID: 310, TripID: 36, ActivityID: 210, Location: 'Hokkaido Restaurant', StartDateTime: '2026-02-07 17:00:00', EndDateTime: '2026-02-07 19:00:00', GuideName: 'Tour Leader', EquipmentProvided: 'Crab buffet', IsIncluded: 1 },
      { TripActivityID: 321, TripID: 41, ActivityID: 221, Location: 'Hong Kong', StartDateTime: '2026-03-05 10:00:00', EndDateTime: '2026-03-05 18:00:00', GuideName: 'HK Guide', EquipmentProvided: 'Coach transport', IsIncluded: 1 },
      { TripActivityID: 322, TripID: 42, ActivityID: 223, Location: 'Hong Kong', StartDateTime: '2026-03-06 09:00:00', EndDateTime: '2026-03-06 19:00:00', GuideName: 'Disney Guide', EquipmentProvided: 'Park ticket', IsIncluded: 0 },
      { TripActivityID: 323, TripID: 43, ActivityID: 222, Location: 'Macau', StartDateTime: '2026-03-07 09:00:00', EndDateTime: '2026-03-07 20:00:00', GuideName: 'Macau Guide', EquipmentProvided: 'Ferry + coach', IsIncluded: 1 },
      { TripActivityID: 324, TripID: 44, ActivityID: 221, Location: 'Hong Kong', StartDateTime: '2026-03-08 10:00:00', EndDateTime: '2026-03-08 15:00:00', GuideName: 'HK Guide', EquipmentProvided: 'Coach transport', IsIncluded: 1 },
      { TripActivityID: 331, TripID: 52, ActivityID: 231, Location: 'Ulun Danu Temple', StartDateTime: '2025-12-26 09:00:00', EndDateTime: '2025-12-26 12:00:00', GuideName: 'Bali Guide', EquipmentProvided: 'Transport', IsIncluded: 1 },
      { TripActivityID: 332, TripID: 52, ActivityID: 232, Location: 'Beratan Lake', StartDateTime: '2025-12-26 13:00:00', EndDateTime: '2025-12-26 16:00:00', GuideName: 'Bali Guide', EquipmentProvided: 'Boat (if any)', IsIncluded: 1 },
      { TripActivityID: 333, TripID: 53, ActivityID: 233, Location: 'Tanah Lot', StartDateTime: '2025-12-27 15:00:00', EndDateTime: '2025-12-27 19:00:00', GuideName: 'Bali Guide', EquipmentProvided: 'Transport', IsIncluded: 1 },
      { TripActivityID: 334, TripID: 53, ActivityID: 234, Location: 'D Tukad Waterfall', StartDateTime: '2025-12-27 09:00:00', EndDateTime: '2025-12-27 13:00:00', GuideName: 'Bali Guide', EquipmentProvided: 'Entrance', IsIncluded: 1 },
      { TripActivityID: 341, TripID: 61, ActivityID: 241, Location: 'Taichung', StartDateTime: '2026-02-27 10:00:00', EndDateTime: '2026-02-27 14:00:00', GuideName: 'TW Guide', EquipmentProvided: 'Transport', IsIncluded: 1 },
      { TripActivityID: 342, TripID: 62, ActivityID: 242, Location: 'Sun Moon Lake', StartDateTime: '2026-02-28 09:00:00', EndDateTime: '2026-02-28 14:00:00', GuideName: 'TW Guide', EquipmentProvided: 'Boat ticket', IsIncluded: 1 },
      { TripActivityID: 343, TripID: 62, ActivityID: 243, Location: 'Tea Garden', StartDateTime: '2026-02-28 15:00:00', EndDateTime: '2026-02-28 18:00:00', GuideName: 'TW Guide', EquipmentProvided: 'Tea samples', IsIncluded: 1 },
      { TripActivityID: 344, TripID: 63, ActivityID: 244, Location: 'Taipei', StartDateTime: '2026-03-01 09:30:00', EndDateTime: '2026-03-01 13:00:00', GuideName: 'TW Guide', EquipmentProvided: 'Transport', IsIncluded: 1 },
      { TripActivityID: 345, TripID: 63, ActivityID: 245, Location: 'Liberty Square', StartDateTime: '2026-03-01 13:30:00', EndDateTime: '2026-03-01 16:00:00', GuideName: 'TW Guide', EquipmentProvided: null, IsIncluded: 1 },
      { TripActivityID: 346, TripID: 63, ActivityID: 246, Location: 'Taipei 101 Area', StartDateTime: '2026-03-01 16:30:00', EndDateTime: '2026-03-01 18:00:00', GuideName: 'TW Guide', EquipmentProvided: null, IsIncluded: 1 },
      { TripActivityID: 347, TripID: 63, ActivityID: 247, Location: 'Ximending', StartDateTime: '2026-03-01 18:00:00', EndDateTime: '2026-03-01 21:00:00', GuideName: 'TW Guide', EquipmentProvided: null, IsIncluded: 1 },
      { TripActivityID: 348, TripID: 64, ActivityID: 248, Location: 'Yehliu', StartDateTime: '2026-03-02 09:00:00', EndDateTime: '2026-03-02 13:00:00', GuideName: 'TW Guide', EquipmentProvided: 'Transport', IsIncluded: 1 },
      { TripActivityID: 349, TripID: 64, ActivityID: 249, Location: 'Shifen', StartDateTime: '2026-03-02 14:00:00', EndDateTime: '2026-03-02 19:00:00', GuideName: 'TW Guide', EquipmentProvided: '1 sky lantern', IsIncluded: 1 }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tripsactivities', null, {});
  }
};

