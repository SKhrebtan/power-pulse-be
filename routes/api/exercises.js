const express = require('express');

const ctrl = require('../../controllers/exercises');
// const { validateBody, isValidId, authenticate } = require('../../middlewares');

const router = express.Router();

router.get('/', ctrl.getAllExercises);

module.exports = router;
