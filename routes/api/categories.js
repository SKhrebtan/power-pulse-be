const express = require('express');

const ctrl = require('../../controllers/categories');
// const { validateBody, isValidId, authenticate } = require('../../middlewares');

const router = express.Router();

router.get('/', ctrl.getAllCategories);

module.exports = router;
