"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "client",
      [
        {
          clientId: 100,
          name: "Amelia Brooks",
          email: "amelia.brooks@example.com",
          address: "New York, USA",
          contactNumber: "1-212-555-0199",
          customerType: "REGULAR",
          dateRegistered: "2026-01-01",
        },
      ],
      {},
    );

    await queryInterface.bulkInsert(
      "package",
      [
        {
          PackageID: 14,
          Name: "Kyoto Spring Tour",
          Description: "Cherry blossoms and historic temples in Kyoto",
          Destination: "Kyoto, Japan",
          Duration: 7,
          MaxPax: 20,
          Inclusions: "Flights, Hotels, Private Guide",
          Price: "3500.00",
          IsActive: 1,
          CreatedByEmployeeID: 1,
        },
      ],
      {},
    );

    await queryInterface.bulkInsert(
      "booking",
      [
        {
          BookingID: 1001,
          EmployeeID: 1,
          ClientID: 100,
          PackageID: 14,
          BookingDate: "2026-03-04",
          Status: "CONFIRMED",
          PaxCount: 1,
        },
      ],
      {},
    );

    await queryInterface.bulkInsert(
      "flights",
      [
        {
          FlightId: 501,
          airline: "Skyline Airways",
          flightNumber: "SK 482",
          departureGate: "B14",
          arrivalGate: "G12",
          status: "IN AIR",
          departureTime: "2026-05-13 08:45:00",
          arrivalTime: "2026-05-13 21:10:00",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );

    await queryInterface.bulkInsert(
      "client_journeys",
      [
        {
          JourneyId: 1,
          bookingId: 1001,
          flightId: 501,
          title: "Booking confirmed",
          description: "Reservation #CHT-48201",
          status: "COMPLETED",
          timestamp: "2026-03-04 10:00:00",
          isCompleted: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          JourneyId: 2,
          bookingId: 1001,
          flightId: 501,
          title: "Online check-in",
          description: "JFK Terminal 4",
          status: "COMPLETED",
          timestamp: "2026-05-12 14:00:00",
          isCompleted: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          JourneyId: 3,
          bookingId: 1001,
          flightId: 501,
          title: "Boarding",
          description: "Gate B14",
          status: "COMPLETED",
          timestamp: "2026-05-13 08:45:00",
          isCompleted: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          JourneyId: 4,
          bookingId: 1001,
          flightId: 501,
          title: "In flight",
          description: "JFK -> LHR - 7h 25m",
          status: "CURRENT",
          timestamp: "2026-05-13 12:00:00",
          isCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          JourneyId: 5,
          bookingId: 1001,
          flightId: 501,
          title: "Arrival & transfer",
          description: "The Savoy, London",
          status: "PENDING",
          timestamp: "2026-05-13 22:00:00",
          isCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("client_journeys", null, {});
    await queryInterface.bulkDelete("flights", null, {});
    await queryInterface.bulkDelete("booking", null, {});
    await queryInterface.bulkDelete("package", { PackageID: 14 }, {});
    await queryInterface.bulkDelete("client", { clientId: 100 }, {});
  },
};
