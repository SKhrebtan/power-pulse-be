const express = require('express');
const authCtrl = require('../../controllers/auth');
const authenticate = require('../../middlewares/authenticate');
const upload = require('../../middlewares/cloudinary');
const isValidId = require('../../middlewares/isValidId');
const validateBody = require('../../middlewares/validateBody');
const {
    registerSchema,
    loginSchema,
    updateSchema,
} = require('../../models/user');

const router = express.Router();

router.post('/register', validateBody(registerSchema), authCtrl.register);
router.post('/login', validateBody(loginSchema), authCtrl.login);
router.get('/current', authenticate, authCtrl.current);
router.post('/logout', authenticate, authCtrl.logout);

router.patch(
    '/:id',
    authenticate,
    isValidId,
    validateBody(updateSchema),
    authCtrl.update
);

router.put(
    '/upload',
    authenticate,
    upload.single('image'),
    authCtrl.updateAvatar
);
module.exports = router;
