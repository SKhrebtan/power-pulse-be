const router = require('express').Router();

const ctrl = require('../../controllers/diaryRecords');
const {
    validateBody,
    authenticate,
    validateParams,
    isValidId,
} = require('../../middlewares');

const { schemas } = require('../../models/diaryRecord');

// get specific record, by date for authorized user
router.get(
    '/:date',
    authenticate,
    validateParams(schemas.checkDateSchema),
    ctrl.getCurrentDiaryRecord
);

// add exercise to diary
router.post(
    '/add-exercise/:exerciseId',
    authenticate,
    isValidId,
    validateBody(schemas.addDiaryExerciseSchema),
    ctrl.addDiaryExercise
);

// add product to diary
router.post(
    '/add-product/:productId',
    authenticate,
    isValidId,
    validateBody(schemas.addDiaryProductSchema),
    ctrl.addDiaryProduct
);

router.patch(
    '/:date/remove-product/:itemId',
    authenticate,
    isValidId,
    validateParams(schemas.checkDateAndIdSchema),
    validateBody(schemas.removeDiaryProductSchema),
    ctrl.removeDiaryProduct
);

router.patch(
    '/:date/remove-exercise/:itemId',
    authenticate,
    isValidId,
    validateParams(schemas.checkDateSchema),
    validateBody(schemas.removeDiaryExerciseSchema),
    ctrl.removeDiaryExercise
);

module.exports = router;
