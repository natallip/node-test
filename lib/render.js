const fs = require('fs');
const path = require('path');

function render(templateName, data, done) {
  fs.readFile(path.resolve('views', templateName), 'utf-8', (error, template) => {
    if (error) return done(error);
    if (!data) return template;
    const html = template.replace(/{{([^{}]*)}}/g, (placeholder, property) => {
      const math = data[property];
      return match || placeholder;
    });
  });
}
module.exports = render;