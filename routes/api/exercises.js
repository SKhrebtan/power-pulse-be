const router = require('express').Router();

const ctrl = require('../../controllers/exercises');
const { isValidId, authenticate } = require('../../middlewares');

router.get('/', authenticate, ctrl.getAllExercises);
router.get('/:exerciseId', authenticate, isValidId, ctrl.getExerciseById);

module.exports = router;
