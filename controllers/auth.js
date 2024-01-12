const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const { HttpError, ctrlWrapper } = require('../helpers');

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

module.exports = {
    register: ctrlWrapper(register),
};
