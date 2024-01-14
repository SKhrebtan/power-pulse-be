const { DiaryRecord } = require('../models/diaryRecord');

const { HttpError, ctrlWrapper } = require("../helpers");

const getCurrentDiaryRecord = async (req, res) => { 
    const { _id: user } = req.user;
    const { date } = req.body;
    const currentRecord = await DiaryRecord.findOne({ user, date }).   populate({
        path: 'products.product',
        select: 'title category',
    })

    if (!currentRecord) {
        throw HttpError(404, "No records for this date");
    }

    res.json(currentRecord);
};

const addDiaryProduct = async (req, res) => {
    const { _id: user } = req.user;
    const product = req.params.productId;
    const {
        date,
        amount,
        calories
    } = req.body;

    const currentRecord = await DiaryRecord.findOneAndUpdate({ user, date },
        {
            $push: {
                products: {
                    product,
                    amount,
                    calories,
                },
            }
        })
    
    if (!currentRecord) {
       const newRecord = await DiaryRecord.create({
            user,
            date,
            products:[{product, amount, calories}],
    });
    res.json(newRecord);
    };

    res.json(currentRecord);
};


module.exports = {
    addDiaryProduct: ctrlWrapper(addDiaryProduct),
    getCurrentDiaryRecord: ctrlWrapper(getCurrentDiaryRecord),
}