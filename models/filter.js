const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

const filterSchema = new Schema(
    {
        filter: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        imgURL: {
            type: String,
            required: true,
        },
    },
    { versionKey: false, timestamps: true }
);

filterSchema.post('save', handleMongooseError);

const Filter = model('filter', filterSchema);

module.exports = { Filter };
