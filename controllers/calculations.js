const { HttpError, ctrlWrapper } = require('../helpers');

const calculations = async (req, res, next) => {
    const { name, height, currentWeight, birthday, sex, levelActivity } =
        req.user;

    if (!height || !currentWeight || !birthday || !sex || !levelActivity) {
        throw HttpError(400, 'Please fill in all information');
    }

    const dailySportTime = 110;

    const now = new Date();
    const age = now.getFullYear() - birthday.getFullYear();
    console.log(age);
    let BMR = 0;

    if (sex === 'male') {
        BMR =
            (10 * currentWeight + 6.25 * height - 5 * age + 5) *
            activityCoefficient(levelActivity);
    }
    BMR =
        (10 * currentWeight + 6, 25 * height - 5 * age - 161) *
        activityCoefficient(levelActivity);

    res.status(200).json({
        data: {
            name: name,
            dailyCalories: BMR + ' kcal',
            dailySportTime: dailySportTime + ' min',
        },
    });
};

function activityCoefficient(level) {
    const coefficients = { 1: 1.2, 2: 1.375, 3: 1.55, 4: 1.725, 5: 1.9 };
    return coefficients[level];
}

module.exports = { calculations: ctrlWrapper(calculations) };
