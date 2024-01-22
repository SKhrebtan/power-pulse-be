const { DiaryRecord } = require('../models/diaryRecord');

const { HttpError, ctrlWrapper } = require('../helpers');
const { Exercise } = require('../models/exercise');
const { Product } = require('../models/product');

const getCurrentDiaryRecord = async (req, res) => {
    const { _id: user } = req.user;
    const { date } = req.params;
    const currentRecord = await DiaryRecord.findOne({ user, date })
        .populate('products.product', 'title category groupBloodNotAllowed')
        .populate('exercises.exercise', 'name bodyPart equipment target');

    if (!currentRecord) {
        throw HttpError(404, 'No records for this date');
    }

    res.json(currentRecord);
};

const addDiaryProduct = async (req, res) => {
    const { _id: user } = req.user;
    const { productId: product } = req.params;
    const { date, amount, calories } = req.body;

    const result = await Product.findById(product);
    if (!result) throw HttpError(404, `Product by ID: "${product}" not found`);

    // filter to check if product exists in diary
    const filter = {
        user,
        date,
        'products.product': product,
    };

    // check if currentProduct exist in diary
    const currentProductCount = await DiaryRecord.countDocuments(filter);

    // if doesn't exist in diary create new product, else update current record
    if (!currentProductCount) {
        const currentRecord = await DiaryRecord.findOneAndUpdate(
            {
                user,
                date,
            },
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
            {
                upsert: true,
                new: true,
            }
        )
            .populate('products.product', 'title category groupBloodNotAllowed')
            .populate('exercises.exercise', 'name bodyPart equipment target');

        res.json(currentRecord);
    } else {
        const currentRecord = await DiaryRecord.findOneAndUpdate(
            filter,
            {
                $inc: {
                    caloriesConsumed: +calories,
                    'products.$[element].amount': +amount,
                    'products.$[element].calories': +calories,
                },
            },
            {
                arrayFilters: [{ 'element.product': product }],
                new: true,
            }
        )
            .populate('products.product', 'title category groupBloodNotAllowed')
            .populate('exercises.exercise', 'name bodyPart equipment target');

        res.json(currentRecord);
    }
};

const addDiaryExercise = async (req, res) => {
    const { _id: user } = req.user;
    const { exerciseId: exercise } = req.params;
    const { date, time, calories } = req.body;

    const result = await Exercise.findById(exercise);
    if (!result)
        throw HttpError(404, `Exercise by ID: "${exercise}" not found`);

    const filter = {
        user,
        date,
        'exercises.exercise': exercise,
    };

    // check if currentExercise exist in diary
    const currentExerciseCount = await DiaryRecord.countDocuments(filter);

    // if doesn't exist in diary create new exercise, else update current record
    if (!currentExerciseCount) {
        const currentRecord = await DiaryRecord.findOneAndUpdate(
            {
                user,
                date,
            },
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
            {
                upsert: true,
                new: true,
            }
        )
            .populate('products.product', 'title category groupBloodNotAllowed')
            .populate('exercises.exercise', 'name bodyPart equipment target');

        res.json(currentRecord);
    } else {
        const currentRecord = await DiaryRecord.findOneAndUpdate(
            filter,
            {
                $inc: {
                    caloriesBurned: +calories,
                    activity: +time,
                    'exercises.$[element].time': +time,
                    'exercises.$[element].calories': +calories,
                },
            },
            {
                arrayFilters: [{ 'element.exercise': exercise }],
                new: true,
            }
        )
            .populate('products.product', 'title category groupBloodNotAllowed')
            .populate('exercises.exercise', 'name bodyPart equipment target');

        res.json(currentRecord);
    }
};

const removeDiaryProduct = async (req, res) => {
    const { _id: user } = req.user;
    const { date, productId: product } = req.params;

    const result = await Product.findById(product);
    if (!result) throw HttpError(404, `Product by ID: "${product}" not found`);

    let currentRecord = await DiaryRecord.findOne({
        date,
        user,
        'products.product': product,
    });

    if (!currentRecord) {
        throw HttpError(
            404,
            `Product with id ${product} has no records for this date`
        );
    }

    const { calories } = currentRecord.products.find(record => {
        return record.product.toString() === product;
    });

    currentRecord = await DiaryRecord.findOneAndUpdate(
        {
            user,
            date,
            'products.product': product,
        },
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
        {
            new: true,
        }
    )
        .populate('products.product', 'title category groupBloodNotAllowed')
        .populate('exercises.exercise', 'name bodyPart equipment target');

    res.json(currentRecord);
};

const removeDiaryExercise = async (req, res) => {
    const { _id: user } = req.user;
    const { date, exerciseId: exercise } = req.params;

    const result = await Exercise.findById(exercise);
    if (!result)
        throw HttpError(404, `Exercise by ID: "${exercise}" not found`);

    let currentRecord = await DiaryRecord.findOne({
        user,
        date,
        'exercises.exercise': exercise,
    });

    if (!currentRecord) {
        throw HttpError(
            404,
            `Exercise with id ${exercise} has no records for this date`
        );
    }

    const { time, calories } = currentRecord.exercises.find(record => {
        return record.exercise.toString() === exercise;
    });

    currentRecord = await DiaryRecord.findOneAndUpdate(
        {
            user,
            date,
            'exercises.exercise': exercise,
        },
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

    res.json(currentRecord);
};

module.exports = {
    getCurrentDiaryRecord: ctrlWrapper(getCurrentDiaryRecord),
    addDiaryProduct: ctrlWrapper(addDiaryProduct),
    addDiaryExercise: ctrlWrapper(addDiaryExercise),
    removeDiaryProduct: ctrlWrapper(removeDiaryProduct),
    removeDiaryExercise: ctrlWrapper(removeDiaryExercise),
};
