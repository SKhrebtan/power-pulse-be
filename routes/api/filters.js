const router = require('express').Router();

const ctrl = require('../../controllers/filters');
const { authenticate } = require('../../middlewares');

router.get('/', authenticate, ctrl.getAllFilters);

module.exports = router;
