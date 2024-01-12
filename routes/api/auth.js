const express = require('express');
const authCtrl = require('../../controllers/auth');
const authenticate = require('../../middlewares/authenticate');
const validateBody = require('../../middlewares/validateBody');
const { registerSchema, loginSchema } = require('../../models/user');

const router = express.Router();

router.post('/register', validateBody(registerSchema), authCtrl.register);
router.post('/login', validateBody(loginSchema), authCtrl.login);
router.get('/current', authenticate, authCtrl.current);
router.post('/logout', authenticate, authCtrl.logout);
router.patch('/', authenticate, authCtrl.update);
module.exports = router;
