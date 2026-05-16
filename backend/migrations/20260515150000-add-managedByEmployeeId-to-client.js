'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('client', 'managedByEmployeeId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'employee',
        key: 'employeeId'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('client', 'managedByEmployeeId');
  }
};
