'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tripvehicles', [
      { TripVehicleID: 1, TripID: 31, VehicleID: 5, DepartureLocation: 'Manila', ArrivalLocation: 'Sapporo', DepartureDateTime: '2026-02-02 01:00:00', ArrivalDateTime: '2026-02-02 08:00:00', SeatNumber: 'N/A', TicketReference: 'FLT-HKD-001', IsIncluded: 1 },
      { TripVehicleID: 2, TripID: 36, VehicleID: 5, DepartureLocation: 'Sapporo', ArrivalLocation: 'Manila', DepartureDateTime: '2026-02-07 21:00:00', ArrivalDateTime: '2026-02-08 02:00:00', SeatNumber: 'N/A', TicketReference: 'FLT-HKD-002', IsIncluded: 1 },
      { TripVehicleID: 3, TripID: 41, VehicleID: 5, DepartureLocation: 'Manila', ArrivalLocation: 'Hong Kong', DepartureDateTime: '2026-03-05 07:00:00', ArrivalDateTime: '2026-03-05 09:30:00', SeatNumber: 'N/A', TicketReference: 'FLT-HK-001', IsIncluded: 1 },
      { TripVehicleID: 4, TripID: 44, VehicleID: 5, DepartureLocation: 'Hong Kong', ArrivalLocation: 'Manila', DepartureDateTime: '2026-03-08 18:00:00', ArrivalDateTime: '2026-03-08 20:30:00', SeatNumber: 'N/A', TicketReference: 'FLT-HK-002', IsIncluded: 1 },
      { TripVehicleID: 5, TripID: 51, VehicleID: 5, DepartureLocation: 'Manila', ArrivalLocation: 'Denpasar', DepartureDateTime: '2025-12-25 06:00:00', ArrivalDateTime: '2025-12-25 09:00:00', SeatNumber: 'N/A', TicketReference: 'FLT-BALI-001', IsIncluded: 1 },
      { TripVehicleID: 6, TripID: 54, VehicleID: 5, DepartureLocation: 'Denpasar', ArrivalLocation: 'Manila', DepartureDateTime: '2025-12-28 21:00:00', ArrivalDateTime: '2025-12-29 00:00:00', SeatNumber: 'N/A', TicketReference: 'FLT-BALI-002', IsIncluded: 1 },
      { TripVehicleID: 7, TripID: 61, VehicleID: 5, DepartureLocation: 'Manila', ArrivalLocation: 'Taoyuan', DepartureDateTime: '2026-02-27 05:00:00', ArrivalDateTime: '2026-02-27 07:30:00', SeatNumber: 'N/A', TicketReference: 'FLT-TW-001', IsIncluded: 1 },
      { TripVehicleID: 8, TripID: 64, VehicleID: 5, DepartureLocation: 'Taoyuan', ArrivalLocation: 'Manila', DepartureDateTime: '2026-03-02 23:00:00', ArrivalDateTime: '2026-03-03 01:30:00', SeatNumber: 'N/A', TicketReference: 'FLT-TW-002', IsIncluded: 1 }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tripvehicles', null, {});
  }
};

