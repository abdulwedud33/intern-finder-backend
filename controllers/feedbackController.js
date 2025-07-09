const Feedback = require('../models/Feedback');
const Application = require('../models/Application');
const sendResponse = require('../utils/sendResponse');

// Submit feedback (client only, once per listing-intern pair, only for 'free' internships)
exports.submitFeedback = async (req, res) => {
  try {
    const clientId = req.user.id;
    const { internId, listingId, message, rating } = req.body;

    // Validate required fields
    if (!clientId || !internId || !listingId || !message || !rating) {
      return sendResponse(res, 400, false, null, 'All fields are required.');
    }

    // Only clients can submit feedback
    if (req.user.role !== 'client') {
      return sendResponse(res, 403, false, null, 'Only clients can submit feedback.');
    }

    // Prevent duplicate feedback for the same listing-intern pair
    const existingFeedback = await Feedback.findOne({ clientId, internId, listingId });
    if (existingFeedback) {
      return sendResponse(res, 409, false, null, 'Feedback already submitted for this intern and listing.');
    }

    // Validate that the application exists and is of type 'free'
    const application = await Application.findOne({ internId, listingId, type: 'free' });
    if (!application) {
      return sendResponse(res, 400, false, null, 'Feedback is only allowed for free internships and valid applications.');
    }

    // Save feedback
    const feedback = await Feedback.create({
      clientId,
      internId,
      listingId,
      message,
      rating,
    });

    sendResponse(res, 201, true, feedback, 'Feedback submitted successfully.');
  } catch (err) {
    sendResponse(res, 500, false, null, err.message);
  }
};
