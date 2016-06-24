var fs = require('fs');
var cleancss = require('clean-css');
var minified = new cleancss({
  compatibility: 'ie7',
  root:'./',
  rebase: false
}).minify(['dajisu/css/ui.css','dajisu/css/app.css']).styles;


fs.writeFileSync('dajisu/css/all.min.css',minified)