const { Product } = require('../models/product');
const { ctrlWrapper, HttpError } = require('../helpers');

const getAllProducts = async (req, res) => {
    const {
        category = null,
        q = null,
        bloodType = null,
        rec = null,
    } = req.query;

    const groupBlood = `groupBloodNotAllowed.${bloodType}`;

    if (category && q && rec) {
        const result = await Product.find({
            category,
            title: { $regex: q, $options: 'i' },
            [groupBlood]: rec,
        });

        if (!result.length)
            throw HttpError(
                404,
                'Product not found, please change query params'
            );

        res.json(result);
        return;
    }

    if (category && q) {
        const result = await Product.find({
            category,
            title: { $regex: q, $options: 'i' },
        });

        if (!result.length)
            throw HttpError(
                404,
                'Product not found, please change query params'
            );

        res.json(result);
        return;
    }

    if (category && rec) {
        const result = await Product.find({
            category,
            [groupBlood]: rec,
        });

        if (!result.length)
            throw HttpError(
                404,
                'Product not found, please change query params'
            );

        res.json(result);
        return;
    }

    if (q && rec) {
        const result = await Product.find({
            title: { $regex: q, $options: 'i' },
            [groupBlood]: rec,
        });

        if (!result.length)
            throw HttpError(
                404,
                'Product not found, please change query params'
            );

        res.json(result);
        return;
    }

    if (category) {
        const result = await Product.find({ category });
        res.json(result);
        return;
    }

    if (q) {
        const result = await Product.find({
            title: { $regex: q, $options: 'i' },
        });

        if (!result.length)
            throw HttpError(
                404,
                `${q} product not found, please change the keyword search query`
            );

        res.json(result);
        return;
    }

    if (rec) {
        const result = await Product.find({
            [groupBlood]: rec,
        });

        if (!result.length)
            throw HttpError(
                404,
                'Product not found, please change query params'
            );

        res.json(result);
        return;
    }

    const result = await Product.find();
    res.json(result);
};

const getProductById = async (req, res) => {
    const { productId } = req.params;
    const result = await Product.findById(productId);
    if (!result)
        throw HttpError(404, `Product by ID: "${productId}" not found`);
    res.json(result);
};

module.exports = {
    getAllProducts: ctrlWrapper(getAllProducts),
    getProductById: ctrlWrapper(getProductById),
};
