"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "employee",
      [
        {
          employeeId: 1,
          name: "admin",
          email: "admin@cht.com",
          password:
            "$2y$10$eveTnsh7rw/smuXCfep4oOe9ga78uBQ6UW0uXYa44VgEPRg8oOq6W",
          contactNumber: "09170000001",
          isManager: 1,
          isActive: 1,
        },
        {
          employeeId: 3,
          name: "Anna Reyes",
          email: "anna.reyes@agency.com",
          password:
            "$2y$10$2SxJEzuUwbV2TgFyBK2Bp.kPwQ4rBMyncIelXR.6S7DFIuZESVWHG",
          contactNumber: "09170000001",
          isManager: 1,
          isActive: 1,
        },
        {
          employeeId: 4,
          name: "Mark Santos",
          email: "mark.santos@agency.com",
          password:
            "$2y$10$jQKOurbxf6Zje1KCzE3AfuDOYLJkbP3HV5VsC1Px8P5OdMh2YhIF2",
          contactNumber: "09170000002",
          isManager: 0,
          isActive: 1,
        },
        {
          employeeId: 5,
          name: "John Cruz",
          email: "john.cruz@agency.com",
          password: "4fa70413cfd834128f50a790be4d1e0c9b7a84ac",
          contactNumber: "09170000003",
          isManager: 0,
          isActive: 1,
        },
        {
          employeeId: 7,
          name: "Leo Dela Cruz",
          email: "leo.delacruz@agency.com",
          password: "32a5a8da46842cbb0572a07debf8484a9850e658",
          contactNumber: "09170000005",
          isManager: 0,
          isActive: 0,
        },
        {
          employeeId: 9,
          name: "employee",
          email: "employee@cht.com",
          password:
            "$2b$10$XhO0OUElqVmTxxnt3B/qLu4DOxMZFfv5HspXDtJJJLQY65Hbut2tC",
          contactNumber: "09212334456",
          isManager: 0,
          isActive: 1,
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("employee", null, {});
  },
};
