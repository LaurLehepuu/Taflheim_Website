const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session') 
const winston = require('winston')

const initializePassport = require('./config/passport_config')
initializePassport(passport)

//Create winston logger
const winston_config = require('./config/winston_config')
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: basic_logger_transports
});

//#region Settings 
app.set('views', __dirname + '/views');
app.use(express.static('public'))
app.set('view engine', 'ejs');
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized: false,
}))

app.use(passport.initialize())
app.use(passport.session())
//#endregion

//#region Routes
app.get('/', (req, res) => {
    res.render('index');
})

const loginRouter = require('./routes/login');
app.use('/login', loginRouter);

const registerRouter = require('./routes/register');
app.use('/register', registerRouter)

const logoutRouter = require('./routes/logout');
app.use('/logout', logoutRouter)
 
const aboutRouter = require('./routes/about');
app.use('/about', aboutRouter);

const learnRouter = require('./routes/learn');
app.use('/learn', learnRouter);

const playRouter = require('./routes/play');
app.use('/play', playRouter);
//#endregion

app.listen(PORT)
