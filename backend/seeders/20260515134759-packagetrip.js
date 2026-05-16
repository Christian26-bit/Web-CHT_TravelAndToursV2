'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('packagetrips', [
      { PackageTripID: 101, PackageID: 10, TripID: 31, Sequence: 1, DayOfPackage: 1 },
      { PackageTripID: 102, PackageID: 10, TripID: 32, Sequence: 2, DayOfPackage: 2 },
      { PackageTripID: 103, PackageID: 10, TripID: 33, Sequence: 3, DayOfPackage: 3 },
      { PackageTripID: 104, PackageID: 10, TripID: 34, Sequence: 4, DayOfPackage: 4 },
      { PackageTripID: 105, PackageID: 10, TripID: 35, Sequence: 5, DayOfPackage: 5 },
      { PackageTripID: 106, PackageID: 10, TripID: 36, Sequence: 6, DayOfPackage: 6 },
      { PackageTripID: 111, PackageID: 11, TripID: 41, Sequence: 1, DayOfPackage: 1 },
      { PackageTripID: 112, PackageID: 11, TripID: 42, Sequence: 2, DayOfPackage: 2 },
      { PackageTripID: 113, PackageID: 11, TripID: 43, Sequence: 3, DayOfPackage: 3 },
      { PackageTripID: 114, PackageID: 11, TripID: 44, Sequence: 4, DayOfPackage: 4 },
      { PackageTripID: 121, PackageID: 12, TripID: 51, Sequence: 1, DayOfPackage: 1 },
      { PackageTripID: 122, PackageID: 12, TripID: 52, Sequence: 2, DayOfPackage: 2 },
      { PackageTripID: 123, PackageID: 12, TripID: 53, Sequence: 3, DayOfPackage: 3 },
      { PackageTripID: 124, PackageID: 12, TripID: 54, Sequence: 4, DayOfPackage: 4 },
      { PackageTripID: 131, PackageID: 13, TripID: 61, Sequence: 1, DayOfPackage: 1 },
      { PackageTripID: 132, PackageID: 13, TripID: 62, Sequence: 2, DayOfPackage: 2 },
      { PackageTripID: 133, PackageID: 13, TripID: 63, Sequence: 3, DayOfPackage: 3 },
      { PackageTripID: 134, PackageID: 13, TripID: 64, Sequence: 4, DayOfPackage: 4 }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('packagetrips', null, {});
  }
};

