const { Product } = require('../models/product');
const { ctrlWrapper, HttpError } = require('../helpers');

const getAllProducts = async (req, res) => {
    const {
        page = 1,
        limit = 50,
        cat = null,
        q = null,
        bloodType = null,
        rec = null,
    } = req.query;

    const groupBlood = `groupBloodNotAllowed.${bloodType}`;
    const skip = (page - 1) * limit;

    if (cat && q && rec) {
        const result = await Product.find({
            category: cat,
            title: { $regex: q, $options: 'i' },
            [groupBlood]: rec,
        });
        const pages = Math.ceil(result.length / limit);
        const products = await Product.find(
            {
                category: cat,
                title: { $regex: q, $options: 'i' },
                [groupBlood]: rec,
            },
            '',
            {
                skip,
                limit,
            }
        );

        if (!result.length)
            throw HttpError(
                404,
                'Product not found, please change query params'
            );

        res.json({ data: { pages, limit, products } });
        return;
    }

    if (cat && q) {
        const result = await Product.find({
            category: cat,
            title: { $regex: q, $options: 'i' },
        });
        const pages = Math.ceil(result.length / limit);
        const products = await Product.find(
            {
                category: cat,
                title: { $regex: q, $options: 'i' },
            },
            '',
            {
                skip,
                limit,
            }
        );

        if (!result.length)
            throw HttpError(
                404,
                'Product not found, please change query params'
            );

        res.json({ data: { pages, limit, products } });
        return;
    }

    if (cat && rec) {
        const result = await Product.find({
            category: cat,
            [groupBlood]: rec,
        });
        const pages = Math.ceil(result.length / limit);
        const products = await Product.find(
            {
                category: cat,
                [groupBlood]: rec,
            },
            '',
            {
                skip,
                limit,
            }
        );

        if (!result.length)
            throw HttpError(
                404,
                'Product not found, please change query params'
            );

        res.json({ data: { pages, limit, products } });
        return;
    }

    if (q && rec) {
        const result = await Product.find({
            title: { $regex: q, $options: 'i' },
            [groupBlood]: rec,
        });
        const pages = Math.ceil(result.length / limit);
        const products = await Product.find(
            {
                title: { $regex: q, $options: 'i' },
                [groupBlood]: rec,
            },
            '',
            {
                skip,
                limit,
            }
        );

        if (!result.length)
            throw HttpError(
                404,
                'Product not found, please change query params'
            );

        res.json({ data: { pages, limit, products } });
        return;
    }

    if (cat) {
        const result = await Product.find({ category: cat });
        const pages = Math.ceil(result.length / limit);
        const products = await Product.find({ category: cat }, '', {
            skip,
            limit,
        });
        res.json({ data: { pages, limit, products } });
        return;
    }

    if (q) {
        const result = await Product.find({
            title: { $regex: q, $options: 'i' },
        });
        const pages = Math.ceil(result.length / limit);
        const products = await Product.find(
            { title: { $regex: q, $options: 'i' } },
            '',
            {
                skip,
                limit,
            }
        );
        if (!result.length)
            throw HttpError(
                404,
                `${q} product not found, please change the keyword search query`
            );

        res.json({ data: { pages, limit, products } });
        return;
    }

    if (rec) {
        const result = await Product.find({ [groupBlood]: rec });
        const pages = Math.ceil(result.length / limit);
        const products = await Product.find({ [groupBlood]: rec }, '', {
            skip,
            limit,
        });

        if (!result.length)
            throw HttpError(
                404,
                'Product not found, please change query params'
            );

        res.json({ data: { pages, limit, products } });
        return;
    }

    const result = await Product.find();
    const pages = Math.ceil(result.length / limit);
    const products = await Product.find({}, '', { skip, limit });

    res.json({ data: { pages, limit, products } });
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
