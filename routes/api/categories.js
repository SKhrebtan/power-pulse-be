const router = require('express').Router();

const ctrl = require('../../controllers/categories');
// const { validateBody, isValidId, authenticate } = require('../../middlewares');

router.get('/', ctrl.getAllCategories);

module.exports = router;
