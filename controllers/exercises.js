const { Exercise } = require('../models/exercise');
const { HttpError, ctrlWrapper } = require('../helpers');

const getAllExercises = async (req, res) => {
    const result = await Exercise.find();
    res.json(result);
};

const getExerciseById = async (req, res) => {
    const result = await Exercise.findById(req.params.exerciseId);
    if (!result) throw HttpError(404, 'Not Found!');
    res.json(result);
};

module.exports = {
    getAllExercises: ctrlWrapper(getAllExercises),
    getExerciseById: ctrlWrapper(getExerciseById),
};
