const router = require('express').Router();

const authCtrl = require('../../controllers/auth');
const {
    authenticate,
    validateBody,
    upload,
    validateFormats,
} = require('../../middlewares');

const {
    registerSchema,
    loginSchema,
    updateSchema,
    verifyEmailSchema,
    verifyTokenSchema,
} = require('../../models/user');

router.post('/register', validateBody(registerSchema), authCtrl.register);
router.post('/login', validateBody(loginSchema), authCtrl.login);
router.get('/current', authenticate, authCtrl.current);
router.post('/logout', authenticate, authCtrl.logout);
router.patch('/', authenticate, validateBody(updateSchema), authCtrl.update);
router.put(
    '/upload',
    authenticate,
    validateFormats(upload.single('image')),
    authCtrl.updateAvatar
);
router.post('/verify', validateBody(verifyTokenSchema), authCtrl.verify);
router.post(
    '/verifyResend',
    validateBody(verifyEmailSchema),
    authCtrl.verifyResend
);
router.get('/v/:verificationToken', authCtrl.verifyEmail);

module.exports = router;
