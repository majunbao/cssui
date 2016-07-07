const fs = require('fs');
const path = require('path');
const sass = require('node-sass');
const yaml = require('js-yaml');
const colors = require('colors');

let root, outs;

let scssFiles = [];

let init = () => {
  try {
    config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
  } catch (e) {
    console.log(e);
  }
  root = config.path;
  outs = config.out || [];
}

// 解析out
let targes = (filter, targesArray = outs) => {
  if (Array.isArray(targesArray)) {
    let _targes;
    switch (filter) {
      case '.min.css':
      case '.min.js':
        _targes = outs.filter(function(val) {
          return val.substr(-filter.length, filter.length) === filter
        })
        break;
      case '.css':
      case '.js':
        _targes = outs.filter(function(val) {
          return val.substr(-filter.length, filter.length) === filter
        });
        _targes = _targes.filter(function(val) {
          return val.substr(-`.min${filter}`.length, `.min${filter}`.length) !== `.min${filter}`
        });
        break;
      case '.scss':
        _targes = outs.filter(function(val) {
          return val.substr(-filter.length, filter.length) === filter
        })
        break;
    }
    return _targes;

  }
}

let scssCompite = 'a';

let scss = () => {
  let _styleScssTarges = targes('.scss');

  if (Array.isArray(_styleScssTarges)) {
    for (let _styleScssTarge of _styleScssTarges) {
      try {
        fs.writeFileSync(_styleScssTarge, scssCompite, 'utf8');
      } catch (err) {
        console.log(Error(err))
      }
    }
  } else {
    console.error('失败：CSS 输出目录没有设置，请配置 out');
    return;
  }

  for (let out of targes('.scss')) {
    console.log(" ✓".green, out.grey)
  };
}


let readFilter = function(dir, filter, callback){
  fs.stat(dir, function(err, stats){
    if(!err){
      if(stats.isFile()){
        if(path.extname(dir) === filter)
          callback(dir)
      }else if(stats.isDirectory()){
        fs.readdir(dir, function(err, files){
          if(!err){
            for(let file of files){
              readFilter(path.join(dir, file), filter, callback);
            }
          }else{
            console.log(Error(err))
          }
        })
      }
    }else{
      console.log(Error(err))
    }

  })
}

init()

let resultJs =
`
var sass = new Sass();
sass.options({
  style: Sass.style.expanded
});
`;
readFilter(root, '.scss', function(file){
  // fs.readFile(data, function(err, data){
  //   console.log(data.toString())
  // })
  fs.writeFileSync('./a.js','');
  fs.readFile(file, function(err, data){
    let result = 'sass.writeFile("'+ file +'", '+ JSON.stringify(data.toString()) +');';
    fs.appendFile('./a.js', result + '\n')
  })
})
