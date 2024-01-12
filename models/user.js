const { Schema, model } = require('mongoose');
const Joi = require('joi');

const handleMongooseError = require('../helpers/handleMongooseError');

const emailPattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            match: emailPattern,
            unique: true,
        },
        password: {
            type: String,
            minLength: 6,
            required: [true, 'Password is required'],
        },
    },
    { versionKey: false, timestamps: true }
);

userSchema.post('save', handleMongooseError);

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().pattern(emailPattern).required(),
    password: Joi.string().min(6).required(),
});

const User = model('user', userSchema);
module.exports = { User, registerSchema };
