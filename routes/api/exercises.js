const router = require('express').Router();

const ctrl = require('../../controllers/exercises');
const { isValidId, authenticate } = require('../../middlewares');

router.get('/', ctrl.getAllExercises);
router.get('/:exerciseId', isValidId, ctrl.getExerciseById);

module.exports = router;
