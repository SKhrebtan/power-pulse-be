const { Exercise } = require('../models/exercise');
const { ctrlWrapper } = require('../helpers');

const getAllExercises = async (req, res) => {
    const result = await Exercise.find();
    res.json(result);
};

module.exports = {
    getAllExercises: ctrlWrapper(getAllExercises),
};
