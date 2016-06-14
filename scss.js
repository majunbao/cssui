const sass = require('node-sass');
const fs = require('fs');

module.exports  = function(){
  var css = sass.renderSync({
    file: 'module/init.scss',
    outputStyle: 'expanded'
  })
  return css.css.toString();
}
