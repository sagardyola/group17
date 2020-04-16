const router = require('express').Router();

const UserModel = require('./../models/user.model');

const map_user = require('./../helpers/user.map');

// const dbConfig = require('./../config/db.config');

// const mongodb = require('mongodb');
// const objectId = mongodb.ObjectID;


// function connect(cb) {
//     dbConfig.mongoClient.connect(dbConfig.conxnURL, {
//         useUnifiedTopology: true
//     }, function (err, client) {
//         if (err) {
//             cb(err);
//         } else {
//             const db = client.db(dbConfig.db_name);
//             cb(null, db);
//         }
//     })
// }



router.route('/')
    .get(function (req, res, next) {

        UserModel
            .find({

            })
            .sort({
                _id: -1 //descending
            })
            .limit(10)
            // .skip(1)
            .exec(function (err, users) {
                if (err) {
                    return next(err);
                }
                res.status(200).json(users);
            })



        // res.json({
        //     msg: 'From empty route'
        // })

        // connect(function (err, db) {
        //     if (err) {
        //         return next(err);
        //     }
        //     db.collection(dbConfig.collection_name).find({

        //         })
        //         .toArray(function (err, users) {
        //             if (err) {
        //                 return next(err);
        //             }
        //             res.status(200).json(users);
        //         });
        // })

    })
// .post(function (req, res, next) {

// })
// .delete(function (req, res, next) {

// })
// .put(function (req, res, next) {

// });

router.route('/:id')
    .get(function (req, res, next) {
        UserModel.findOne({
            _id: req.params.id
        }, function (err, done) {
            if (err) {
                return next(err);
            }
            res.json(done);
        })



        // res.json({
        //     msg: 'From profile route'
        // })
        // connect(function (err, db) {
        //     if (err) {
        //         return next(err);
        //     }
        //     db.collection(dbConfig.collection_name).find({
        //         _id: new objectId(req.params.id)
        //     }).toArray(function (err, user) {
        //         if (err) {
        //             return next(err);
        //         }
        //         res.status(200).json(user);
        //     })


        // })
    })

    .put(function (req, res, next) {
        // connect(function (err, db) {
        //     if (err) {
        //         return next(err);
        //     }
        //     db.collection(dbConfig.collection_name).update({
        //         _id: new objectId(req.params.id)
        //     }, {
        //         $set: req.body
        //     }, function (err, updated) {
        //         if (err) {
        //             return next(err)
        //         }
        //         res.json(updated);

        //     });
        // });

        UserModel
            .findById(req.params.id)
            .exec(function (err, user) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return next({
                        msg: 'User not found'
                    })
                }

                console.log('Logged in User is ', req.loggedInUser);
                var updatedMapUser = map_user(user, req.body);
                // updatedMapUser.updatedBy = "Sagar ";
                updatedMapUser.updatedBy = req.loggedInUser.username;


                updatedMapUser.save(function (err, done) {
                    if (err) {
                        return next(err);
                    }
                    res.json(done);
                })
            })

    })
    .delete(function (req, res, next) {

        UserModel
            .findById(req.params.id)
            .exec(function (err, user) {
                if (err) {
                    return next(err);
                }
                if (user) {
                    user.remove(function (err, done) {
                        if (err) {
                            return next(err);
                        }
                        res.json(done);
                    })
                } else {
                    next({
                        msg: 'User not found'
                    })
                }
            })
        // connect(function (err, db) {
        //     if (err) {
        //         return next(err);
        //     }
        //     db.collection(dbConfig.collection_name).remove({
        //         _id: new objectId(req.params.id)
        //     }, function (err, removed) {
        //         if (err) {
        //             return next(err)
        //         }
        //         res.json(removed);

        //     });
        // });
    });

router.route('/change-password')
    .get(function (req, res, next) {
        res.json({
            msg: 'From change password route'
        })
    })
    .post(function (req, res, next) {

    })
    .delete(function (req, res, next) {

    })
    .put(function (req, res, next) {

    });

module.exports = router;