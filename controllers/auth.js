const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { HttpError, ctrlWrapper } = require('../helpers');
require('dotenv').config();

const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, 'Email in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ ...req.body, password: hashPassword });

    res.status(201).json({
        user: {
            message: 'User was created successfully',
            name: newUser.name,
            email: newUser.email,
        },
    });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, 'Email or password is wrong');
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
        throw HttpError(401, 'Email or password is wrong');
    }

    const payload = {
        id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
        token: token,
        user: {
            name: user.name,
            email: user.email,
        },
    });
};

const current = async (req, res, next) => {
    const { email, name } = req.user;
    res.status(200).json({ user: { name: name, email: email } });
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' });

    res.status(200).json({ message: 'Logout success' });
};

const update = async (req, res) => {
    const { _id } = req.user;
    const { password, ...data } = req.body;
    let hashPassword;
    if (password) {
        hashPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = {
        ...(password && { password: hashPassword }),
        ...data,
    };
    const user = await User.findByIdAndUpdate(_id, updatedUser, {
        new: true,
    });
    if (!user) {
        throw HttpError(404, 'Not found');
    }
    res.status(200).json(user);
};
module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    current: ctrlWrapper(current),
    logout: ctrlWrapper(logout),
    update: ctrlWrapper(update),
};
