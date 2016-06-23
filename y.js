const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
var sass = require('node-sass');

let config;

try {
  config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
} catch (e) {
  console.log(e);
}

const theme = config.theme;
const root = config.path;
const modules = config.modules;
const out = config.out;

let styleExtname = '.scss'
  , styleSource
  , styleCompile
  , styleMin;
let scriptExtname = '.js'
  , scriptSource
  , scriptCompile
  , scriptMin

// 获取 js 或 css 路径
let paths = (extname) => {
  if (Array.isArray(out)) {
    return out.filter(function(val) {
      return path.extname(val) === extname;
    });
  }
}

let css = () => {
  // 载入主题
  if (theme) {
    styleSource = fs.readFileSync(path.join(root, 'theme', theme + styleExtname), 'utf8');
  } else {
    console.error('失败：CSS 主题没有设置');
  }

  // 处理模块
  if (Array.isArray(modules)) {
    for (let module of modules) {
      let modulePath = path.join(root, module, module + styleExtname);
      fs.readFile(modulePath, 'utf8', function(err, data){
        if(!err){
          styleSource += data;
            console.log(styleSource)
        }
      })
    }
  }else{
    console.error('失败：CSS 模块没有设置');
  }


  
  // 编译scss
  styleCompile = sass.renderSync({
    data: styleSource,
    outputStyle: 'expanded'
  }).css.toString();

  // 写入文件
  let cssPaths = paths('.css');
  if(Array.isArray(cssPaths)){
    for(let cssPath of cssPaths){
      fs.writeFileSync(cssPath, styleCompile, 'utf8')
    }
  }else{
    console.error('失败：CSS 输出目录没有设置');
  }
}
css()

