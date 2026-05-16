const { Payment, Booking, Client, Package, Accommodation, Vehicle, Flight } = require('../models');
const pdfGenerator = require('../utils/pdfGenerator');

exports.listPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Booking,
          include: [{ model: Client }]
        }
      ]
    });
    res.json({ success: true, data: payments });
  } catch (error) {
    console.error('List Payments Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};

exports.savePayment = async (req, res) => {
  try {
    const { bookingId, amount, paymentDate, paymentMethod, referenceNumber, status } = req.body;
    const payment = await Payment.create({
      BookingID: bookingId,
      Amount: amount,
      PaymentDate: paymentDate,
      PaymentMethod: paymentMethod,
      ReferenceNumber: referenceNumber,
      Status: status
    });
    res.json({ success: true, data: payment });
  } catch (error) {
    console.error('Save Payment Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};

exports.downloadInvoice = async (req, res) => {
  try {
    const { id } = req.params; // bookingId
    const booking = await Booking.findByPk(id, {
      include: [
        { model: Client },
        { model: Package },
        { model: Accommodation },
        { model: Vehicle },
        { model: Flight }
      ]
    });

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found.' });
    }

    const invoiceData = {
      reference: `BK-${String(booking.BookingID).padStart(4, '0')}`,
      clientName: booking.Client?.Name,
      email: booking.Client?.Email,
      packageName: booking.Package?.Name,
      packageId: booking.Package?.PackageID,
      packagePrice: booking.Package?.Price,
      airline: booking.Flight?.Airline,
      flightNumber: booking.Flight?.FlightNumber,
      flightId: booking.Flight?.FlightId,
      hotelName: booking.Accommodation?.Name,
      hotelId: booking.Accommodation?.accommodationId,
      transportName: booking.Vehicle?.Type,
      transportId: booking.Vehicle?.VehicleID,
      totalAmount: booking.TotalAmount || booking.totalAmount
    };

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Invoice_${invoiceData.reference}.pdf`);

    pdfGenerator.generateInvoice(invoiceData, res);
  } catch (error) {
    console.error('Download Invoice Error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate invoice.' });
  }
};
