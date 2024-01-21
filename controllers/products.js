const { Product } = require('../models/product');
const { Category } = require('../models/category');
const { ctrlWrapper, HttpError } = require('../helpers');

const getAllProducts = async (req, res) => {
    const { blood: bloodType = 1 } = req.user;

    const {
        page = 1,
        limit = 50,
        cat: category = null,
        q: title = null,
        rec = null,
    } = req.query;

    const groupBlood = `groupBloodNotAllowed.${bloodType}`;

    const skip = (page - 1) * limit;

    const query = {};
    category && (query.category = category);
    rec && (query[groupBlood] = rec);
    title && (query.title = { $regex: title, $options: 'i' });

    const result = await Product.find(query);

    const pages = Math.ceil(result.length / limit);
    const products = await Product.find(query, '', {
        skip,
        limit,
    }).sort({ title: 1 });

    if (!result.length)
        throw HttpError(404, 'Product not found, please change query params');

    res.json({ data: { pages, limit, products } });
};

const getProductById = async (req, res) => {
    const { productId } = req.params;
    const result = await Product.findById(productId);
    if (!result)
        throw HttpError(404, `Product by ID: "${productId}" not found`);
    res.json(result);
};

const getAllCategories = async (req, res) => {
    const result = await Category.find({}, '-_id');
    res.json(result[0].categories);
};

module.exports = {
    getAllProducts: ctrlWrapper(getAllProducts),
    getProductById: ctrlWrapper(getProductById),
    getAllCategories: ctrlWrapper(getAllCategories),
};
