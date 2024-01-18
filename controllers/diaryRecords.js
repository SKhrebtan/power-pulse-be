const { DiaryRecord } = require('../models/diaryRecord');

const { HttpError, ctrlWrapper } = require('../helpers');
<<<<<<< HEAD
=======
const { Exercise } = require('../models/exercise');
const { Product } = require('../models/product');
>>>>>>> main

// get specific record, by date for authorized user
const getCurrentDiaryRecord = async (req, res) => {
    const { _id: user } = req.user;
    const { date } = req.params;
    const currentRecord = await DiaryRecord.findOne({ user, date }).populate(
        'products.product',
        'title category'
    );

    if (!currentRecord) {
        throw HttpError(404, 'No records for this date');
    }

    res.json(currentRecord);
};

// added product to the diary
// later should add functionality to add up same product information in 1 entry
const addDiaryProduct = async (req, res) => {
    const { _id: user } = req.user;
<<<<<<< HEAD
    const { date, product, amount, calories } = req.body;

=======
    const { productId: product } = req.params;
    const { date, amount, calories } = req.body;

    const result = await Product.findById(product);
    if (!result) throw HttpError(404, `Product by ID: "${product}" not found`);

>>>>>>> main
    const currentRecord = await DiaryRecord.findOneAndUpdate(
        { user, date },
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
        },
        { new: true }
    )
        .populate('products.product', 'title category groupBloodNotAllowed')
        .populate('exercises.exercise', 'name bodyPart equipment target');

    if (!currentRecord) {
        let newRecord = await DiaryRecord.create({
            user,
            date,
            products: [{ product, amount, calories }],
            caloriesConsumed: calories,
        });
        newRecord = await newRecord.populate(
            'products.product',
            'title category groupBloodNotAllowed'
        );
        newRecord = await newRecord.populate(
            'exercises.exercise',
            'name bodyPart equipment target'
        );
        res.json(newRecord);
        return;
    }
    res.json(currentRecord);
};

// add exercise to diary
// later should add functionality to add up same product information in 1 entry sum up time, or add repetition field and update it
const addDiaryExercise = async (req, res) => {
    const { _id: user } = req.user;
<<<<<<< HEAD
    const { date, exercise, time, calories } = req.body;

=======
    const { exerciseId: exercise } = req.params;
    const { date, time, calories } = req.body;

    const result = await Exercise.findById(exercise);
    if (!result)
        throw HttpError(404, `Exercise by ID: "${exercise}" not found`);

>>>>>>> main
    const currentRecord = await DiaryRecord.findOneAndUpdate(
        { user, date },
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
                activity: +time,
            },
        },
        { new: true }
    )
        .populate('products.product', 'title category groupBloodNotAllowed')
        .populate('exercises.exercise', 'name bodyPart equipment target');

    if (!currentRecord) {
        let newRecord = await DiaryRecord.create({
            user,
            date,
            exercises: [{ exercise, time, calories }],
            caloriesBurned: calories,
            activity: time,
        });
        newRecord = await newRecord.populate(
            'products.product',
            'title category groupBloodNotAllowed'
        );
        newRecord = await newRecord.populate(
            'exercises.exercise',
            'name bodyPart equipment target'
        );
        res.json(newRecord);
        return;
    }
    res.json(currentRecord);
};

const removeDiaryProduct = async (req, res) => {
    const { _id: user } = req.user;
    const { date } = req.params;
    const { product, calories } = req.body;

    const currentRecord = await DiaryRecord.findOneAndUpdate(
        { user, date },
        {
            $inc: {
                caloriesConsumed: -calories,
            },
            $pull: {
                products: {
                    product: product,
                },
            },
        },
        { new: true }
    )
        .populate('products.product', 'title category groupBloodNotAllowed')
        .populate('exercises.exercise', 'name bodyPart equipment target');

    if (!currentRecord) {
        throw HttpError(404, 'No records for this date');
    }

    res.json(currentRecord);
};

const removeDiaryExercise = async (req, res) => {
    const { _id: user } = req.user;
    const { date } = req.params;
    const { exercise, time, calories } = req.body;

    const currentRecord = await DiaryRecord.findOneAndUpdate(
        { user, date },
        {
            $inc: {
                caloriesBurned: -calories,
                activity: -time,
            },
            $pull: {
                exercises: {
                    exercise,
                },
            },
        },
        { new: true }
    )
        .populate('products.product', 'title category groupBloodNotAllowed')
        .populate('exercises.exercise', 'name bodyPart equipment target');

    if (!currentRecord) {
        throw HttpError(404, 'No records for this date');
    }

    res.json(currentRecord);
};

module.exports = {
    getCurrentDiaryRecord: ctrlWrapper(getCurrentDiaryRecord),
    addDiaryProduct: ctrlWrapper(addDiaryProduct),
    addDiaryExercise: ctrlWrapper(addDiaryExercise),
<<<<<<< HEAD
    removeDiaryProduct: ctrlWrapper(removeDiaryProduct),
    removeDiaryExercise: ctrlWrapper(removeDiaryExercise),
=======
>>>>>>> main
};
