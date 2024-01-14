const express = require('express');

const ctrl = require('../../controllers/diaryRecords');
const { validateBody, isValidId, authenticate } = require('../../middlewares');

const { schemas } = require('../../models/diaryRecord');

const router = express.Router();


// add product to diary
router.post('/:productId', isValidId, authenticate, validateBody(schemas.addDiaryProductSchema), ctrl.addDiaryProduct);

router.get('/', authenticate, validateBody(schemas.checkDateSchema), ctrl.getCurrentDiaryRecord);

module.exports = router;
