const mongoose = require('mongoose');
const ItemSchema = new mongoose.Schema({
  email: {
    type: String,
    // unique: true,
    required: [true, 'Укажите ваш email']
  },
  subject: {
    type: String,
    // unique: true,
    required: [true, 'Укажите ваше имя']
  },
  message: {
    type: String,
    // unique: true,
    required: [true, 'Напишите сообщение']
  }
});
// просим mongoose сохранить модель для ее дальнейшего использования
let ItemModel = mongoose.model('Item', ItemSchema);

module.exports = ItemModel;
