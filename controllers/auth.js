const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { HttpError, ctrlWrapper } = require('../helpers');
const BMR = require('../helpers/dailyCalories');
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

    const userLoggedIn = await User.findByIdAndUpdate(
        user._id,
        { token },
        {
            new: true,
            select: '-createdAt -updatedAt -password',
        }
    );

    res.json({
        user: userLoggedIn,
    });
};

const current = async (req, res, next) => {
    res.json({
        user: req.user,
    });
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' });

    res.json({ message: 'Logout success' });
};

const update = async (req, res, next) => {
    const { userId } = req.params;
    const { _id } = req.user;

    if (userId !== _id.toString())
        throw HttpError(403, "You don't have permission to access");

    const { ...updatedUserData } = req.body;

    const user = await User.findByIdAndUpdate(userId, updatedUserData);

    if (!user) {
        throw new HttpError(404, `User by ID: "${userId}" not found`);
    }

    // if (
    //     !user.height ||
    //     !user.currentWeight ||
    //     !user.birthday ||
    //     !user.sex ||
    //     !user.levelActivity
    // ) {
    //     throw new HttpError(400, 'Please fill in all information');
    // }

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
        { new: true, select: '-createdAt -updatedAt -password' }
    );

    res.json(updatedUser);
};

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const avatarURL = req.file.path;
    console.log(req.file);

    await User.findByIdAndUpdate(
        _id,
        { avatarURL },
        {
            new: true,
        }
    );
    res.json({ avatarURL: avatarURL });
};

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    current: ctrlWrapper(current),
    logout: ctrlWrapper(logout),
    update: ctrlWrapper(update),
    updateAvatar: ctrlWrapper(updateAvatar),
};
