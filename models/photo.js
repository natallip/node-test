const mongoose = require('mongoose');
const PhotoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Укажите название']
  },
  photo: {
    type: String
  }
});
// просим mongoose сохранить модель для ее дальнейшего использования
module.exports = mongoose.model('Photo', PhotoSchema);
