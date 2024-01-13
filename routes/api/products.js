const express = require('express');

const ctrl = require('../../controllers/products');
// const { validateBody, isValidId, authenticate } = require('../../middlewares');

const router = express.Router();

router.get('/', ctrl.getAllProducts);

module.exports = router;
