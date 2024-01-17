const router = require('express').Router();

const authCtrl = require('../../controllers/auth');
const {
    authenticate,
    isValidId,
    validateBody,
    upload,
    validateFormats,
} = require('../../middlewares');

const {
    registerSchema,
    loginSchema,
    updateSchema,
} = require('../../models/user');

router.post('/register', validateBody(registerSchema), authCtrl.register);
router.post('/login', validateBody(loginSchema), authCtrl.login);
router.get('/current', authenticate, authCtrl.current);
router.post('/logout', authenticate, authCtrl.logout);

router.patch(
    '/:userId',
    authenticate,
    isValidId,
    validateBody(updateSchema),
    authCtrl.update
);

router.put(
    '/upload',
    authenticate,
    validateFormats(upload.single('image')),
    authCtrl.updateAvatar
);
module.exports = router;
