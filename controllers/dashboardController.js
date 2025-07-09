const Application = require('../models/Application');
const Listing = require('../models/Listing');
const Feedback = require('../models/Feedback');
const sendResponse = require('../utils/sendResponse');

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

    sendResponse(res, 200, true, { applications, feedbacks }, 'Dashboard data fetched successfully');
  } catch (err) {
    sendResponse(res, 500, false, null, err.message);
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

    sendResponse(res, 200, true, { listings, applications }, 'Dashboard data fetched successfully');
  } catch (err) {
    sendResponse(res, 500, false, null, err.message);
  }
};
