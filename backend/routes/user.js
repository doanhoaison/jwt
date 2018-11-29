const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

var validateRegisterInput = require('../validation/register');
var validateLoginInput = require('../validation/login');

const User = require('../models/User');

router.post('/register', (req, res) => {
    console.log(req.body);
    const { errors, isValid } = validateRegisterInput(req.body);
    console.log(errors);
    if(!isValid) {
        console.log(errors);
        return res.status(400).json(errors);
    } else {
        const avatar = gravatar.url(req.body.email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });
        var newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            avatar
        })
        User.findOne({
            email: req.body.email
        }).then(user => {
            if(user){
                errors.email = 'Email is already existed';
                return res.status(400).json(errors);
            } else {
                bcrypt.genSalt(10, (error, hash) => {
                    if(error){
                        console.log(error);
                    } else {
                        newUser.password = hash;
                        newUser.save().then((user) => {
                            res.status(200).json(user);
                        });
                    }
                })

            }
        })
    }
});

router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
    if(!isValid) {
        res.status(400).json(errors);
    } else {
        User.findOne({
            email: req.body.email
        }).then((user) => {
            if(!user){
                errors.email = 'Email not found'
                return res.json(errors);
               
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(isMatch => {
                        if(isMatch) {
                            const payload = {
                                id: user.id,
                                name: user.name,
                                password: user.password
                            }
                            jwt.sign(payload, 'secret', {
                                expiresIn: 3600
                            }, (err, token) => {
                                if(err) console.log(err);
                                else {
                                    console.log(token);
                                    console.log('login');
                                    res.json({
                                        success: true,
                                        token: `Bearer ${token}`
                                    })
                                }
                            })
                        }
                    })
            }
        })
    }
})

module.exports = router;