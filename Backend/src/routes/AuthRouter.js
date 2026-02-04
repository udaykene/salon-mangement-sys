const { signup } = require('../controllers/AuthController');
const { SignUpValidation, LoginValidation } = require('../middlewares/AuthValidation');

const router = require('express').Router();


router.post('/login',LoginValidation,)

router.post('/signup',SignUpValidation,signup);

module.exports = router;