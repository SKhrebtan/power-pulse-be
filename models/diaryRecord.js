const { Schema, model } = require('mongoose');
const Joi = require("joi");
const { handleMongooseError } = require('../helpers');

const datePattern = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/

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
        caloriesConsumed: {
            type: Number,
            required: true,
            default: 0,
        },
        caloriesBurned: {
            type: Number,
            required: true,
            default: 0,
        },
        activity: {
            type: Number,
            required: true,
            default: 0,
        },
    },
);

diaryRecordSchema.post('save', handleMongooseError);

const checkDateSchema = Joi.object({
    date: Joi.string().pattern(datePattern).required().messages({
        "string.pattern.base": "Enter valid date in the format dd-mm-YYYY",
        "any.required": "Date is required",
    }),
});

const addDiaryProductSchema = Joi.object({
    date: Joi.string().pattern(datePattern).required().messages({
        "string.pattern.base": "Enter valid date in the format dd-mm-YYYY",
        "any.required": "Date is required"
    }),
    amount: Joi.number().integer().min(1).required().messages({
        "any.required": "Amount is required",
        "number.min" : "Please add at least 1 gram"
    }),
    calories: Joi.number().integer().min(1).required().messages({
        "any.required": "Calories are required",
        "number.min": "Please add at least 1 calorie"
    }),
});

const addDiaryExerciseSchema = Joi.object({
    date: Joi.string().pattern(datePattern).required().messages({
        "string.pattern.base": "Enter valid date in the format dd-mm-YYYY",
        "any.required": "Date is required",
    }),
    exercise: Joi.string().required().messages({
        "any.required": "ExerciseId is required",
        "string.base": "ExerciseId must be string"
    }),
    time: Joi.number().integer().min(1).required().messages({
        "any.required": "Time is required",
        "number.min": "Please add at least 1 minute"
    }),
    calories: Joi.number().integer().min(1).required().messages({
        "any.required": "Calories are required",
        "number.min": "Please add at least 1 calorie"
    }),
});



const schemas = {
    addDiaryProductSchema,
    addDiaryExerciseSchema,
    checkDateSchema,
};

const DiaryRecord = model('diaryRecord', diaryRecordSchema);

module.exports = {
    DiaryRecord,
    schemas,
};
