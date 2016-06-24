const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const sass = require('node-sass');
const colors = require('colors');
const package = require('./package.json')
var cleancss = require('clean-css');

let config;

try {
  config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
} catch (e) {
  console.log(e);
}

fs.watchFile('config.yml', (curr, prev) => {
  config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
})

let theme = config.theme;
let root = config.path;
let modules = config.modules;
let outs = config.out;

let styleExtname = '.scss';
let styleSource;
let styleCompile;
let styleMin;

let scriptExtname = '.js';
let scriptSource;
let scriptCompile;
let scriptMin;

// 获取 js 或 css 路径
let paths = (filter, pathsArray = outs) => {
  if (Array.isArray(pathsArray)) {
    let _paths;
    switch (filter) {
      case '.min.css':
      case '.min.js':
        _paths = outs.filter(function(val) {
          return val.substr(-filter.length, filter.length) === filter
        })
        break;
      case '.css':
      case '.js':
        _paths = outs.filter(function(val) {
          return val.substr(-filter.length, filter.length) === filter
        });
        _paths = _paths.filter(function(val) {
          return val.substr(-`.min${filter}`.length, `.min${filter}`.length) !== `.min${filter}`
        });
        break;
    }
    return _paths;

  }
}

let css = (event = '', filename = '') => {

  styleSource = (() => {
    let _styleSource;
    // 载入主题
    if (theme) {
      try {
        _styleSource = fs.readFileSync(path.join(root, 'theme', theme + styleExtname), 'utf8');
      } catch (err) {
        console.log(Error(err))
      }
    } else {
      console.error('失败：CSS 主题没有设置');
      return;
    }
    // 处理模块
    if (Array.isArray(modules)) {
      for (let module of modules) {
        let modulePath = path.join(root, module, module + styleExtname);
        try {
          _styleSource += '\n' + fs.readFileSync(modulePath, 'utf8');
        } catch (err) {
          console.log(Error(err))
        }
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
        includePaths: modules.map(function(val) {
          return path.join(root, val)
        })
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
    let _styleCompilePaths = paths('.css');
    let _styleMinPaths = paths('.min.css');

    if (Array.isArray(_styleCompilePaths)) {
      for (let _styleCompilePath of _styleCompilePaths) {
        try {
          fs.writeFileSync(_styleCompilePath, styleCompile, 'utf8');
        } catch (err) {
          console.log(Error(err))
        }
      }
    } else {
      console.error('失败：CSS 输出目录没有设置，请配置 out');
      return;
    }

    if (Array.isArray(_styleMinPaths)) {
      for (let _styleMinPath of _styleMinPaths) {
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
      console.log(" ✓".green, `${filename} `.grey, event.grey, new Date().toLocaleTimeString().grey)
    }
  })()

}

let watch = () => {
  for (let module of modules) {
    try {
      fs.watch(path.join(root, module), function(event, filename) {
        css(event, filename);
      })
    }catch(err){
      console.log(Error(err))
    }

  }
}

let log = () => {
  process.stdout.write("\u001B[2J\u001B[0;0f")
  console.log("========================================================================")
  console.log(` UICSS v${package.version}`, "- 简单 (但是强壮) 的前端 UiKit".grey)
  console.log(" https://github.com/majunbao/uicss".grey)
  console.log("========================================================================")
  console.log(" ");
  console.log(` ▣ MODULES`.toUpperCase())
  for (let module of modules) {
    console.log(" ✓".green, module.replace(module.charAt(0), module.charAt(0).toUpperCase()).grey)
  };
  console.log(' ');
  console.log(` ▣ OUTS`)
  for (let out of outs) {
    console.log(" ✓".green, out.grey)
  };
  console.log(' ')
}


log()
css()
watch()


// 配置变化时 重新配置上下文
fs.watch('config.yml', (evnet, filename) => {
  config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));

  theme = config.theme;
  root = config.path;
  modules = config.modules;
  outs = config.out;

  log()
  css()
})
