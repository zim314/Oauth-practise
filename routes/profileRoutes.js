import express from 'express';
import Post from '../models/post.js';

const router = express.Router();
const authCheck = (req, res, next) => {
    req.isAuthenticated()? next() : res.redirect('/auth/login');
};

router.get('/', authCheck, async (req, res) => {
    try {
        const postFound = await Post.find({ author: req.user._id });
        res.render('profile', { user: req.user, posts: postFound });
    } catch {() => console.log('profile router 錯誤')};
});

router.get('/post', authCheck, (req, res) => res.render('post', { user: req.user }));

router.post('/post', authCheck, async (req, res) => {
    try {
        const { title, content } = req.body;
        const newPost = new Post({ title, content, author: req.user._id });
        newPost.save();
        res.redirect('/profile');
    } catch (error) {
        req.flash('error_message', '標題與內容皆不可為空白');
        res.redirect('/profile/post');
    };
})

export default router;