const { Booking, Client, Package, ClientJourney, Flight } = require('../models');

exports.getClientJourneys = async (req, res) => {
  try {
    const employeeId = req.user.id || req.user.employeeId; // Use req.user.id from token

    const whereClause = req.user.role === 'admin' ? {} : { EmployeeID: employeeId };

    const bookings = await Booking.findAll({
      where: whereClause,
      include: [
        { model: Client },
        { model: Package },
        { 
          model: ClientJourney,
          include: [{ model: Flight }]
        }
      ],
      order: [
        [ClientJourney, 'timestamp', 'ASC']
      ]
    });

    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error fetching journeys:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateJourneyMilestone = async (req, res) => {
  try {
    const { journeyId, isCompleted, status } = req.body;
    await ClientJourney.update(
      { isCompleted, status },
      { where: { JourneyId: journeyId } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
