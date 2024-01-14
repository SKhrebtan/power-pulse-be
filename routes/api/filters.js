const router = require('express').Router();

const ctrl = require('../../controllers/filters');
// const { validateBody, isValidId, authenticate } = require('../../middlewares');

router.get('/', ctrl.getAllFilters);

module.exports = router;
