const { Schema, model } = require('mongoose');
const Joi = require('joi');

const handleMongooseError = require('../helpers/handleMongooseError');
const { HttpError } = require('../helpers');

const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

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
        token: {
            type: String,
            default: null,
        },
        height: {
            type: Number,
            default: null,
        },
        currentWeight: {
            type: Number,
            default: null,
        },
        desiredWeight: {
            type: Number,
            default: null,
        },
        birthday: {
            type: Date,
            default: null,
        },
        blood: {
            type: Number,
            enum: [1, 2, 3, 4],
            default: null,
        },
        sex: {
            type: String,
            enum: ['male', 'female'],
            default: null,
        },
        levelActivity: {
            type: Number,
            enum: [1, 2, 3, 4, 5],
            default: null,
        },
        dailySportTime: {
            type: Number,
            default: 110,
        },
        dailyCalories: {
            type: Number,
            default: 0,
        },
        avatarURL: {
            type: String,
            default:
                'https://res.cloudinary.com/doiiko7sq/image/upload/v1705323621/default-avatar/default_dmhmqw.jpg',
        },
        verify: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
            required: [true, 'Verify token is required'],
        },
    },
    { versionKey: false, timestamps: true }
);

userSchema.post('save', handleMongooseError);

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
        .email()
        .pattern(emailPattern)
        .required()
        .empty(false)
        .messages({
            'string.base': 'The email must be a string.',
            'any.required': 'The email field is required.',
            'string.empty': 'The email must not be empty.',
            'string.pattern.base':
                'The email must be in format test@gmail.com.',
        }),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .pattern(emailPattern)
        .required()
        .empty(false)
        .messages({
            'string.base': 'The email must be a string.',
            'any.required': 'The email field is required.',
            'string.empty': 'The email must not be empty.',
            'string.pattern.base':
                'The email must be in format test@gmail.com.',
        }),
    password: Joi.string().min(6).required(),
});

const updateSchema = Joi.object({
    name: Joi.string(),
    height: Joi.number().min(150).required(),
    currentWeight: Joi.number().min(35).required(),
    desiredWeight: Joi.number().min(35).required(),
    birthday: Joi.date()
        .max('now')
        .required()
        .custom(value => {
            const currentDate = new Date();
            const eighteenYearsAgo = currentDate.getFullYear() - 18;
            if (value.getFullYear() <= eighteenYearsAgo) {
                return value;
            } else {
                throw HttpError(400, 'The person must be 18 years or older');
            }
        }),
    blood: Joi.number().required().valid(1, 2, 3, 4),
    sex: Joi.string().required().valid('male', 'female'),
    levelActivity: Joi.number().required().valid(1, 2, 3, 4, 5),
});

const verifyEmailSchema = Joi.object({
    email: Joi.string()
        .email()
        .pattern(emailPattern)
        .required()
        .empty(false)
        .messages({
            'string.base': 'The email must be a string.',
            'any.required': 'The email field is required.',
            'string.empty': 'The email must not be empty.',
            'string.pattern.base':
                'The email must be in format test@gmail.com.',
        }),
});

const verifyTokenSchema = Joi.object({
    verificationToken: Joi.string().required(),
});

const User = model('user', userSchema);
module.exports = {
    User,
    registerSchema,
    loginSchema,
    updateSchema,
    verifyTokenSchema,
    verifyEmailSchema,
};
