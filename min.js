const koa = require('koa');
const app = koa();

app.use(function *(next){
  let start = new Date;
  yield next;
  let ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
})
// server
app.use(function *(next){
  
  yield next;
  
})

// // dist
// app.use(function *(next){
//   console.log('dist');
//   yield next;
// })

// build
app.use(function *(next){
  yield next;
  let css = '.button{color:red;padding:0 10px;}'
  let html = `<style>${css}</style><button class="button">button</button>`
  
  this.body = html;
})

// config
app.use(function *(next){
  
  yield next;
  let config = {
    '$btn-namespace': '.button',
    $color: 'red',
    $padding: '0 10px'
  }
})

// module
app.use(function *(next){
  
  yield next;
  let modules = ['button'];
})



app.listen(3000)