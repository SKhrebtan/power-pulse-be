const { Filter } = require('../models/filter');
const { ctrlWrapper, HttpError } = require('../helpers');

const getAllFilters = async (req, res) => {
    const { filter = 'Body parts' } = req.query;

    const result = await Filter.find({ filter });
    if (!result.length)
        throw HttpError(400, 'Please change filter: "Equipment" or "Muscles"');

    res.json(result);
};

module.exports = {
    getAllFilters: ctrlWrapper(getAllFilters),
};
