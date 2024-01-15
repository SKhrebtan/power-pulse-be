const { isValidObjectId } = require('mongoose');
const { HttpError } = require('../helpers');

const isValidId = (req, res, next) => {
    const { exerciseId, productId, userId } = req.params;

    if (exerciseId) {
        if (!isValidObjectId(exerciseId)) {
            next(HttpError(400, `${exerciseId} is not valid ID!`));
        }
    }

    if (productId) {
        if (!isValidObjectId(productId)) {
            next(HttpError(400, `${productId} is not valid ID!`));
        }
    }

    if (userId) {
        if (!isValidObjectId(userId)) {
            next(HttpError(400, `${userId} is not valid ID!`));
        }
    }

    next();
};

module.exports = isValidId;
