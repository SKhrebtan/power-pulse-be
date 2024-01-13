const { Exercise } = require('../models/exercise');
const { HttpError, ctrlWrapper } = require('../helpers');

const getAllExercises = async (req, res) => {
    const { bodyPart = null, equipment = null, target = null } = req.query;

    if (bodyPart) {
        const result = await Exercise.find({ bodyPart });
        if (!result.length) throw HttpError(400, 'Please change filter');
        res.json(result);
        return;
    }

    if (equipment) {
        const result = await Exercise.find({ equipment });
        if (!result.length) throw HttpError(400, 'Please change filter');
        res.json(result);
        return;
    }

    if (target) {
        const result = await Exercise.find({ target });
        if (!result.length) throw HttpError(400, 'Please change filter');
        res.json(result);
        return;
    }

    const result = await Exercise.find();
    res.json(result);
};

const getExerciseById = async (req, res) => {
    const { exerciseId } = req.params;
    const result = await Exercise.findById(exerciseId);
    if (!result)
        throw HttpError(404, `Exercise by ID: "${exerciseId}" not found`);
    res.json(result);
};

module.exports = {
    getAllExercises: ctrlWrapper(getAllExercises),
    getExerciseById: ctrlWrapper(getExerciseById),
};
