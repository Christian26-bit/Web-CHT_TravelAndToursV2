'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Clients
    await queryInterface.bulkInsert('client', [
      {
        clientId: 301,
        name: 'Christian Fish',
        email: 'christian.fish301@example.com',
        address: 'Tokyo, Japan',
        contactNumber: '1-212-555-0301',
        customerType: 'REGULAR',
        dateRegistered: '2026-01-01',
      },
      {
        clientId: 302,
        name: 'Amelia Brooks',
        email: 'amelia.brooks302@example.com',
        address: 'London, United Kingdom',
        contactNumber: '1-212-555-0302',
        customerType: 'VIP',
        dateRegistered: '2026-02-01',
      },
      {
        clientId: 303,
        name: 'Olof Meister',
        email: 'olof.meister303@example.com',
        address: 'Beijing, China',
        contactNumber: '1-212-555-0303',
        customerType: 'REGULAR',
        dateRegistered: '2026-03-01',
      }
    ], {});

    // 2. Packages (Mock to link to bookings)
    await queryInterface.bulkInsert('package', [
      {
        PackageID: 301,
        Name: 'Tokyo Explorer',
        Description: 'Discover the heart of Japan',
        Destination: 'Tokyo, Japan',
        Duration: 7,
        MaxPax: 10,
        Inclusions: 'Flights, Hotels',
        Price: 2000.00,
        IsActive: 1,
        CreatedByEmployeeID: 1,
      },
      {
        PackageID: 302,
        Name: 'London Classics',
        Description: 'Experience the UK',
        Destination: 'London, UK',
        Duration: 5,
        MaxPax: 15,
        Inclusions: 'Flights, Hotels',
        Price: 1500.00,
        IsActive: 1,
        CreatedByEmployeeID: 1,
      },
      {
        PackageID: 303,
        Name: 'Beijing Heritage',
        Description: 'Explore the Great Wall',
        Destination: 'Beijing, China',
        Duration: 8,
        MaxPax: 20,
        Inclusions: 'Flights, Hotels',
        Price: 1800.00,
        IsActive: 1,
        CreatedByEmployeeID: 1,
      }
    ], {});

    // 3. Bookings
    await queryInterface.bulkInsert('booking', [
      {
        BookingID: 3001,
        EmployeeID: 1,
        ClientID: 301,
        PackageID: 301,
        BookingDate: '2026-04-01',
        Status: 'CONFIRMED',
        PaxCount: 1,
      },
      {
        BookingID: 3002,
        EmployeeID: 1,
        ClientID: 302,
        PackageID: 302,
        BookingDate: '2026-04-05',
        Status: 'CONFIRMED',
        PaxCount: 2,
      },
      {
        BookingID: 3003,
        EmployeeID: 1,
        ClientID: 303,
        PackageID: 303,
        BookingDate: '2026-04-10',
        Status: 'CONFIRMED',
        PaxCount: 1,
      }
    ], {});

    // 4. Flights
    await queryInterface.bulkInsert('flights', [
      {
        FlightId: 701,
        airline: 'Philippine Airlines',
        flightNumber: 'PR 432',
        departureGate: 'T1',
        arrivalGate: 'T2',
        status: 'IN AIR',
        departureTime: '2026-05-18 08:45:00',
        arrivalTime: '2026-05-18 22:00:00',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        FlightId: 702,
        airline: 'British Airways',
        flightNumber: 'BA 011',
        departureGate: 'T5',
        arrivalGate: 'T3',
        status: 'ON TIME',
        departureTime: '2026-05-19 10:00:00',
        arrivalTime: '2026-05-19 20:00:00',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        FlightId: 703,
        airline: 'Air China',
        flightNumber: 'CA 991',
        departureGate: 'T3',
        arrivalGate: 'T1',
        status: 'DELAYED',
        departureTime: '2026-05-20 12:00:00',
        arrivalTime: '2026-05-20 22:00:00',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});

    const formatDate = (d) => d.toISOString().slice(0, 19).replace('T', ' ');

    const now = new Date();
    const today845 = new Date(now);
    today845.setHours(8, 45, 0, 0);

    const today1200 = new Date(now);
    today1200.setHours(12, 0, 0, 0);

    const today2200 = new Date(now);
    today2200.setHours(22, 0, 0, 0);

    await queryInterface.bulkInsert('client_journeys', [
      // Christian Fish
      {
        JourneyId: 3011,
        bookingId: 3001,
        flightId: 701,
        title: 'Booking Confirmed',
        description: 'BKN-00001',
        status: 'COMPLETED',
        timestamp: '2026-05-04 10:00:00', // May 4
        isCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        JourneyId: 3012,
        bookingId: 3001,
        flightId: 701,
        title: 'Online check-in',
        description: 'HND - Terminal 1',
        status: 'COMPLETED',
        timestamp: '2026-05-12 10:00:00', // May 12
        isCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        JourneyId: 3013,
        bookingId: 3001,
        flightId: 701,
        title: 'Boarding',
        description: 'Philippine Airlines',
        status: 'COMPLETED',
        timestamp: formatDate(today845), // Today: 8:45 AM
        isCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        JourneyId: 3014,
        bookingId: 3001,
        flightId: 701,
        title: 'In flight',
        description: 'MNL -> HND - 4h 40 min',
        status: 'CURRENT',
        timestamp: formatDate(today1200), // Today (approx current time)
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        JourneyId: 3015,
        bookingId: 3001,
        flightId: 701,
        title: 'Arrival',
        description: 'Haneda Airport',
        status: 'PENDING',
        timestamp: formatDate(today2200), // Today: 22:00
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
      // Amelia Brooks
      {
        JourneyId: 3021,
        bookingId: 3002,
        flightId: 702,
        title: 'Booking Confirmed',
        description: 'BKN-00002',
        status: 'COMPLETED',
        timestamp: '2026-05-06 10:00:00',
        isCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        JourneyId: 3022,
        bookingId: 3002,
        flightId: 702,
        title: 'Online check-in',
        description: 'LHR - Terminal 5',
        status: 'PENDING',
        timestamp: null,
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Olof Meister
      {
        JourneyId: 3031,
        bookingId: 3003,
        flightId: 703,
        title: 'Booking Confirmed',
        description: 'BKN-00003',
        status: 'COMPLETED',
        timestamp: '2026-05-01 10:00:00',
        isCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        JourneyId: 3032,
        bookingId: 3003,
        flightId: 703,
        title: 'Online check-in',
        description: 'PEK - Terminal 3',
        status: 'CURRENT',
        timestamp: formatDate(today1200),
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('client_journeys', { JourneyId: [2011,2012,2013,2014,2015,2021,2022,2031,2032] }, {});
    await queryInterface.bulkDelete('flights', { FlightId: [601, 602, 603] }, {});
    await queryInterface.bulkDelete('booking', { BookingID: [2001, 2002, 2003] }, {});
    await queryInterface.bulkDelete('package', { PackageID: [201, 202, 203] }, {});
    await queryInterface.bulkDelete('client', { clientId: [201, 202, 203] }, {});
  }
};
