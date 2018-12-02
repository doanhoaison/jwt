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
    const { errors, isValid } = validateRegisterInput(req.body);
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
        });

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
                return res.status(400).json(errors);
            } else {
                console.log(user);
                bcrypt.compare(req.body.password, user.password)
                    .then(isMatch => {
                        if(isMatch) {
                            const payload = {
                                id: user.id,
                                name: user.name,
                                avatar: user.avatar
                            }
                            jwt.sign(payload, 'secret', {
                                expiresIn: 3600
                            }, (err, token) => {
                                if(err) console.log(err);
                                else {
                                console.log(token);

                                    res.status(200).json({
                                        success: true,
                                        token: `Bearer ${token}`
                                    })
                                }
                            })
                        } else {
                            errors.password = 'Incorrect Password';
                            return res.status(400).json(errors);
                        }
                    })
            }
        })
    }
})

router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    })
})
module.exports = router;