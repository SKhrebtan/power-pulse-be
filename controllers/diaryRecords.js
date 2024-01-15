const { DiaryRecord } = require('../models/diaryRecord');

const { HttpError, ctrlWrapper } = require("../helpers");

// for current record need to add logic to check if product is recomended or not
const getCurrentDiaryRecord = async (req, res) => { 
    const { _id: user } = req.user;
    const { date } = req.body;
    const currentRecord = await DiaryRecord.findOne({ user, date }).populate('products.product', 'title category');
    
    if (!currentRecord) {
        throw HttpError(404, "No records for this date");
    }

    res.json(currentRecord);
};

// added product to the diary

// later should add functionality to add up same product information in 1 entry
const addDiaryProduct = async (req, res, next) => {
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
        },{new:true}).populate('products.product', 'title category groupBloodNotAllowed');
    
    if (!currentRecord) {
        let newRecord = await DiaryRecord.create({
            user,
            date,
            products: [{ product, amount, calories }],
        });
        newRecord = await newRecord.populate('products.product', 'title category groupBloodNotAllowed');
        res.json(newRecord);
        return;
    };


    res.json(currentRecord)
};


module.exports = {
    addDiaryProduct: ctrlWrapper(addDiaryProduct),
    getCurrentDiaryRecord: ctrlWrapper(getCurrentDiaryRecord),
}