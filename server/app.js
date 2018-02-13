const express = require('express');
const app = express();
const hbs = require('hbs');
const router = require('./router');
const path = require('path');
const port = 8000;

app.set('views', path.join(__dirname, '..', 'public_html/views'));
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
hbs.registerPartials(__dirname + '../public_html/views');

app.use(express.static(path.join(__dirname, '..', 'public_html/assets')));
app.use(router);

app.use((req, res, next) => {
  res
    .status(404)
    .send('404 Page not found!');
});
app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .send(err.message || '500 Server error');
});

app.listen(port, () => {
  console.log('We are live on ' + port);
});