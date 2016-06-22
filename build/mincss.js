var fs = require('fs');
var cleancss = require('clean-css');
var test = `
a{
  display: inline-block;
  *display:inline;

  border: 1px solid #eee \9;
  box-shadow: 0 30px 30px #eee;
  transform: scale(1.15);
  -webkit-transform: scale(1.15);
}
`;

var minified = new cleancss({
  compatibility: 'ie7',
  root:'./',
  rebase: false
}).minify(['dajisu/css/ui.css','dajisu/css/app.css']).styles;


fs.writeFileSync('dajisu/css/all.min.css',minified)