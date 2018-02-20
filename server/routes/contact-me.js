const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const config = require('../../config');
const Email = require('../../models/mail');

router.get('/', (req, res) => {
  res.render('contact-me', { title: 'Contact me' });
});

router.post('/', (req, res) => {
  if (!req.body.email || !req.body.subject || !req.body.message) {
    // требуем наличия имени, обратной почты и текста
    // если что-либо не указано - сообщаем об этом
    res.render('contact-me', { error: 'Specify the data' });
    return res.status(400);
  }
  // инициализируем модуль для отправки писем и указываем данные из конфига
  const transporter = nodemailer.createTransport(config.mail.smtp);
  const mailOptions = {
    from: `"${req.body.subject}" <${req.body.email}>`,
    to: config.mail.smtp.auth.user,
    subject: config.mail.subject,
    text: req
      .body
      .message
  };
  // отправляем почту
  transporter.sendMail(mailOptions, (error, info) => {
    let msg = {
      success: 'successfully sent',
      error: 'not send'
    };
    // если есть ошибки при отправке - сообщаем об этом
    if (error) {
      res.status(400);
      return res.render('contact-me', { error: msg.error, title: 'Contact me' });
    }
    // создаем новую запись в базу данным и передаем в нее поля из формы
    const email = new Email({
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message
    });
    email.save()
      .then(result => res.render('contact-me', { success: msg.success, title: 'Contact me' }))
      .catch(error => next(error));
  });
});

module.exports = router;
