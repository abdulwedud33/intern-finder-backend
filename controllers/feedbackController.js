const Feedback = require('../models/Feedback');
const Application = require('../models/Application');

// Submit feedback (client only, once per listing-intern pair, only for 'free' internships)
exports.submitFeedback = async (req, res) => {
  try {
    const clientId = req.user.id;
    const { internId, listingId, message, rating } = req.body;

    // Validate required fields
    if (!clientId || !internId || !listingId || !message || !rating) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Only clients can submit feedback
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can submit feedback.' });
    }

    // Prevent duplicate feedback for the same listing-intern pair
    const existingFeedback = await Feedback.findOne({ clientId, internId, listingId });
    if (existingFeedback) {
      return res.status(409).json({ message: 'Feedback already submitted for this intern and listing.' });
    }

    // Validate that the application exists and is of type 'free'
    const application = await Application.findOne({ internId, listingId, type: 'free' });
    if (!application) {
      return res.status(400).json({ message: 'Feedback is only allowed for free internships and valid applications.' });
    }

    // Save feedback
    const feedback = await Feedback.create({
      clientId,
      internId,
      listingId,
      message,
      rating,
    });

    res.status(201).json({ message: 'Feedback submitted successfully.', feedback });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
