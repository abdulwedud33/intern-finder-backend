const Application = require('../models/Application');
const Listing = require('../models/Listing');

// Intern applies to a listing
exports.applyToListing = async (req, res) => {
  try {
    const internId = req.user.id;
    const listingId = req.params.id;

    // Validate that listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    // Prevent duplicate applications
    const existingApp = await Application.findOne({ internId, listingId });
    if (existingApp) {
      return res.status(409).json({ message: 'You have already applied to this listing.' });
    }

    // Save the application
    const application = await Application.create({
      internId,
      listingId,
      type: listing.type, // Use the type from the listing
    });

    res.status(201).json({ message: 'Application submitted successfully.', application });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
