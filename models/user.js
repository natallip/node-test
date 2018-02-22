const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Имя пользователя отсутствует']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'E-mail пользователя не должен быть пустым'],
    // validate: [{
    //   validator: function checkEmail (value) {
    //     return this.deleted ? true : /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test();
    //   },
    //   msg: 'Укажите, пожалуйста, корректный email'
    // }]
  },
  password: {
    type: String
  },
  name: {
    type: String
  }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.getUserByUsername = (username, callback) => {
  let query = {username: username};
  User.findOne(query, callback);
};

module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};
