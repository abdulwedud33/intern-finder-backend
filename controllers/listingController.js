const Listing = require('../models/Listing');

// Create a new listing
exports.createListing = async (req, res) => {
  try {
    const { title, description, type, skills, location } = req.body;
    if (!title || !description || !type || !skills || !location) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (!['free', 'paid'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either "free" or "paid".' });
    }
    const listing = await Listing.create({
      title,
      description,
      type,
      skills,
      location,
      clientId: req.user.id,
    });
    res.status(201).json({ message: 'Listing created successfully.', listing });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
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
      return res.status(404).json({ message: 'Listing not found or unauthorized.' });
    }
    res.json({ message: 'Listing updated successfully.', listing });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a listing by ID
exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findOneAndDelete({ _id: id, clientId: req.user.id });
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found or unauthorized.' });
    }
    res.json({ message: 'Listing deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
