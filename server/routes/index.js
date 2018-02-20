const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // определяем обработчик для маршрута "/"
  let data = {
    title: 'Main page',
    content: 'Hello from main page'
  };
  res.render('index', data);
  // отправляем ответ
});

module.exports = router;
