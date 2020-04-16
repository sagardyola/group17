const express = require('express');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');

const router = express.Router();

// const dbConfig = require('./../config/db.config');

const UserModel = require('./../models/user.model');
const config = require('./../config');

const map_user = require('./../helpers/user.map');
const nodemailer = require('nodemailer');

const sender = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: 'electronicscrt@gmail.com',
        pass: 'SD5536178'
    }
});

// electronicscrt@gmail.com
// SD5536178
function prepareMail(data) {
    var mailBody = {
        from: 'Smart Web Store <noreply@abcd.com>', // sender address
        to: "sagardyola@gmail.com,dyolasagar@outlook.com" + "," + data.email, // list of receivers
        subject: "Subject Password ✔", // Subject line
        text: "Hello world?", // plain text body
        html: `<p>Hello <b>${data.name},</b></p>
        <p>We noticed u are having trouble logging into your system. Please cluck the link below to reset your password.</p>
        <p><a href="${data.link}">reset password</a></p>
        <p>If you have not requestd please ignore this email.</p>
        <p>Regards</p>
        <p>Smart Support Team</p>`
    }
    return mailBody;
}




// router.get('/', function (req, res, next) {
//     // Through query
//     console.log('req query', req.query);
//     // res.json(req.query);
//     require('fs').readFile('sagar', function (err, done) {
//         if (err) {
//             return next(err);
//         }
//         res.json(done);

//     })
// });

router.post('/', function (req, res, next) {
    console.log('HERE', req.body);


    //find gives in array and findOne gives in object

    //USING callback
    // UserModel.findOne({
    //     username: req.body.username,
    //     password: req.body.password
    // }, function (err, user) {
    //     if (err) {
    //         return next(user);
    //     }
    //     if (user) {
    //         res.status(200).json(user);
    //     } else {
    //         next({
    //             msg: "Invalid login credentials"
    //         })
    //     }
    // })

    // USING promise
    // UserModel.findOne({
    //     username: req.body.username
    // }).then(function (data) {
    //     res.status(200).json(data);
    // }).catch(function (err) {
    //     next(err);
    // })


    // USING mongoose method
    UserModel.findOne({
        $or: [{
            username: req.body.username
        }, {
            email: req.body.username
        }]
    }).exec(function (err, user) {
        if (err) {
            return next(err);
        }
        if (user) {
            var isMatch = passwordHash.verify(req.body.password, user.password);
            if (isMatch) {
                var token = jwt.sign({
                    id: user._id
                }, config.jwtSecret);
                // console.log('Token', token);

                res.status(200).json({
                    user: user,
                    token: token
                });
            } else {
                next({
                    msg: 'Invalid username or Password'
                });
            }
        } else {
            next({
                msg: 'Invalid Username or password'
            });
        }
    })


    // DB operation here without mongoose

    // dbConfig.mongoClient.connect(dbConfig.conxnURL, {
    //     useUnifiedTopology: true
    // }, function (err, client) {
    //     if (err) {
    //         // console.log('DB connection failed');
    //         return next(err);
    //     }
    //     console.log('DB connected');
    //     var db = client.db(dbConfig.db_name);
    //     db.collection(dbConfig.collection_name).find({
    //         username: req.body.username,
    //         password: req.body.password
    //     }).toArray(function (err, user) {
    //         if (err) {
    //             return next(err);
    //         }
    //         res.json(user);
    //     })

    // })


});

// router.delete('/', function (req, res, next) {

// });

// router.put('/', function (req, res, next) {

// });

// router.get('/login', function (req, res, next) {
//     res.send('Login route');
// });

// router.post('/login', function (req, res, next) {

// });

// router.delete('/login', function (req, res, next) {

// });

// router.put('/login', function (req, res, next) {

// });

// router.get('/register', function (req, res, next) {
//     res.send('register route');
// });

router.post('/register', function (req, res, next) {
    // console.log('dir name', __dirname);
    console.log('Post register', req.body);


    var newUser = new UserModel({});

    var newMappedUser = map_user(newUser, req.body);

    console.log('New user', newUser);
    newMappedUser.password = passwordHash.generate(req.body.password);

    newMappedUser.save(function (err, done) {
        if (err) {
            return next(err);
        }
        res.status(200).json(done);
    })





    // dbConfig.mongoClient.connect(dbConfig.conxnURL, {
    //     useUnifiedTopology: true
    // }, function (err, client) {
    //     if (err) {
    //         // console.log('DB connection failed');
    //         return next(err);
    //     }
    //     console.log('DB connected');
    //     var db = client.db(dbConfig.db_name);
    //     const dbData = {
    //         name: req.body.name || req.body.firstName || req.body.fullName || 'randomName',
    //         email: req.body.email || req.body.emailAddress || 'randomEmail',
    //         ...req.body
    //     }
    //     db.collection(dbConfig.collection_name).insert(dbData, function (err, done) {
    //         // db.collection(collection_name).insert(req.body, function (err, done) {
    //         if (err) {
    //             return next(err);
    //         }
    //         res.status(200);
    //         res.json(done);
    //         // db.close();
    //     });


    // })
});

// router.delete('/register', function (req, res, next) {

// });

// router.put('/register', function (req, res, next) {

// });



router.post('/forgot-password', function (req, res, next) {
    UserModel.findOne({
            email: req.body.email
        })
        .exec(function (err, user) {
            if (err) {
                return next(err);
            }

            if (!user) {
                return next({
                    msg: "Email not registered"
                });
            }

            var mailData = {
                name: user.username,
                email: user.email,
                link: req.headers.origin + '/auth/reset/' + user._id,
            }

            var email = prepareMail(mailData);

            user.passwordResetExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2);
            // user.password = null;
            user.save(function (err, done) {
                if (err) {
                    return next(err);
                }

                sender.sendMail(email, function (err, done) {
                    if (err) {
                        return next(err);
                    }
                    res.json(done);
                })
            });
        });
})

router.post('/reset-password/:token', function (req, res, next) {
    var token = req.params.token;

    UserModel.findOne({
            _id: token,
            passwordResetExpiry: {
                $gte: Date.now()
            } //if greater accepts
        })
        .exec(function (err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next({
                    msg: 'Password reset token is invalid or expired'
                })
            }

            user.password = passwordHash.generate(req.body.password);
            user.passwordResetExpiry = null;
            user.save(function (err, done) {
                if (err) {
                    return next(err);
                }
                res.json(done);
            })
        })
})






router.get('/:id', function (req, res, next) {
    console.log('req.url parameter', req.params)

    res.json(req.params)
})



module.exports = router;