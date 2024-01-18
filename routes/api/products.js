const router = require('express').Router();

const ctrl = require('../../controllers/products');
const { isValidId, authenticate } = require('../../middlewares');

router.get('/', authenticate, ctrl.getAllProducts);
router.get('/:productId', authenticate, isValidId, ctrl.getProductById);
router.get('/categories', authenticate, ctrl.getAllCategories);

module.exports = router;
