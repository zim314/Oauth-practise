import express from 'express';
import passport from 'passport';
import { Strategy as googleStrategy }  from 'passport-google-oauth20';
import user from '../models/user.js';

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (_id, done) => {
    const foundUser = await user.findOne({ _id });
    done(null, foundUser);
})

passport.use(
    new googleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/redirect',
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const verifyUser = await user.findOne({ googleID: profile.id }).exec();
            if(verifyUser) {
                done(null, verifyUser);
            } else {
                const newUser = new user({
                    email: profile.emails[0].valuse,
                    name: profile.name.familyName +  profile.name.givenName,
                    googleID: profile.id,
                    thumbnail: profile.photos[0].value,
                });
                newUser.save();
                done(null, newUser);
            }
        } catch { () => console.log('google passport 錯誤') };
    })
);

const router = express.Router();

router.get('/login', (req, res) => res.render('login'));

router.get('/logout', (req, res) => req.logOut(() => res.redirect('/')));

router.get('/google', passport.authenticate('google', 
    {
        //可以選擇登入帳號
        prompt: 'select_account',
        scope: ['profile', 'email'],     
    }
));

router.use(
    '/google/redirect', 
    passport.authenticate('google'), 
    (req, res) => {
        res.redirect('/profile');
    } 
);

export default router;