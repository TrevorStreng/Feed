const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRouter = require('./routes/userRoutes');
const tweetRouter = require('./routes/tweetRoutes');

const app = express();

app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRouter);
app.use('/api/tweets', tweetRouter);

module.exports = app;
