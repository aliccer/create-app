/* eslint-disable no-param-reassign */
//
// Create custom function on request and response object
// -----------------------------------------------------------------------------
const isPlainObject = require('lodash/isPlainObject');
const trim = require('lodash/trim');
const reduce = require('lodash/reduce');

// send response based on parameters
const _sendResponse = (
  res,
  dataObj,
  headers = { 'Content-Type': 'application/json' },
  status = 200,
) => {
  res.writeHead(status, headers);
  res.end(JSON.stringify(dataObj));
};

// sends response based on parameters(Error Validations)
const sendValidationError = (res, data, headers) => {
  global.log.error('Validation Error', data);
  let description = '';

  if (typeof data === 'string' && trim(data).length) {
    description = data;
  } else if (Array.isArray(data)) {
    description = reduce(data, (acc, item) => {
      acc += `${item.msg} `;
      return acc;
    }, '');
  } else {
    description = CONSTANTS.MESSAGES.INVALID_PAYLOAD;
  }

  _sendResponse(
    res,
    {
      code: CONSTANTS.HTTP_CODES.VALIDATION_ERROR,
      error: {
        description,
        message: CONSTANTS.MESSAGES.VALIDATION_ERROR,
      },
    },
    headers,
    CONSTANTS.HTTP_CODES.VALIDATION_ERROR,
  );
};

// sends response based on parameters(Error in processing)
const sendError = (res, status, message, description, headers) => {
  const response = {
    code: status,
    error: {},
  };

  response.error.message = (typeof message === 'string' && trim(message).length)
    ? message
    : CONSTANTS.MESSAGES.SERVER_ERROR;

  if (typeof description === 'string' && trim(description).length) {
    response.error.description = description;
  } else if (
    (description instanceof Error || isPlainObject(description))
    && Object.prototype.hasOwnProperty.call(description, 'message')
  ) {
    response.error.description = description.message;
  } else {
    response.error.description = CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG;
  }

  _sendResponse(res, response, headers, status);
};

// sends response based on parameters(Success in processing)
const sendSuccess = (res, status, payload, headers) => _sendResponse(
  res,
  {
    code: status,
    data: payload,
  },
  headers,
  status,
);

module.exports = (req, res, next) => {
  res.sendError = sendError.bind(null, res);
  res.sendSuccess = sendSuccess.bind(null, res);
  res.sendValidationError = sendValidationError.bind(null, res);

  next();
};
