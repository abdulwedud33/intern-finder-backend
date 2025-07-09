const User = require('../models/User');
const hashPassword = require('../utils/hashPassword');
const generateToken = require('../utils/generateToken');
const sendResponse = require('../utils/sendResponse');

// Register Intern
exports.registerIntern = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;
    if (!name || !email || !password || !type) {
      return sendResponse(res, 400, false, null, 'All fields are required for intern registration.');
    }
    if (!['free', 'paid'].includes(type)) {
      return sendResponse(res, 400, false, null, 'Type must be either "free" or "paid".');
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 409, false, null, 'Email already in use.');
    }
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'intern',
      type,
    });
    const token = generateToken(user._id);
    sendResponse(res, 201, true, {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        type: user.type,
      },
    }, 'Intern registered successfully');
  } catch (err) {
    sendResponse(res, 500, false, null, err.message);
  }
};

// Register Client
exports.registerClient = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return sendResponse(res, 400, false, null, 'All fields are required for client registration.');
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 409, false, null, 'Email already in use.');
    }
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'client',
    });
    const token = generateToken(user._id);
    sendResponse(res, 201, true, {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, 'Client registered successfully');
  } catch (err) {
    sendResponse(res, 500, false, null, err.message);
  }
};
