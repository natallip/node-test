const express = require('express');
const router = express.Router();
const User = require('../../models/user');

router.get('/', (req, res) => {
  res.render('register', { title: 'Register' });
});

router.post('/', (req, res) => {
  const { name, username, email, password, password2 } = req.body;

  // Validation
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if (errors) {
    res.render('register', {errors, title: 'Register'});
  } else {
    let newUser = new User({
      name,
      email,
      username,
      password
    });

    User.createUser(newUser, (err, user) => {
      if (err) throw err;
      // console.log(user);
    });

    req.flash('success_msg', 'You are registered and can now login');
    res.redirect('../login');
  }
});

module.exports = router;
