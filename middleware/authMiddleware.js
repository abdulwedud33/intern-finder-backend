const jwt = require('jsonwebtoken');
require('dotenv').config();
const sendResponse = require('../utils/sendResponse');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendResponse(res, 401, false, null, 'No token provided, authorization denied.');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return sendResponse(res, 401, false, null, 'Invalid token, authorization denied.');
  }
};

module.exports = authMiddleware;
