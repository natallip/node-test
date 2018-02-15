const express = require('express');
const router = require('express').Router();
// Класс express.Router позволяет определить маршрут, в рамках которого можно создавать подмаршруты, которые связаны со своими обработчиками.
const bodyParser = require('body-parser');
// создаем парсер для данных application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({ extended: false });
// Поскольку данные отправляются с помощью формы, то для создания парсера применяется функция urlencoded().
// В эту функцию передается объект, устанавливающий параметры парсинга.
// Значение extended: false указывает, что объект - результат парсинга будет представлять набор пар ключ-значение, а каждое значение может быть представлено в виде строки или массива.

router.get('/', (req, res) => {  // определяем обработчик для маршрута "/"
  let data = {
    title: 'Main page',
    content: 'Hello from main page'
  };
  res.render('index', data);   // отправляем ответ
});
router.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});
router.get('/contact-me', (req, res) => {
  res.render('contact-me', { title: 'Contact me' });
});
router.get('/send-mail', (req, res) => {
  res.render('send-mail', { title: 'Contact me' });
});

// Первый параметр функции - адрес, на который идет отправка - "/contact-me".
// Второй параметр - выше созданный парсер.
// Третий параметр - обработчик
router.post('/contact-me', urlencodedParser, (req, res) => {
  const nodemailer = require('nodemailer');
  const config = require('../../config.json');
  console.log(111, req.body, config.mail.subject);
  if (!req.body.email || !req.body.subject || !req.body.message) { //требуем наличия имени, обратной почты и текста
    //если что-либо не указано - сообщаем об этом
    res.render('contact-me', { error: 'Specify the data' });
    return res.status(400);
  }
  //инициализируем модуль для отправки писем и указываем данные из конфига
  const transporter = nodemailer.createTransport(config.mail.smtp);
  const mailOptions = {
    from: `"${req.body.subject}" <${req.body.email}>`,
    to: config.mail.smtp.auth.user,
    subject: config.mail.subject,
    text: req
      .body
      .message
      .trim()
      .slice(0, 500) + `\n Отправлено с: <${req.body.email}>`
  };
  //отправляем почту
  transporter.sendMail(mailOptions, (error, info) => {
    console.log(info);
    let msg = {
      success: 'successfully sent',
      error: 'not send'
    };
    //если есть ошибки при отправке - сообщаем об этом
    if (error) {
      console.log(error);
      res.status(400);
      res.render('contact-me', { error: msg.error, title: 'Contact me' });
    }
    res.render('contact-me', { success: msg.success, title: 'Contact me' });
  });
});

module.exports = router;
