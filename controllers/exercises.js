const { Exercise } = require('../models/exercise');
const { Filter } = require('../models/filter');
const { HttpError, ctrlWrapper } = require('../helpers');

const getAllExercises = async (req, res) => {
    const { bodyPart = null, equipment = null, target = null } = req.query;

    if (bodyPart) {
        const result = await Exercise.find({ bodyPart }).sort({ name: 1 });
        if (!result.length) throw HttpError(400, 'Please change filter');
        res.json(result);
        return;
    }

    if (equipment) {
        const result = await Exercise.find({ equipment }).sort({ name: 1 });
        if (!result.length) throw HttpError(400, 'Please change filter');
        res.json(result);
        return;
    }

    if (target) {
        const result = await Exercise.find({ target }).sort({ name: 1 });
        if (!result.length) throw HttpError(400, 'Please change filter');
        res.json(result);
        return;
    }

    const result = await Exercise.find().sort({ name: 1 });
    res.json(result);
};

const getExerciseById = async (req, res) => {
    const { exerciseId } = req.params;
    const result = await Exercise.findById(exerciseId);
    if (!result)
        throw HttpError(404, `Exercise by ID: "${exerciseId}" not found`);
    res.json(result);
};

const getAllFilters = async (req, res) => {
    const { filter = 'Body parts' } = req.query;

    const result = await Filter.find({ filter }).sort({ name: 1 });
    if (!result.length)
        throw HttpError(400, 'Please change filter: "Equipment" or "Muscles"');

    res.json(result);
};

module.exports = {
    getAllExercises: ctrlWrapper(getAllExercises),
    getExerciseById: ctrlWrapper(getExerciseById),
    getAllFilters: ctrlWrapper(getAllFilters),
};
