import express from 'express';
import passport from 'passport';
import { Strategy as googleStrategy }  from 'passport-google-oauth20';
import localStrategy from 'passport-local';
import User from '../models/user.js';
import bcrypt from 'bcrypt';

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (_id, done) => {
    const foundUser = await User.findOne({ _id });
    done(null, foundUser);
})

passport.use(
    new googleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/redirect',
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const verifyUser = await User.findOne({ googleID: profile.id }).exec();
            if(verifyUser) {
                done(null, verifyUser);
            } else {
                const newUser = new User({
                    email: profile.emails[0].valuse,
                    name: profile.name.familyName +  profile.name.givenName,
                    googleID: profile.id,
                    thumbnail: profile.photos[0].value,
                });
                newUser.save();
                done(null, newUser);
            }
        } catch {() => console.log('google passport 錯誤')};
    })
);

passport.use(new localStrategy(
    async (username, password, done) => {
        try {
            const foundUser = await User.findOne({ email: username }).exec();
            if(!foundUser) return done(null, false);
            const verifyPassword = await bcrypt.compare(password, foundUser.password);
            if(!verifyPassword) return done(null, false);
            done(null, foundUser);
        } catch {() => console.log('local passport 錯誤')}
    }
));

const router = express.Router();

router.get('/login', (req, res) => res.render('login', { user: req.user }));

router.get('/logout', (req, res) => req.logOut(() => res.redirect('/')));

router.get('/signup', (req, res) => res.render('signup', { user: req.user }));

router.post('/signup', async (req, res) => {
    try {
        const { name, password, email } = req.body;
        const verifyEmail = await User.findOne({ email }).exec();

        if(verifyEmail) {
            req.flash('error_message', '此信箱已被註冊，請使用其他信箱');
            res.redirect('/auth/signup');
        } 
        if(password.length < 8) {
            req.flash('error_message', '密碼過短，請輸入8~12位的英文或數字');
            res.redirect('/auth/signup');
        } 
        if(password.length > 12) {
            req.flash('error_message', '密碼過長，請輸入8~12位的英文或數字');
            res.redirect('/auth/signup');
        }
        
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ name, password: hashPassword, email });
        newUser.save();
        req.flash('success_message', '恭喜註冊成功，登入後即可開始使用POST系統！');
        res.redirect('/auth/login');
    } catch {() => console.log('註冊錯誤')} 
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login',
    failureFlash: '登入失敗，帳號或密碼不正確',
}), (_, res) => res.redirect('/profile'));

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
    (_, res) => res.redirect('/profile')
);

export default router;