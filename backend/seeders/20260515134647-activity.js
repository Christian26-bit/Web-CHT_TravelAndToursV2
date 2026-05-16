'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('activity', [
      { activityId: 201, name: 'Bibai Snowland Activities', description: 'Snow play and activities at Bibai Snowland', defaultLocation: 'Bibai, Hokkaido', defaultDuration: 3, isIncludedByDefault: 1 },
      { activityId: 202, name: 'Ginga & Ryusei Waterfalls', description: 'Scenic twin waterfalls viewing', defaultLocation: 'Hokkaido', defaultDuration: 4, isIncludedByDefault: 1 },
      { activityId: 203, name: 'Monbetsu Icebreaker Cruise', description: 'Drift ice cruise from Monbetsu', defaultLocation: 'Monbetsu, Hokkaido', defaultDuration: 4, isIncludedByDefault: 1 },
      { activityId: 204, name: 'Tokkari Center Seals', description: 'Visit Tokkari Center and see seals', defaultLocation: 'Monbetsu, Hokkaido', defaultDuration: 2, isIncludedByDefault: 1 },
      { activityId: 205, name: 'Asahiyama Zoo Penguin Parade', description: 'Penguin parade at Asahiyama Zoo', defaultLocation: 'Asahikawa', defaultDuration: 4, isIncludedByDefault: 1 },
      { activityId: 206, name: 'Sapporo Snow Festival', description: 'Snow and ice sculptures at Odori Park', defaultLocation: 'Sapporo', defaultDuration: 5, isIncludedByDefault: 1 },
      { activityId: 207, name: 'Hokkaido Shrine Visit', description: 'Visit historic Hokkaido Shrine', defaultLocation: 'Sapporo', defaultDuration: 2, isIncludedByDefault: 1 },
      { activityId: 208, name: 'Mitsui Outlet Shopping', description: 'Shopping at Mitsui Outlet Mall', defaultLocation: 'Sapporo', defaultDuration: 3, isIncludedByDefault: 1 },
      { activityId: 209, name: 'Lake Shikotsu Ice Festival', description: 'Ice festival at Lake Shikotsu', defaultLocation: 'Lake Shikotsu', defaultDuration: 4, isIncludedByDefault: 1 },
      { activityId: 210, name: 'All-You-Can-Eat Crab Buffet', description: 'Crab buffet dinner', defaultLocation: 'Hokkaido', defaultDuration: 2, isIncludedByDefault: 1 },
      { activityId: 221, name: 'HK City Highlights', description: 'HK city tour: Victoria Peak, Avenue of Stars…', defaultLocation: 'Hong Kong', defaultDuration: 6, isIncludedByDefault: 1 },
      { activityId: 222, name: 'Macau Highlights', description: 'Macau: Ruins of St Paul, A-Ma Temple, etc.', defaultLocation: 'Macau', defaultDuration: 8, isIncludedByDefault: 1 },
      { activityId: 223, name: 'Disney Hong Kong (Optional)', description: 'Full-day at Hong Kong Disneyland', defaultLocation: 'Hong Kong', defaultDuration: 10, isIncludedByDefault: 0 },
      { activityId: 231, name: 'Ulun Danu Temple', description: 'Ulun Danu Temple visit', defaultLocation: 'Bali', defaultDuration: 3, isIncludedByDefault: 1 },
      { activityId: 232, name: 'Beratan Lake', description: 'Sightseeing at Beratan Lake', defaultLocation: 'Bali', defaultDuration: 2, isIncludedByDefault: 1 },
      { activityId: 233, name: 'Tanah Lot Temple', description: 'Sunset at Tanah Lot', defaultLocation: 'Bali', defaultDuration: 3, isIncludedByDefault: 1 },
      { activityId: 234, name: 'D Tukad Waterfall', description: 'Visit and photo spots at D Tukad Waterfall', defaultLocation: 'Bali', defaultDuration: 3, isIncludedByDefault: 1 },
      { activityId: 241, name: 'Chung-she Flower Garden', description: 'Taichung flower garden visit', defaultLocation: 'Taichung', defaultDuration: 3, isIncludedByDefault: 1 },
      { activityId: 242, name: 'Sun Moon Lake Cruise', description: 'Boat cruise on Sun Moon Lake', defaultLocation: 'Nantou', defaultDuration: 4, isIncludedByDefault: 1 },
      { activityId: 243, name: 'Tea Garden Visit', description: 'Scenic tea garden + tea tasting', defaultLocation: 'Taiwan', defaultDuration: 3, isIncludedByDefault: 1 },
      { activityId: 244, name: 'LOHAS Park / Shilin Garden', description: 'Seasonal cherry blossoms or Shilin Residence', defaultLocation: 'Taipei', defaultDuration: 3, isIncludedByDefault: 1 },
      { activityId: 245, name: 'Liberty Square & Chiang Kai-shek', description: 'Honor guard ceremony at Liberty Square', defaultLocation: 'Taipei', defaultDuration: 2, isIncludedByDefault: 1 },
      { activityId: 246, name: 'Taipei 101 Outside View', description: 'Photo stop around Taipei 101', defaultLocation: 'Taipei', defaultDuration: 2, isIncludedByDefault: 1 }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('activity', null, {});
  }
};

