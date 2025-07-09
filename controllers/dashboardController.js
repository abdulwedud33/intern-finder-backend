const Application = require('../models/Application');
const Listing = require('../models/Listing');
const Feedback = require('../models/Feedback');

// Intern Dashboard: fetch applications and feedback for the logged-in intern
exports.getInternDashboard = async (req, res) => {
  try {
    const internId = req.params.id;

    // Fetch applications for this intern, populate listing details
    const applications = await Application.find({ internId })
      .populate('listingId');

    // Fetch feedback for this intern, populate client and listing details
    const feedbacks = await Feedback.find({ internId })
      .populate('clientId', 'name email')
      .populate('listingId', 'title');

    res.json({
      applications,
      feedbacks,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Client Dashboard: fetch posted listings and received applications for the client
exports.getClientDashboard = async (req, res) => {
  try {
    const clientId = req.params.id;

    // Fetch listings posted by this client
    const listings = await Listing.find({ clientId });

    // Fetch applications for listings posted by this client, populate intern and listing details
    const applications = await Application.find({ listingId: { $in: listings.map(l => l._id) } })
      .populate('internId', 'name email')
      .populate('listingId', 'title');

    res.json({
      listings,
      applications,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
