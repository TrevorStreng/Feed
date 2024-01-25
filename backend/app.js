const session = require('express-session');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const userRouter = require('./routes/userRoutes');
const tweetRouter = require('./routes/tweetRoutes');

dotenv.config({ path: './.env' });

const app = express();

app.set('trust proxy', 1); // ! need to update for prod

const corsOptions = {
  // origin: 'https://feed-mocha-six.vercel.app',
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Enable credentials
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      // httpOnly: true,
      // sameSite: 'lax',
      maxAge: 3600,
      secure: false, // ! maybe update
    },
  })
);

app.use(helmet());

app.use('/api/users', userRouter);
app.use('/api/tweets', tweetRouter);

module.exports = app;
