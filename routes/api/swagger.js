const router = require('express').Router();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../swagger.json');

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument));

module.exports = router;

// {"parameters": [
//     {
//     "in":"path - :userID / query - ?q=fish",
//     "name":"userID - (params- :userID,)",
//     "required":true,
//     "type":"string",
//     "description":"User's ID"
//     }
// ],
// "security": [{ "Bearer": [] }]}
