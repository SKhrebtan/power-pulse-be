const activityCoefficient = require('./activityCoefficient');

const BMR = (sex, currentWeight, height, birthday, levelActivity) => {
    const now = new Date();
    const age = now.getFullYear() - birthday.getFullYear();

    if (sex === 'male') {
        return Math.ceil(
            (10 * currentWeight + 6.25 * height - 5 * age + 5) *
                activityCoefficient(levelActivity)
        );
    } else {
        return Math.ceil(
            (10 * currentWeight + 6.25 * height - 5 * age - 161) *
                activityCoefficient(levelActivity)
        );
    }
};

module.exports = BMR;
