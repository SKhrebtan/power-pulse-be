const { Product } = require('../models/product');
const { ctrlWrapper, HttpError } = require('../helpers');

const getAllProducts = async (req, res) => {
    // const { filter = 'Body parts' } = req.query;
    const result = await Product.find();
    // if (!result.length)
    //     throw HttpError(400, 'Please change filter: "Equipment" or "Muscles"');
    res.json(result);
};

module.exports = {
    getAllProducts: ctrlWrapper(getAllProducts),
};
