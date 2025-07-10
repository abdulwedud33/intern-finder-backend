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

// Mark application as completed
exports.completeApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const userId = req.user.id;

    // Find the application
    const application = await Application.findById(applicationId);
    if (!application) {
      return sendResponse(res, 404, false, null, 'Application not found.');
    }

    // Only the intern or client associated with the application can complete it (optional, adjust as needed)
    // if (application.internId.toString() !== userId && application.clientId.toString() !== userId) {
    //   return sendResponse(res, 403, false, null, 'Unauthorized.');
    // }

    // Check if already completed
    if (application.status === 'completed') {
      return sendResponse(res, 400, false, null, 'Application is already completed.');
    }

    // Get the listing to check type
    const listing = await Listing.findById(application.listingId);
    if (!listing) {
      return sendResponse(res, 404, false, null, 'Listing not found.');
    }

    if (application.type === 'free') {
      // Check if feedback exists for this application
      const feedback = await require('../models/Feedback').findOne({
        internId: application.internId,
        listingId: application.listingId,
      });
      if (!feedback) {
        return sendResponse(res, 400, false, null, 'Feedback is mandatory for free internships before completion.');
      }
    }

    // Mark as completed
    application.status = 'completed';
    await application.save();
    sendResponse(res, 200, true, application, 'Application marked as completed.');
  } catch (err) {
    sendResponse(res, 500, false, null, err.message);
  }
};
