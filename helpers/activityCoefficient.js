function activityCoefficient(level) {
    const coefficients = { 1: 1.2, 2: 1.375, 3: 1.55, 4: 1.725, 5: 1.9 };
    return coefficients[level];
}

module.exports = activityCoefficient;
