const sendResponse = require('../utils/sendResponse');

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  sendResponse(res, statusCode, false, null, err.message || 'Server Error');
}

module.exports = errorHandler;
