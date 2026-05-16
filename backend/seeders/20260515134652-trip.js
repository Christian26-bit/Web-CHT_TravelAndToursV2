'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('trip', [
      { TripID: 31, Name: 'Arrival & Bibai Snowland', Description: 'Arrival in Hokkaido + Bibai Snowland', Location: 'Hokkaido', StartDate: '2026-02-02', EndDate: '2026-02-02', IsActive: 1 },
      { TripID: 32, Name: 'Ginga & Ryusei Waterfalls', Description: 'Scenic waterfalls and winter views', Location: 'Hokkaido', StartDate: '2026-02-03', EndDate: '2026-02-03', IsActive: 1 },
      { TripID: 33, Name: 'Monbetsu Icebreaker & Seals', Description: 'Icebreaker cruise & Tokkari Center', Location: 'Hokkaido', StartDate: '2026-02-04', EndDate: '2026-02-04', IsActive: 1 },
      { TripID: 34, Name: 'Asahiyama Zoo & Penguin Parade', Description: 'Zoo visit with penguin parade', Location: 'Hokkaido', StartDate: '2026-02-05', EndDate: '2026-02-05', IsActive: 1 },
      { TripID: 35, Name: 'Sapporo Snow Festival & Shopping', Description: 'Snow Festival, Hokkaido Shrine, Outlet', Location: 'Sapporo', StartDate: '2026-02-06', EndDate: '2026-02-06', IsActive: 1 },
      { TripID: 36, Name: 'Lake Shikotsu & Departure', Description: 'Lake Shikotsu Ice Festival, fly home', Location: 'Hokkaido', StartDate: '2026-02-07', EndDate: '2026-02-07', IsActive: 1 },
      { TripID: 41, Name: 'Arrival & Hong Kong City Tour', Description: 'Arrival + HK city highlights', Location: 'Hong Kong', StartDate: '2026-03-05', EndDate: '2026-03-05', IsActive: 1 },
      { TripID: 42, Name: 'Hong Kong Free Day', Description: 'Free day to explore Hong Kong', Location: 'Hong Kong', StartDate: '2026-03-06', EndDate: '2026-03-06', IsActive: 1 },
      { TripID: 43, Name: 'Macau Day Tour', Description: 'Full-day Macau highlights', Location: 'Macau', StartDate: '2026-03-07', EndDate: '2026-03-07', IsActive: 1 },
      { TripID: 44, Name: 'Departure', Description: 'Last-minute shopping and departure', Location: 'Hong Kong', StartDate: '2026-03-08', EndDate: '2026-03-08', IsActive: 1 },
      { TripID: 51, Name: 'Arrival & City Intro', Description: 'Arrival in Bali, short city tour', Location: 'Bali', StartDate: '2025-12-25', EndDate: '2025-12-25', IsActive: 1 },
      { TripID: 52, Name: 'Ulun Danu & Beratan', Description: 'Ulun Danu Temple & Beratan Lake', Location: 'Bali', StartDate: '2025-12-26', EndDate: '2025-12-26', IsActive: 1 },
      { TripID: 53, Name: 'Tanah Lot & Waterfalls', Description: 'Tanah Lot & Tukad Waterfall', Location: 'Bali', StartDate: '2025-12-27', EndDate: '2025-12-27', IsActive: 1 },
      { TripID: 54, Name: 'Free Time & Departure', Description: 'Free time then airport transfer', Location: 'Bali', StartDate: '2025-12-28', EndDate: '2025-12-28', IsActive: 1 },
      { TripID: 61, Name: 'Arrival & Taichung Flowers', Description: 'Chung-she Flower Garden, Taichung sights', Location: 'Taichung', StartDate: '2026-02-27', EndDate: '2026-02-27', IsActive: 1 },
      { TripID: 62, Name: 'Sun Moon Lake & Tea Garden', Description: 'Lake cruise and tea garden visit', Location: 'Taichung', StartDate: '2026-02-28', EndDate: '2026-02-28', IsActive: 1 },
      { TripID: 63, Name: 'Taipei City Highlights', Description: 'LOHAS Park/Cherry blossoms, Liberty Square', Location: 'Taipei', StartDate: '2026-03-01', EndDate: '2026-03-01', IsActive: 1 },
      { TripID: 64, Name: 'Yehliu, Shifen & Departure', Description: 'Yehliu, Shifen, sky lantern, night markets', Location: 'Taipei', StartDate: '2026-03-02', EndDate: '2026-03-02', IsActive: 1 }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('trip', null, {});
  }
};

