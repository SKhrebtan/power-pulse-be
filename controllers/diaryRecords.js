const { DiaryRecord } = require('../models/diaryRecord');

const { HttpError, ctrlWrapper } = require('../helpers');
const { Exercise } = require('../models/exercise');
const { Product } = require('../models/product');

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
        "products.product":product
    }

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
            upsert:true,
            new: true
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
                "products.$[element].amount": +amount,
                "products.$[element].calories": +calories,
            },
        },
        {
           arrayFilters:[{"element.product":product}],
            new: true
        }
    )
        .populate('products.product', 'title category groupBloodNotAllowed')
        .populate('exercises.exercise', 'name bodyPart equipment target');
        
        res.json(currentRecord);
    };
};

// add exercise to diary

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
        "exercises.exercise":exercise
    }

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
        { new: true }
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
                "exercises.$[element].time": +time,
                "exercises.$[element].calories": +calories,
            },
        },
        {
           arrayFilters:[{"element.exercise":exercise}],
            new: true
        }
    )
        .populate('products.product', 'title category groupBloodNotAllowed')
        .populate('exercises.exercise', 'name bodyPart equipment target');
        
        res.json(currentRecord);
    };
    
};

const removeDiaryProduct = async (req, res) => {
    const { _id: user } = req.user;
    const { date, itemId: product } = req.params;
    const { calories } = req.body;

    const result = await Product.findById(product);
    if (!result)
        throw HttpError(404, `Product by ID: "${product}" not found`);

    const currentRecord = await DiaryRecord.findOneAndUpdate(
        {
            user,
            date,
            "products.product":product,
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
            new: true
        }
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

    const result = await Exercise.findById(exercise);
    if (!result)
        throw HttpError(404, `Exercise by ID: "${exercise}" not found`);

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
    removeDiaryProduct: ctrlWrapper(removeDiaryProduct),
    removeDiaryExercise: ctrlWrapper(removeDiaryExercise),
};
