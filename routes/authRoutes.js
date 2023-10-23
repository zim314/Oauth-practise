import 'dotenv/config';
import express from 'express';
import passport from 'passport';
import googleStrategy from 'passport-google-oauth20';

passport.use(
    new googleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/redirect',
    }, (accessToken, refreshToken, profile, done) => {})
)

const router = express.Router();

router.get('/login', (req, res) => res.render('login'));

router.get('/google', passport.authenticate('google', 
    {
        //可以選擇登入帳號
        prompt: 'select_account',
        //要請求的資源
        scope: ['profile', 'email'],     
    }
));

export default router;