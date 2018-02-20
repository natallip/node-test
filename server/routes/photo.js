const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const Photo = require('../../models/photo');

const uploadsDir = path.join(process.cwd(), 'public_html/assets/upload');
((dir) => {
  const exist = fs.existsSync(dir);
  if (!exist) {
    fs.mkdir(dir, err => {
      if (err) throw err;
    });
  }
})(uploadsDir);

router.get('/', (req, res, next) => {
  Photo.find()
    .then(photos => res.render('my-photos', { title: 'My photos', photos }))
    .catch(err => next(err));
});

router.post('/', (req, res, next) => {
  const form = new formidable.IncomingForm();

  form.uploadDir = uploadsDir;
  form.parse(req, (error, fields, files) => {
    if (error) {
      res.status(400);
      return res.render('my-photos', { error: 'Не удалось загрузить картинку', title: 'My photos' });
    }

    if (!fields.title || !files.photo) {
      fs.unlink(files.photo.path);
      res.status(400);
      return res.render('my-photos', { error: 'Заполните все поля', title: 'My photos' });
    }

    fs.rename(files.photo.path, path.join(uploadsDir, files.photo.name), err => {
      if (err) return next(err);

      new Photo({ title: fields.title, photo: path.join('upload', files.photo.name) })
        .save()
        .then(result => {
          Photo.find()
            .then(photos => res.render('my-photos', { title: 'My photos', success: 'Фотография успешно загружена', photos }))
            .catch(err => next(err));
        })
        .catch(error => next(error));
    });
  });
});

module.exports = router;
