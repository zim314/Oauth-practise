import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import session from 'express-session';

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: false,
    cookie: { secure: false },
}));

mongoose
    .connect('mongodb://127.0.0.1:27017/OauthPractise')
    .then(() => console.log('以連接到MongoDB'));

app.use('/auth', authRoutes);

app.get('/', (req, res) => res.render('index'));

app.listen(3535, () => console.log('正在聆聽伺服器 port: 3535'));