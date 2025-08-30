const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'))
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    res.render('index');
})

const loginRouter = require('./routes/login');
app.use('/login', loginRouter);

const registerRouter = require('./routes/register');
app.use('/register', registerRouter)

const aboutRouter = require('./routes/about');
app.use('/about', aboutRouter);

const learnRouter = require('./routes/learn');
app.use('/learn', learnRouter);

const playRouter = require('./routes/play');
app.use('/play', playRouter);


app.listen(PORT)
