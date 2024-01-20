const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { HttpError, ctrlWrapper, sendEmail } = require('../helpers');
const BMR = require('../helpers/dailyCalories');
const { nanoid } = require('nanoid');
require('dotenv').config();

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, 'Email in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();

    const newUser = await User.create({
        ...req.body,
        password: hashPassword,
        verificationToken,
    });

    const verifyEmail = {
        to: email,
        subject: 'Verify email',
        html: `<p>Please confirm your <i>Email</i></p><a href="https://saltyua.github.io/power-pulse-fs/signin?v=${verificationToken}" target="_blank">Click verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
        user: {
            message: 'User was created successfully',
            name: newUser.name,
            email: newUser.email,
        },
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) throw HttpError(401, 'Email or password is wrong');

    if (!user.verify) throw HttpError(401, 'Email not verified');

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) throw HttpError(401, 'Email or password is wrong');

    const payload = { id: user._id };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });

    const userLoggedIn = await User.findByIdAndUpdate(
        user._id,
        { token },
        {
            new: true,
            select: '-createdAt -updatedAt -password -verify -verificationToken',
        }
    );

    res.json({ user: userLoggedIn });
};

const current = async (req, res) => {
    res.json({
        user: req.user,
    });
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' });

    res.json({ message: 'Logout success' });
};

const update = async (req, res) => {
    const { _id } = req.user;

    const { ...updatedUserData } = req.body;

    const user = await User.findByIdAndUpdate(_id, updatedUserData);

    if (!user) {
        throw new HttpError(404, `User by ID: "${_id}" not found`);
    }

    user.dailyCalories = BMR(
        user.sex,
        user.currentWeight,
        user.height,
        user.birthday,
        user.levelActivity
    );

    const updatedUser = await User.findByIdAndUpdate(
        _id,
        { dailyCalories: user.dailyCalories },
        {
            new: true,
            select: '-createdAt -updatedAt -password -verify -verificationToken',
        }
    );

    res.json(updatedUser);
};

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const avatarURL = req.file.path;

    await User.findByIdAndUpdate(
        _id,
        { avatarURL },
        {
            new: true,
        }
    );
    res.json({ avatarURL: avatarURL });
};

const verify = async (req, res) => {
    const { verificationToken } = req.body;
    const user = await User.findOne({ verificationToken });

    if (!user) throw HttpError(404, 'User not found!');

    if (user.verify) throw HttpError(400, 'Email already verified');

    await User.findByIdAndUpdate(user._id, {
        verify: true,
        verificationToken: null,
    });

    res.json({
        message: 'Verification successful!',
    });
};

const verifyResend = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) throw HttpError(404, 'User not found');

    if (user.verify) throw HttpError(400, 'Email already verified');

    const verifyEmail = {
        to: email,
        subject: 'Verify email',
        html: `<p>Please confirm your <i>Email</i></p><a href="https://saltyua.github.io/power-pulse-fs/signin?v=${user.verificationToken}" target="_blank">Click verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.json({
        message: 'Verification email sent',
    });
};

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    current: ctrlWrapper(current),
    logout: ctrlWrapper(logout),
    update: ctrlWrapper(update),
    updateAvatar: ctrlWrapper(updateAvatar),
    verify: ctrlWrapper(verify),
    verifyResend: ctrlWrapper(verifyResend),
};
