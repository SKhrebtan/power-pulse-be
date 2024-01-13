const express = require('express');

const ctrl = require('../../controllers/exercises');
const { isValidId, authenticate } = require('../../middlewares');

const router = express.Router();

router.get('/', ctrl.getAllExercises);
router.get('/:exerciseId', isValidId, ctrl.getExerciseById);

module.exports = router;
