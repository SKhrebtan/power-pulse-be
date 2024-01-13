const { Category } = require('../models/category');
const { ctrlWrapper } = require('../helpers');

const getAllCategories = async (req, res) => {
    const result = await Category.find({}, '-_id');
    res.json(result);
};

module.exports = {
    getAllCategories: ctrlWrapper(getAllCategories),
};
