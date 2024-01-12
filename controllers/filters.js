const { Filter } = require('../models/filter');
const { ctrlWrapper } = require('../helpers');

const getAllFilters = async (req, res) => {
    const result = await Filter.find();
    res.json(result);
};

module.exports = {
    getAllFilters: ctrlWrapper(getAllFilters),
};
