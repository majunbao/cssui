var fs = require('fs');
var uglifyjs = require('uglify-js')

var result = uglifyjs.minify('dajisu/js/ui.js');

fs.writeFileSync('dajisu/js/ui.min.js',result.code)

