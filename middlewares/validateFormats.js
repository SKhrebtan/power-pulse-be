const multer = require('multer');

const validateFormats = image => {
    const func = (req, res, next) => {
        image(req, res, err => {
            if (err instanceof multer.MulterError) {
                return res.status(415).json({
                    error: 'Unsupported Media Type',
                    message: err.message,
                });
            } else if (err) {
                return res.status(415).json({
                    error: 'Unsupported Media Type',
                    message: err.message,
                });
            }

            next();
        });
    };

    return func;
};

module.exports = validateFormats;
