const fs = require('fs');
const path = require('path');
const sass = require('node-sass');
const yaml = require('js-yaml');
const package = require('./package.json')
const colors = require('colors');
const cleancss = require('clean-css');
const rollup = require('rollup');
const uglifyjs = require('uglify-js');

let config;

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

let modulesStyles = [];
let modulesScripts = [];

function column(data, colsnum = 4) {
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

let init = () => {
  try {
    config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
  } catch (e) {
    console.log(e);
  }
  theme = config.theme;
  root = config.path;
  modules = config.modules || [];
  outs = config.out || [];
  paths();
  modulesStyles = modules.filter(function(val) {
    return files.includes(`${root}/${val}/${val}${styleExtname}`);
  });
  modulesScripts = modules.filter(function(val) {
    return files.includes(`${root}/${val}/${val}${scriptExtname}`);
  });
}
init()

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
  styleSource = () => {
    let _styleSource = '';
    // 载入主题
    if (theme) {
      _styleSource += `@import 'theme/${theme}';\n`
    } else {
      console.error('失败：CSS 主题没有设置');
      return;
    }
    // 处理模块
    if (Array.isArray(modulesStyles)) {
      for (let modulesStyle of modulesStyles) {
        _styleSource += `@import '${modulesStyle}/${modulesStyle}';\n`
      }
    } else {
      console.error('失败：CSS 模块没有设置');
      return;
    }
    styleSource = _styleSource;
  }


  styleCompile = () => {
    // 编译scss
    let _styleCompile;
    try {
      _styleCompile = sass.renderSync({
        data: styleSource,
        outputStyle: 'expanded',
        includePaths: [`${root}`]
      }).css.toString();
    } catch (err) {
      console.log(Error(err))
    }
    styleCompile = _styleCompile;
  }

  styleMin = () => {
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
    styleMin = _styleMin;
  }

  styleSource();
  styleCompile();
  styleMin();

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
      for (let out of targes('.css')) {
        console.log(" ✓".green, out.grey)
      };
      for (let out of targes('.min.css')) {
        console.log(" ✓".green, out.grey)
      };
      console.log(" ");
    }
  })()
}

let js = (event = '', filename = '') => {
  scriptSource = (() => {
    let _scriptSource = '';
    // 处理模块
    if (Array.isArray(modulesScripts)) {
      for (let modulesScript of modulesScripts) {
        _scriptSource += `import ${modulesScript} from '${root}/${modulesScript}/${modulesScript}';\n`
      }
    } else {
      console.error('失败：CSS 模块没有设置');
      return;
    }
    return _scriptSource;
  })();

  scriptCompile = (() => {
    // 编译scss
    let _scriptCompile;
    try {
      rollup.rollup({
        entry: 'scriptSource',
        plugins: [
          require('rollup-plugin-memory')({
            contents: scriptSource
          }),
          require('rollup-plugin-includePaths')({}),
          require('rollup-plugin-eslint')({
            parserOptions: {
              sourceType: 'module'
            }
          })
        ]
      }).then(function(bundle) {
        _scriptCompile = bundle.generate({
          format: 'iife',
          moduleName: 'ui'
        });
      }).then(function(a) {
        scriptCompile = _scriptCompile.code;
        scriptMin()
      }).then(function() {
        scriptOut()
      }).then(function() {
        scriptLog()
      })
    } catch (err) {
      console.log(Error(err))
    }

  })();

  scriptMin = () => {
    let _scriptMin;
    try {
      _scriptMin = uglifyjs.minify(scriptCompile, {
        fromString: true
      })

    } catch (err) {
      console.log(Error(err))
    }
    scriptMin = _scriptMin.code;
  };

  scriptOut = () => {
    // 写入文件
    let _scriptCompileTarges = targes('.js');
    let _scriptMinTarges = targes('.min.js');

    if (Array.isArray(_scriptCompileTarges)) {
      for (let _scriptCompileTarge of _scriptCompileTarges) {
        try {
          fs.writeFileSync(_scriptCompileTarge, scriptCompile, 'utf8');
        } catch (err) {
          console.log(Error(err))
        }
      }
    } else {
      console.error('失败：JS 输出目录没有设置，请配置 out');
      return;
    }

    if (Array.isArray(_scriptMinTarges)) {
      for (let _scriptMinPath of _scriptMinTarges) {
        try {
          fs.writeFileSync(_scriptMinPath, scriptMin, 'utf8');
        } catch (err) {
          console.log(Error(err))
        }
      }
    } else {
      console.error('失败：JS 输出目录没有设置，请配置 out');
      return;
    }
  }

  scriptLog = () => {
    // 打印日志
    if (event && filename) {
      console.log(" ▣".green, `${filename} ${event}`, new Date().toLocaleTimeString());
      for (let out of targes('.js')) {
        console.log(" ✓".green, out.grey)
      };
      for (let out of targes('.min.js')) {
        console.log(" ✓".green, out.grey)
      };
      console.log(" ");
    }
  }
}

let watch = () => {
  for (let dir of dirs) {
    try {
      fs.watch(path.join(dir), function(event, filename) {
        let _extname = path.extname(filename);
        if(_extname === styleExtname){
          init();
          css(event, filename);
        }else if(_extname === scriptExtname){
          init();
          js(event, filename)
        }
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
      if (val) {
        return " ✓".green + ' ' + val.grey;
      }
    }).join('');

    logs += '\n'
  };
  logs += '\n';
  logs += ` ▣ OUTS` + '\n'
  for (let out of column(outs, 3)) {
    logs += out.map(function(val) {
      if (val) {
        return " ✓".green + ' ' + val.grey;
      }

    }).join('');

    logs += '\n'
  };
  console.log(logs)
}


log()
css()
js()
watch()


// 配置变化时 重新配置上下文
fs.watch('config.yml', (evnet, filename) => {
  init()
  log()
  css()
  js()
})
