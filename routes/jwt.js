import express from 'express';
import config from './conf/conf';
import passport from 'passport';
import User from '../model/User.model';
import confJwt from '../routes/conf/confJwt';
import RateLimit from 'express-rate-limit';
const router = express.Router();

router.post('/signup', (req, res) => {
    //Cette API n'est pas disponible en mode production
    if (process.env.NODE_ENV === config.launch.env.prod) return res.status(404).json(config.http.error.global_404);
    if (!req.body.email || !req.body.password) return res.status(404).json(config.http.error.user.mail_exist);
    var newUser = new User({
        email: req.body.email.toLowerCase(),
        password: req.body.password
    });
    // Attempt to save the user
    newUser.save((err) => {
        if (err) return res.status(404).json(config.http.error.user.mail_exist);
        return res.json(config.http.valid.user.user_created);
    });
});
router.post('/logout', (req, res) => {
    if (!req.body.email || !req.body.password) return res.status(404).json(config.http.error.user.mail_exist);
    var newUser = new User({
        email: req.body.email.toLowerCase(),
        password: req.body.password
    });
    // Attempt to save the user
    newUser.save((err) => {
        if (err) return res.status(404).json(config.http.error.user.mail_exist);
        return res.json(config.http.valid.user.user_created);
    });
});
router.post('/login', new RateLimit(config.http.limit_request.login), (req, res) => {
    User.findOne({
        email: req.body.email.toLowerCase()
    }, (err, user) => {
        if (err) return res.status(404).json(config.http.error.user.login_password);
        if (!user) return res.status(404).json(config.http.error.user.login_password);
        // Check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (!isMatch || err) return res.status(404).json(config.http.error.user.login_password);
            // Create token if the password matched and no error was thrown
            delete user.password;
            var token = req.jwt.sign(user, confJwt.secretOrKey, {
                expiresIn: 4 * 3600 * 24 // in seconds
            });
            return res.json({
                success: true,
                token: 'JWT ' + token
            });
        });
    });
});
export default router;