const fs = require('fs');
const path = require('path');
const sass = require('node-sass');
const yaml = require('js-yaml');
const package = require('./package.json')
const colors = require('colors');
var cleancss = require('clean-css');

let config;

try {
  config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
} catch (e) {
  console.log(e);
}

let theme;
let root;
let modules;
let outs;


let styleExtname = '.scss';
let styleSource;
let styleCompile;
let styleMin;

let scriptExtname = '.js';
let scriptSource;
let scriptCompile;
let scriptMin;

let dirs = [];
let files = [];

function column(data, colsnum=4) {
  let result = [];
  let cols = colsnum; //列
  let rows = Math.ceil(data.length / cols); //行
  let padding = '    ';

  let getCols = (() => {
    let _result = [];
    for (let i = 0; i < cols; i++) {
      _result[i] = []
      for (let x = 0; x < rows; x++) {
        _result[i][x] = data[i + cols * x];
      }
    }
    return _result;
  })()


  for (let _row of getCols) {
    let cellWidth = 0;
    let cellAfter = [];

    _row.forEach(function(cell) {
      if (cell) {
        cellWidth = cell.length > cellWidth ? cell.length : cellWidth
      }

    })

    cellAfter = _row.map(function(val) {

      let white = '';
      if (val) {
        for (let i = 0; i < cellWidth - val.length; i++) {
          white += ' ';
        }
        return val + white + padding;
      } else {

      }

    })

    result.push(cellAfter);
  }


  {
    let _result = []

    for (let i = 0; i < rows; i++) {
      _result[i] = [];
      for (let x = 0; x < result.length; x++) {
        _result[i][x] = result[x][i]
      }
    }

    result = _result;
  }

  return result;
}

let init = () => {
  theme = config.theme;
  root = config.path;
  modules = config.modules || [];
  outs = config.out || [];
}
init()

// 迭代模块目录 => dirs; => files;
let paths = (dir = root) => {
  let _paths = fs.readdirSync(dir);
  for (let _path of _paths) {
    let stats = fs.statSync(path.join(dir, _path));
    if (stats.isDirectory()) {
      paths(path.join(dir, _path))
      dirs.push(path.join(dir, _path))
    } else if (stats.isFile) {
      files.push(path.join(dir, _path))
    }
  };
}
paths();

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
    }
    return _targes;

  }
}

let css = (event = '', filename = '') => {
  styleSource = (() => {
    let _styleSource = '';
    // 载入主题
    if (theme) {
      _styleSource += `@import 'theme/${theme}';\n`
    } else {
      console.error('失败：CSS 主题没有设置');
      return;
    }
    // 处理模块
    if (Array.isArray(modules)) {
      for (let module of modules) {
        _styleSource += `@import '${module}/${module}';\n`
      }
    } else {
      console.error('失败：CSS 模块没有设置');
      return;
    }
    return _styleSource;
  })();

  styleCompile = (() => {
    // 编译scss
    let _styleCompile;
    try {
      _styleCompile = sass.renderSync({
        data: styleSource,
        outputStyle: 'expanded',
        includePaths: ['./modules/']
      }).css.toString();
    } catch (err) {
      console.log(Error(err))
    }
    return _styleCompile;
  })();

  styleMin = (() => {
    let _styleMin;
    try {
      _styleMin = new cleancss({
        compatibility: 'ie7',
        root: './',
        rebase: false
      }).minify(styleCompile).styles;
    } catch (err) {
      console.log(Error(err))
    }
    return _styleMin;
  })();

  (() => {
    // 写入文件
    let _styleCompileTarges = targes('.css');
    let _styleMinTarges = targes('.min.css');

    if (Array.isArray(_styleCompileTarges)) {
      for (let _styleCompileTarge of _styleCompileTarges) {
        try {
          fs.writeFileSync(_styleCompileTarge, styleCompile, 'utf8');
        } catch (err) {
          console.log(Error(err))
        }
      }
    } else {
      console.error('失败：CSS 输出目录没有设置，请配置 out');
      return;
    }

    if (Array.isArray(_styleMinTarges)) {
      for (let _styleMinPath of _styleMinTarges) {
        try {
          fs.writeFileSync(_styleMinPath, styleMin, 'utf8');
        } catch (err) {
          console.log(Error(err))
        }
      }
    } else {
      console.error('失败：CSS 输出目录没有设置，请配置 out');
      return;
    }
  })();

  (() => {
    // 打印日志
    if (event && filename) {
      console.log(" ▣".green, `${filename} ${event}`, new Date().toLocaleTimeString());
      for (let out of outs) {
        console.log(" ✓".green, out.grey)
      };
      console.log(" ");
    }
  })()
}

let watch = () => {
  for (let dir of dirs) {
    try {
      fs.watch(path.join(dir), function(event, filename) {
        css(event, filename);
      })
    } catch (err) {
      console.log(Error(err))
    }

  }
}

let log = () => {
  process.stdout.write("\u001B[2J\u001B[0;0f");
  let logs = '';
  logs += "========================================================================" + '\n'
  logs += ` UICSS v${package.version}` + "- 简单 (但是强壮) 的前端 UiKit".grey + '\n'
  logs += " https://github.com/majunbao/uicss".grey + '\n'
  logs += "========================================================================" + '\n'
  logs += " " + '\n'
  logs += ` ▣ MODULES`.toUpperCase() + '\n'

  for (let module of column(modules)) {

    logs += module.map(function(val) {
      if(val) {
        return " ✓".green + ' ' + val.grey;
      }
    }).join('');

    logs += '\n'
  };
  logs += '\n';
  logs += ` ▣ OUTS` + '\n'
  for (let out of column(outs,3)) {
    logs += out.map(function(val) {
      if(val){
        return " ✓".green + ' ' + val.grey;  
      }
      
    }).join('');

    logs += '\n'
  };
  console.log(logs)
}


log()
css()
watch()


// 配置变化时 重新配置上下文
fs.watch('config.yml', (evnet, filename) => {
  config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));

  init()
  log()
  css()
})
