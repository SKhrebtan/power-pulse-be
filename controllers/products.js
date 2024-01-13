const { Product } = require('../models/product');
const { ctrlWrapper, HttpError } = require('../helpers');

const getAllProducts = async (req, res) => {
    const { cat = null, q = null, bloodType = null, rec = null } = req.query;

    const groupBlood = `groupBloodNotAllowed.${bloodType}`;

    if (cat && q && rec) {
        const result = await Product.find({
            category: cat,
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

    if (cat && q) {
        const result = await Product.find({
            category: cat,
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

    if (cat && rec) {
        const result = await Product.find({
            category: cat,
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

    if (cat) {
        const result = await Product.find({ category: cat });
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
