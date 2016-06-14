const sass = require('node-sass');

sass.render({
  file: 'test.scss',
  outputStyle: 'expanded'
},function(err, result){
  if(err){
    console.log(err.formatted);
  }else{
    console.log(result.css.toString())
  }
})
