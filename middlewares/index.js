const validateBody = require('./validateBody');
const isValidId = require('./isValidId');
const authenticate = require('./authenticate');
const upload = require('./cloudinary');
const validateParams = require('./validateParams');
const validateFormats = require('./validateFormats');
module.exports = {
    validateBody,
    isValidId,
    authenticate,
    upload,
    validateParams,
    validateFormats,
};
