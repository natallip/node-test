const express = require('express');
const router = express.Router();

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/login');
  }
}

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('profile', { title: 'Profile' });
});

module.exports = router;
