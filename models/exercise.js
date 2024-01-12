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

        // owner: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'user',
        //     required: true,
        // },
    },
    { versionKey: false, timestamps: true }
);

exerciseSchema.post('save', handleMongooseError);

const Exercise = model('exercise', exerciseSchema);

module.exports = { Exercise };

//   "name": "assisted chest dip (kneeling)",
//   "target": "pectorals",
//   "burnedCalories": 329,
//   "time": 3
// }
