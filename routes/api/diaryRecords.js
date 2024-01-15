const express = require('express');

const ctrl = require('../../controllers/diaryRecords');
const { validateBody, authenticate } = require('../../middlewares');

const { schemas } = require('../../models/diaryRecord');

const router = express.Router();

// get specific record, by date for authorized user
router.get('/', authenticate, validateBody(schemas.checkDateSchema), ctrl.getCurrentDiaryRecord);


// add exercise to diary
router.post('/add-exercise', authenticate, validateBody(schemas.addDiaryExerciseSchema), ctrl.addDiaryExercise);

// add product to diary
router.post('/add-product', authenticate, validateBody(schemas.addDiaryProductSchema), ctrl.addDiaryProduct);


module.exports = router;
