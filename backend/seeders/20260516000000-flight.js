'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('flights', [
      {
        airline: 'Skyline Airways',
        flightNumber: 'SK-402',
        departureGate: 'G12',
        arrivalGate: 'A4',
        status: 'ON TIME',
        departureTime: new Date(new Date().setHours(new Date().getHours() + 24)),
        arrivalTime: new Date(new Date().setHours(new Date().getHours() + 27)),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        airline: 'Pacific Connect',
        flightNumber: 'PC-881',
        departureGate: 'T2',
        arrivalGate: 'B1',
        status: 'ON TIME',
        departureTime: new Date(new Date().setHours(new Date().getHours() + 48)),
        arrivalTime: new Date(new Date().setHours(new Date().getHours() + 52)),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        airline: 'Aero Regional',
        flightNumber: 'AR-055',
        departureGate: 'D3',
        arrivalGate: 'C2',
        status: 'DELAYED',
        departureTime: new Date(new Date().setHours(new Date().getHours() + 12)),
        arrivalTime: new Date(new Date().setHours(new Date().getHours() + 14)),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        airline: 'Global Wings',
        flightNumber: 'GW-909',
        departureGate: 'H4',
        arrivalGate: 'T1',
        status: 'ON TIME',
        departureTime: new Date(new Date().setHours(new Date().getHours() + 72)),
        arrivalTime: new Date(new Date().setHours(new Date().getHours() + 84)),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('flights', null, {});
  }
};
