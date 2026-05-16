# CHT Travel & Tours Management System

## Overview

CHT Travel & Tours is a comprehensive management platform designed to streamline the operations of a travel agency. It handles everything from customer management and tour package creation to complex booking workflows and real-time client journey tracking (flight monitoring). The system is designed for both administrators and employees to manage high-volume travel arrangements with ease.

## Goals

1.  **Modernization**: Transition from a legacy PHP architecture to a high-performance React-Node.js stack.
2.  **Efficiency**: Automate the booking process through a 7-step wizard.
3.  **Real-time Visibility**: Provide employees with live tracking of client flight statuses and travel milestones.
4.  **Premium UX**: Deliver a high-fidelity "Light & Airy" design system that feels premium and state-of-the-art.

## Core User Flow

1.  **Authentication**: Employee/Admin logs in via the custom auth portal.
2.  **Client Management**: Manage existing clients or add new ones to the database.
3.  **Booking Wizard**: Initiate a 7-step booking process (Customer -> Flight -> Package -> Add-ons -> Hotel -> Transport -> Confirm).
4.  **Trip Monitoring**: Track the "Flight Tracking" and "Client Journey" milestones in real-time via the Trips section.
5.  **Resource Management**: Maintain the fleet of vehicles, hotel partnerships, and tour package inventory.

## Features

### Booking & Reservations
- 7-step interactive Booking Wizard.
- Dynamic cost calculation and summary cards.
- Automated PDF/Invoice generation (planned).

### Flight Management
- Real-time Flight Tracking (Flight Id, Airline, Status).
- Visual Timeline for Client Journeys (Numbered milestones).
- Flight search integration within the booking flow.

### Resource Management
- Hotel/Accommodation inventory.
- Vehicle fleet management (Transportation).
- Tour Package customization.

## Scope

### In Scope
- Full migration of legacy PHP views to React components.
- Implementation of the `client_journeys` and `flights` tracking system.
- Secure authentication and role-based access (Admin/User).

### Out of Scope
- Public-facing customer booking portal (Current version is internal-only).
- Mobile application (Current focus is desktop-first responsive web).

## Success Criteria

1.  A staff member can complete a full 7-step booking without errors.
2.  The "Trips" section correctly displays the real-time status of a client's flight.
3.  All legacy PHP code is successfully removed or replaced by the Node.js backend.
