const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const helmet = require('helmet');

const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;


mongoose.connect(process.env.MONGODB__URL, { useNewUrlParser:true }, () => {
    console.log('Connected to mongoDB....');
});

//middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));


app.use('/api/users',usersRouter)
app.use('/api/auth',authRouter)
app.use('/api/posts',postsRouter)




app.listen(port, () => {
    console.log('server is running on port ' + 3000);
});
