/*
    Rutas de Usuarios / auth
    host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { createUser, loginUser, renewToken } = require('../controllers/authController');
const { fieldValidator } = require('../middlewares/field-validator');
const { validateJWT } = require('../middlewares/jwt-validator');


router.post(
    '/register',
    [ // Middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
        fieldValidator
    ]
    , createUser);

router.post('/',
    [ // Middlewares
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
        fieldValidator
    ],
    loginUser);

router.get('/renew', validateJWT, renewToken);

module.exports = router;