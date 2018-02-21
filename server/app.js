const express = require('express');
const app = express();
const config = require('../config');
const path = require('path');
const bodyParser = require('body-parser');
const port = 8080;
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb)
  .then(() => console.log('MongoDB has started'))
  .catch(e => console.log(e));

app.set('views', path.join(__dirname, '..', 'public_html/views'));
// Приложения Express для определения визуального интерфейса использует не стандартные файлы html,
// а специальные сущности - представления, из которых затем создаются html-файлы
// Управляет представлениями специальный компонент - движок представлений (view engine)
app.set('view engine', 'html');
// для использования расширения .html для шаблона
app.engine('html', require('hbs').__express);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// express.static() указывает на каталог со статическими файлами
// Чтобы встроить компонент express.static в процесс обработки запроса, вызывается функция app.use().
// Эта функция позволяет добавлять различные компоненты, которые еще называются middleware, в конвейер обработки запроса:
// а точнее assets
app.use(express.static(path.join(__dirname, '..', 'public_html/assets')));

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
    let namespace = param.split('.');
    let root = namespace.shift();
    let formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// app.use(router);
app.use('/', require('./routes/index'));
app.use('/about', require('./routes/about'));
app.use('/contact-me', require('./routes/contact-me'));
app.use('/my-photos', require('./routes/photo'));
app.use('/login', require('./routes/login'));
app.use('/profile', require('./routes/profile'));
app.use('/register', require('./routes/register'));

// Функция, которая передается в app.use(), принимает три параметра:
// request: данные запроса
// response: объект для управления ответом
// next: следующая в конвейере обработки функция
app.use((req, res, next) => {
  res
    .status(404)
    .send('404 Page not found!');
});

app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .send(err.message || '500 Server error');
});
app.listen(port, () => {
  console.log('We are live on ' + port);
});
