"use strict";

const fs = require('fs');
const postcss = require('postcss');
// const rollup = require('rollup');
const includePaths = require('rollup-plugin-includePaths')
const http = require('http');
// const eslint = require('rollup-plugin-eslint');
const sass = require('node-sass');

// css文件

const source = {
  css: 'module/init.css',
  js: 'module/init.js'
}
const dist = {
  css: ['dist/ui.css','dajisu/css/ui.css'],
  js: 'dist/ui.js'
}



function buildCss(filename) {
  // 处理css程序
  sass.render({
    file: 'module/init.scss',
    outputStyle: 'expanded'
  },function(error, result){
    if (error) {
      console.log(error.formatted);
    }else{
      if(typeof(dist.css) === 'string'){
        fs.writeFile(dist.css, result.css.toString(),function(){
          console.log(new Date().toLocaleTimeString() + ' ' + filename + ' 保存成功。ui.css 编译成功。');  
        })
      }else if(Array.isArray(dist.css)){
        var resultCss = result.css.toString();
        dist.css.forEach(function(val){
          fs.writeFile(val, resultCss,function(){
            console.log(new Date().toLocaleTimeString() + ' ' + filename + ' 保存成功。'+ val + ' 编译成功。');  
          })
        })
      }
      
    }
  })
}

function buildJs(filename) {
  // 处理js程序
  rollup.rollup({
    entry: source.js,
    plugins: [
      includePaths({

      }),
      eslint({
        "parserOptions": {
          "sourceType": "module"
        }
      })
    ]
  }).then(function(bundle) {
    bundle.write({
      format: 'iife',
      moduleName: 'ui',
      dest: dist.js
    });
    console.log(new Date().toLocaleTimeString() + ' ' + filename + ' 保存成功。ui.js 编译成功。');
  })
}

function buildHtml() {

}

function watch() {
  fs.readdir('module', (err, files) => {
    files.forEach(function(file) {
      fs.watch('module/' + file, function(err, filename) {
        if (filename) {
          if (filename.indexOf('.scss') > -1) {
            buildCss(filename);
          } else if (filename.indexOf('.js') > -1) {
            buildJs(filename);
          }
        }
      })
    })
  })
}

watch()