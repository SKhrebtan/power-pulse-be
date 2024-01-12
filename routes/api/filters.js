const express = require('express');

const ctrl = require('../../controllers/filters');
// const { validateBody, isValidId, authenticate } = require('../../middlewares');

const router = express.Router();

router.get('/', ctrl.getAllFilters);

module.exports = router;
