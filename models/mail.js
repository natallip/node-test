const mongoose = require('mongoose');
const EmailSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Укажите ваш email']
  },
  subject: {
    type: String,
    required: [true, 'Укажите ваше имя']
  },
  message: {
    type: String,
    required: [true, 'Напишите сообщение']
  }
});
// просим mongoose сохранить модель для ее дальнейшего использования
module.exports = mongoose.model('Emails', EmailSchema);
