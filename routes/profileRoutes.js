import express from 'express';

const router = express.Router();
const authCheck = (req, res, next) => {
    req.isAuthenticated()? next() : res.redirect('/auth/login');
};

router.get('/', authCheck, (req, res) => res.render('profile', { user: req.user }));

export default router;