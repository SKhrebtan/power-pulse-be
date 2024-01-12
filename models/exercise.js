const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

const exerciseSchema = new Schema(
    {
        bodyPart: {
            type: String,
            required: true,
        },
        equipment: {
            type: String,
            required: true,
        },
        gifUrl: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        target: {
            type: String,
            required: true,
        },
        burnedCalories: {
            type: Number,
            required: true,
        },
        time: {
            type: Number,
            required: true,
        },
    },
    { versionKey: false, timestamps: true }
);

exerciseSchema.post('save', handleMongooseError);

const Exercise = model('exercise', exerciseSchema);

module.exports = { Exercise };
