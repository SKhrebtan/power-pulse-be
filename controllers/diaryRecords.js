const { DiaryRecord } = require('../models/diaryRecord');

const { HttpError, ctrlWrapper } = require("../helpers");

// get specific record, by date for authorized user
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
            },
            $inc: {
                caloriesConsumed: +calories,
            },
        }, { new: true })
        .populate('products.product', 'title category groupBloodNotAllowed')
        .populate('exercises.exercise', 'name bodyPart equipment target');
    
    if (!currentRecord) {
        let newRecord = await DiaryRecord.create({
            user,
            date,
            products: [{ product, amount, calories }],
            caloriesConsumed: calories,
        });
        newRecord = await newRecord
        .populate('products.product', 'title category groupBloodNotAllowed')
        .populate('exercises.exercise', 'name bodyPart equipment target');
        res.json(newRecord);
        return;
    };
    res.json(currentRecord)
};

// add exercise to diary
// later should add functionality to add up same product information in 1 entry sum up time, or add repetition field and update it
const addDiaryExercise = async (req, res) => {
    const { _id: user } = req.user;
    const {
        date,
        exercise,
        time,
        calories
    } = req.body;

    const currentRecord = await DiaryRecord.findOneAndUpdate({ user, date },
        {
            $push: {
                exercises: {
                    exercise,
                    time,
                    calories,
                },
            },
            $inc: {
                caloriesBurned: +calories,
                activity: + time,
            },
        }, { new: true })
        .populate('products.product', 'title category groupBloodNotAllowed')
        .populate('exercises.exercise', 'name bodyPart equipment target');
    
    if (!currentRecord) {
        let newRecord = await DiaryRecord.create({
            user,
            date,
            exercises: [{ exercise, time, calories }],
            caloriesBurned: calories,
            activity:time,
        });
        newRecord = await newRecord
        .populate('products.product', 'title category groupBloodNotAllowed')
        .populate('exercises.exercise', 'name bodyPart equipment target');
        res.json(newRecord);
        return;
    };
    res.json(currentRecord)
};



module.exports = {
    getCurrentDiaryRecord: ctrlWrapper(getCurrentDiaryRecord),
    addDiaryProduct: ctrlWrapper(addDiaryProduct),
    addDiaryExercise: ctrlWrapper(addDiaryExercise),
}