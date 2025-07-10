const Application = require('../models/Application');
const Listing = require('../models/Listing');
const sendResponse = require('../utils/sendResponse');

// Intern applies to a listing
exports.applyToListing = async (req, res) => {
  try {
    const internId = req.user.id;
    const listingId = req.params.id;

    // Validate that listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return sendResponse(res, 404, false, null, 'Listing not found.');
    }

    // Prevent duplicate applications
    const existingApp = await Application.findOne({ internId, listingId });
    if (existingApp) {
      return sendResponse(res, 409, false, null, 'You have already applied to this listing.');
    }

    // Save the application
    const application = await Application.create({
      internId,
      listingId,
      type: listing.type, // Use the type from the listing
    });

    sendResponse(res, 201, true, application, 'Application submitted successfully.');
  } catch (err) {
    sendResponse(res, 500, false, null, err.message);
  }
};