import express from 'express';
import config from './conf/conf.json';
import passport from 'passport';
import User from '../model/User.model';
import confJwt from '../routes/conf/confJwt';

const router = express.Router();

router.post('/signup', function (req, res) {
    if (!req.body.email || !req.body.password) {
        res.status(404).json(config.http.error.user.mail_exist);
    } else {
        var newUser = new User({
            email: req.body.email,
            password: req.body.password
        });
        // Attempt to save the user
        newUser.save(function (err) {
            if (err) {
                return res.status(404).json(config.http.error.user.mail_exist);
            }
            res.json(config.http.valid.user.user_created);
        });
    }
});
router.post('/login', function (req, res) {
    console.log(req.body.email);
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) throw err;
        if (!user) {
            res.status(404).json(config.http.error.user.login);
        } else {
            // Check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // Create token if the password matched and no error was thrown
                    delete user.password;
                    console.log(delete user.password);
                    var token = req.jwt.sign(user, confJwt.secretOrKey, {
                        expiresIn: 1 * 60 * 60 // in seconds
                    });
                    res.json({
                        success: true,
                        token: 'JWT ' + token
                    });
                } else {
                    res.status(404).json(config.http.error.user.password);
                }
            });
        }
    });
});
// router.use(function (req, res, next) {
//     // check header or url parameters or post parameters for token
//     var token = req.body.token || req.query.token || req.headers['authorization'];
//     console.log(token);
//     if (token) {
//         // verifies secret and checks exp
//         req.jwt.verify(token, confJwt.secretOrKey, function (err, decoded) {
//             if (err) {
//                 console.log("DANS VERIFY", err);
//                 return res.json({
//                     success: false,
//                     message: 'Failed to authenticate token.'
//                 });
//             } else {
//                 // if everything is good, save to request for use in other routes
//                 req.decoded = decoded;
//                 next();
//             }
//         });
//     } else {
//         return res.status(403).send({
//             success: false,
//             message: 'No token provided.'
//         });
//     }
// });

router.get('/dashboard', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    res.json(req.user);
});


export default router;