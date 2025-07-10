const Listing = require('../models/Listing');
const sendResponse = require('../utils/sendResponse');

// Create a new listing
exports.createListing = async (req, res) => {
  try {
    const { title, description, type, skills, location } = req.body;
    if (!title || !description || !type || !skills || !location) {
      return sendResponse(res, 400, false, null, 'All fields are required.');
    }
    if (!['free', 'paid'].includes(type)) {
      return sendResponse(res, 400, false, null, 'Type must be either "free" or "paid".');
    }
    const listing = await Listing.create({
      title,
      description,
      type,
      skills,
      location,
      clientId: req.user.id,
    });
    sendResponse(res, 201, true, listing, 'Listing created successfully.');
  } catch (err) {
    sendResponse(res, 500, false, null, err.message);
  }
};

// Edit a listing by ID
exports.editListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, skills, location } = req.body;
    const updateData = { title, description, type, skills, location };
    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
    const listing = await Listing.findOneAndUpdate(
      { _id: id, clientId: req.user.id },
      updateData,
      { new: true }
    );
    if (!listing) {
      return sendResponse(res, 404, false, null, 'Listing not found or unauthorized.');
    }
    sendResponse(res, 200, true, listing, 'Listing updated successfully.');
  } catch (err) {
    sendResponse(res, 500, false, null, err.message);
  }
};

// Delete a listing by ID
exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findOneAndDelete({ _id: id, clientId: req.user.id });
    if (!listing) {
      return sendResponse(res, 404, false, null, 'Listing not found or unauthorized.');
    }
    sendResponse(res, 200, true, null, 'Listing deleted successfully.');
  } catch (err) {
    sendResponse(res, 500, false, null, err.message);
  }
};

// Search listings by type, location, and skills
exports.searchListings = async (req, res) => {
  try {
    const { type, location, skills } = req.query;
    const filter = {};

    // Filter by type (exact match)
    if (type && ['free', 'paid'].includes(type)) {
      filter.type = type;
    }

    // Filter by location (case-insensitive partial match)
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Filter by skills (match listings that include any skill in the array)
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      filter.skills = { $in: skillsArray };
    }

    const results = await Listing.find(filter)
      .populate('clientId', 'name email')
      .sort({ createdAt: -1 });

    sendResponse(res, 200, true, results, 'Search results');
  } catch (err) {
    sendResponse(res, 500, false, null, err.message);
  }
};
