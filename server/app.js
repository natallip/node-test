const express = require('express');
const app = express();
// создаем объект приложения
// const hbs = require('hbs');
const router = require('./routes');
const path = require('path');
const port = 8080;
// const MongoClient = require('mongodb').MongoClient;
// let db;
// подключаем модули
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/node-test')
  .then(() => console.log('MongoDB has started'))
  .catch(e => console.log(e));

// подключаем модели(сущности, описывающие коллекции базы данных)
require('../models/mail');

app.set('views', path.join(__dirname, '..', 'public_html/views'));
// Приложения Express для определения визуального интерфейса использует не стандартные файлы html,
// а специальные сущности - представления, из которых затем создаются html-файлы
// Управляет представлениями специальный компонент - движок представлений (view engine)
app.set('view engine', 'html'); // для использования расширения .html для шаблона
app.engine('html', require('hbs').__express);
// express.static() указывает на каталог со статическими файлами
// Чтобы встроить компонент express.static в процесс обработки запроса, вызывается функция app.use().
// Эта функция позволяет добавлять различные компоненты, которые еще называются middleware, в конвейер обработки запроса:
app.use(express.static(path.join(__dirname, '..', 'public_html/assets')));

app.use(router);
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
//
// MongoClient.connect('mongodb://localhost:27017/node-test', (err, database) => {
//   if (err) return console.log(err);
//   db = database;
//   // require('../models/mail');
//   app.listen(port, () => {
//     console.log('We are live on ' + port);
//   });
// });
