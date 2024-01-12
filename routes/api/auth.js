const express = require('express');
const authCtrl = require('../../controllers/auth');
const validateBody = require('../../middlewares/validateBody');
const { registerSchema } = require('../../models/user');

const router = express.Router();

router.post('/register', validateBody(registerSchema), authCtrl.register);

module.exports = router;
