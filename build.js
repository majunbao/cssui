"use strict";

const fs = require('fs');
const postcss = require('postcss');
// const rollup = require('rollup');
const includePaths = require('rollup-plugin-includePaths')
const http = require('http');
// const eslint = require('rollup-plugin-eslint');

// css文件

const source = {
  css: 'module/init.css',
  js: 'module/init.js'
}
const dist = {
  css: 'dist/ui.css',
  js: 'dist/ui.js'
}



function buildCss(filename) {
  const css = fs.readFileSync(source.css, { encoding: 'utf8' });
  // 处理css程序
  postcss()
    .use(require('postcss-at-rules-variables'))
    .use(require('postcss-each')({
      plugins: {
            afterEach: [
              require('postcss-at-rules-variables')
            ],
            beforeEach: [
              require('postcss-at-rules-variables')
            ]
          }
    }))
    .use(require('postcss-import')({
      plugins: [
        require("postcss-at-rules-variables")({ /* options */ }),
        require('postcss-each')({
          plugins: {
            afterEach: [
              require('postcss-at-rules-variables')
            ],
            beforeEach: [
              require('postcss-at-rules-variables')
            ]
          }
        })
      ]
    }))
    // .use(require('postcss-for'))
    .use(require('postcss-css-variables'))
    // .use(require('postcss-calc'))
    // .use(require('postcss-nth-list'))
    // .use(require('postcss-conditionals'))
    // .use(require('postcss-nested'))
    .process(css, { from: source.css, to: dist.css })
    .then(function(result) {
      fs.writeFileSync(dist.css, result.css, 'utf8');
      console.log(new Date().toLocaleTimeString() + ' ' + filename + ' 保存成功。ui.css 编译成功。')
    });
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
          if (filename.indexOf('.css') > -1) {
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
