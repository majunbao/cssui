const http = require('http');
const fs = require('fs');
const os = require('os');
const exec = require('child_process').exec;
const url = require('url');

const mineType = {
  'css': 'text/css',
  'html': 'text/html',
  'js': 'application/x-javascript',
  'ico': 'image/x-icon'
}

const serverdir = process.argv[2] || 'dist';

const server = http.createServer((req, res) => {
  let reqUrl = decodeURIComponent(req.url);
  let someHead = req.headers.accept;
  let fileType = url.parse(reqUrl).pathname.split('.').reverse().shift();


  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': mineType['html'] })
    res.write(fs.readFileSync(serverdir + '/' + 'index.html'));
    res.end();
  } else {
    res.writeHead(200, { 'Content-Type': mineType[fileType] });
    fs.access(serverdir + '/' + reqUrl, fs.F_OK, (err) => {
      if (!err) {
        res.write(fs.readFileSync(serverdir + '/' + reqUrl));
        res.end();
      } else {
        res.end();
      }
    })
  }
})

let post = process.argv[3] || "8888"
server.listen(post, function() {
  console.log("http://" + os.networkInterfaces().en0[1].address + ':' + post);
  exec('open ' + "http://" + os.networkInterfaces().en0[1].address + ':' + post)
    // exec('node build');
});