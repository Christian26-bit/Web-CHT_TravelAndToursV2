const PDFDocument = require('pdfkit');

/**
 * Generates a premium invoice PDF for a booking/payment.
 */
exports.generateInvoice = (data, stream) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  doc.pipe(stream);

  // Header - CHT Branding
  doc
    .fillColor('#007BFF')
    .fontSize(24)
    .font('Helvetica-Bold')
    .text('CHT TRAVEL & TOURS', 50, 50);

  doc
    .fillColor('#64748B')
    .fontSize(10)
    .font('Helvetica')
    .text('Logistics Operations & Strategic Management', 50, 80);

  doc
    .fillColor('#0F172A')
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('INVOICE / RECEIPT', 400, 50, { align: 'right' });

  doc
    .fillColor('#64748B')
    .fontSize(9)
    .font('Helvetica')
    .text(`REF: ${data.reference || 'INV-' + Date.now()}`, 400, 65, { align: 'right' });

  doc
    .text(`DATE: ${new Date().toLocaleDateString()}`, 400, 77, { align: 'right' });

  // Divider
  doc
    .moveTo(50, 110)
    .lineTo(550, 110)
    .strokeColor('#F1F5F9')
    .stroke();

  // Traveler Details
  doc
    .fillColor('#0F172A')
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('TRAVELER REGISTRY', 50, 140);

  doc
    .fontSize(10)
    .font('Helvetica')
    .text(`Name: ${data.clientName || 'N/A'}`, 50, 160)
    .text(`Contact: ${data.email || 'N/A'}`, 50, 175);

  // Itinerary Details
  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('OPERATIONAL ASSETS', 50, 210);

  const itineraryTop = 230;
  doc
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('Description', 50, itineraryTop)
    .text('Asset ID', 300, itineraryTop)
    .text('Valuation', 450, itineraryTop, { align: 'right' });

  doc
    .moveTo(50, itineraryTop + 15)
    .lineTo(550, itineraryTop + 15)
    .strokeColor('#F1F5F9')
    .stroke();

  let currentY = itineraryTop + 30;

  // Package
  doc
    .font('Helvetica')
    .text(`Tour Package: ${data.packageName || 'N/A'}`, 50, currentY)
    .text(`${data.packageId || 'T-XXX'}`, 300, currentY)
    .text(`₱${parseFloat(data.packagePrice || 0).toLocaleString()}`, 450, currentY, { align: 'right' });

  currentY += 25;

  // Flight
  doc
    .text(`Aviation: ${data.airline || 'N/A'} (${data.flightNumber || 'TBA'})`, 50, currentY)
    .text(`${data.flightId || 'A-XXX'}`, 300, currentY)
    .text('INCL.', 450, currentY, { align: 'right' });

  currentY += 25;

  // Hotel
  doc
    .text(`Residency: ${data.hotelName || 'N/A'}`, 50, currentY)
    .text(`${data.hotelId || 'H-XXX'}`, 300, currentY)
    .text('INCL.', 450, currentY, { align: 'right' });

  currentY += 25;

  // Transport
  doc
    .text(`Mobility: ${data.transportName || 'N/A'}`, 50, currentY)
    .text(`${data.transportId || 'M-XXX'}`, 300, currentY)
    .text('INCL.', 450, currentY, { align: 'right' });

  currentY += 40;

  // Financial Summary
  doc
    .rect(50, currentY, 500, 100)
    .fill('#F8FAFC');

  doc
    .fillColor('#0F172A')
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('TOTAL FINANCIAL COMMITMENT', 70, currentY + 20);

  doc
    .fontSize(24)
    .text(`₱${parseFloat(data.totalAmount || 0).toLocaleString()}`, 70, currentY + 40);

  doc
    .fillColor('#64748B')
    .fontSize(8)
    .font('Helvetica')
    .text('This document serves as an official confirmation of booking and financial commitment.', 70, currentY + 75);

  // Footer
  doc
    .fillColor('#CBD5E1')
    .fontSize(8)
    .text('CHT Travel & Tours Operations Hub • 2026 Integrated Management System', 50, 780, { align: 'center' });

  doc.end();
};
