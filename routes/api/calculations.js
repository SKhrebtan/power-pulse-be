const express = require('express');
const { calculations } = require('../../controllers/calculations');
const authenticate = require('../../middlewares/authenticate');

const router = express.Router();

router.get('/calculations', authenticate, calculations);

module.exports = router;
