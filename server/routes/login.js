const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/user');

router.get('/', (req, res) => {
  res.render('login', { title: 'Login' });
});

passport.use(new LocalStrategy(
  (username, password, done) => {
    User.getUserByUsername(username, (err, user) => {
      if (err) throw err;
      if (!user) {
        return done(null, false, {message: 'Unknown User'});
      }

      User.comparePassword(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {message: 'Invalid password'});
        }
      });
    });
  }));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user);
  });
});

router.post('/',
  passport.authenticate('local', {successRedirect: '/profile', failureRedirect: '/', failureFlash: true}),
  (req, res) => {
    res.redirect('/profile');
  });

router.get('/profile', (req, res) => {
  res.render('profile', { title: 'Profile' });
});

module.exports = router;
