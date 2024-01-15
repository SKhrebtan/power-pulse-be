const { isValidObjectId } = require('mongoose');
const { HttpError } = require('../helpers');

const isValidId = (req, res, next) => {
    const { exerciseId, productId, id } = req.params;

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

    if (!isValidObjectId(id)) {
        next(HttpError(400, `${id} is not valid`));
    }

    next();
};

module.exports = isValidId;
