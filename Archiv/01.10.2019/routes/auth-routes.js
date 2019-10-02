
const express = require('express');
const router = express.Router();

const User = require('../models/user-model');


const bcrypt = require('bcryptjs');
const bcryptSalt = 10;

router.get('/signup',(req, res, next) => {
    res.render('auth/signup');
})
module.exports = router;
