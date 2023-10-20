import express from 'express';
import mongoose from 'mongoose';

const app = express();

mongoose
    .connect('mongodb://127.0.0.1:27017/OauthPractise')
    .then(() => console.log('以連接到MongoDB'));

app.get('/', (req, res) => res.send('歡迎來到首頁'));

app.listen(3535, () => console.log('正在聆聽伺服器 port: 3535'));