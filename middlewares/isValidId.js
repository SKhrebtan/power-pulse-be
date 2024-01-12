const { isValidObjectId } = require('mongoose');
const { HttpError } = require('../helpers');

const isValidId = (req, res, next) => {
    const { exerciseId } = req.params;
    if (!isValidObjectId(exerciseId)) {
        next(HttpError(400, `${exerciseId} is not valid ID!`));
    }
    next();
};

module.exports = isValidId;
