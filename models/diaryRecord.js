const { Schema, model } = require('mongoose');
const Joi = require("joi");
const { handleMongooseError } = require('../helpers');

const datePattern = /^\d{2}-\d{2}-\d{4}$/

const productRecordSchema = new Schema(
    {
        product: {
            type: Schema.Types.ObjectID,
            ref: 'product',
            required: [true, 'Product ID is required'],
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [1, 'Amount must be at least 1 gram'],
        },
        calories: {
            type: Number,
            required: [true, 'Calories are required'],
            min: [1, 'Must record at least 1 calorie'],
        },
    },
);

const exerciseRecordSchema = new Schema(
    {
        exercise: {
            type: Schema.Types.ObjectID,
            ref: 'exercise',
            required: [true, 'Exercise ID is required'],
        },
        time: {
            type: Number,
            required: [true, 'Time is required'],
            min: [1, 'Time must be at least 1 minute'],
        },
        calories: {
            type: Number,
            required: [true, 'Calories are required'],
            min: [1, 'Must record at least 1 calorie burned'],
        },
    },
);

const diaryRecordSchema = new Schema(
    {
        date: {
            type: String,
            require: true,
            match: datePattern,
        },
        user: {
            type: Schema.Types.ObjectID,
            ref: 'user',
            required: [true, 'User ID is required'],
        },
        products: [productRecordSchema],
        exercises: [exerciseRecordSchema],
        // caloriesConsumed: {
        //     type: Number,
        //     required: true,
        //     default: 0,
        // },
        // caloriesBurned: {
        //     type: Number,
        //     required: true,
        //     default: 0,
        // },
        // activity: {
        //     type: Number,
        //     required: true,
        //     default: 0,
        // },
    },
);

diaryRecordSchema.post('save', handleMongooseError);

const checkDateSchema = Joi.object({
    date: Joi.string().pattern(datePattern).required(),
});

const addDiaryProductSchema = Joi.object({
    date: Joi.string().pattern(datePattern).required(),
    amount: Joi.number().min(1).required(),
    calories: Joi.number().min(1).required(),
});



const schemas = {
    addDiaryProductSchema,
    checkDateSchema,
};

const DiaryRecord = model('diaryRecord', diaryRecordSchema);

module.exports = {
    DiaryRecord,
    schemas,
};
