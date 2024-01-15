const router = require('express').Router();

const ctrl = require('../../controllers/categories');
const { authenticate } = require('../../middlewares');

router.get('/', authenticate, ctrl.getAllCategories);

module.exports = router;
