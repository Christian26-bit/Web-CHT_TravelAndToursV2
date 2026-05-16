'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('package', [
      {
        PackageID: 10,
        Name: 'Hokkaido Icebreaker + Sapporo Snow Festival',
        Description: 'Drift ice cruise, penguins, snow festival in Hokkaido',
        Destination: 'Hokkaido, Japan',
        Duration: 6,
        MaxPax: 30,
        Inclusions: 'flights, hotel, tours, some meals',
        Price: '2288.00',
        IsActive: 1,
        CreatedByEmployeeID: 1
      },
      {
        PackageID: 11,
        Name: 'Hong Kong & Macau Getaway',
        Description: 'City highlights of Hong Kong and Macau with optional Disney',
        Destination: 'Hong Kong & Macau',
        Duration: 4,
        MaxPax: 40,
        Inclusions: 'hotel, tours, some meals',
        Price: '449.00',
        IsActive: 1,
        CreatedByEmployeeID: 1
      },
      {
        PackageID: 12,
        Name: 'Bali 4D3N Christmas Tour',
        Description: 'Bali Christmas special visiting famous temples and waterfalls',
        Destination: 'Bali, Indonesia',
        Duration: 4,
        MaxPax: 20,
        Inclusions: 'flights, hotel, tours, breakfast',
        Price: '28888.00',
        IsActive: 1,
        CreatedByEmployeeID: 1
      },
      {
        PackageID: 13,
        Name: 'Taiwan Taipei + Taichung 4D3N',
        Description: 'Taipei and Taichung highlights, flower garden and night mkts',
        Destination: 'Taipei & Taichung, Taiwan',
        Duration: 4,
        MaxPax: 35,
        Inclusions: 'flights, hotel, tours, some meals',
        Price: '27988.00',
        IsActive: 1,
        CreatedByEmployeeID: 1
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('package', null, {});
  }
};

