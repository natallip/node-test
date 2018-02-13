const router = require('express').Router();

router.get('/', (req, res) => {
  let data = {
    title: 'Main page',
    content: 'Hello from main page'
  };
  res.render('index', data);
});
router.get('/about', (req, res) => {
  res.render('about', {title: 'About'});
});
router.get('/contact-me', (req, res) => {
  res.render('contact-me', {title: 'Contact me'});
});
module.exports = router;
