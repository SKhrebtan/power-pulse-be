const router = require('express').Router();

const ctrl = require('../../controllers/products');
const { validateBody, isValidId, authenticate } = require('../../middlewares');

router.get('/', ctrl.getAllProducts);
router.get('/:productId', isValidId, ctrl.getProductById);

module.exports = router;
