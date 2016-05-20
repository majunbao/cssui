const http = require('http');
const fs = require('fs');
const os = require('os');
const exec = require('child_process').exec;

const serverdir = 'dist';

const server = http.createServer((req, res) => {
  let someHead = req.headers.accept;
  res.writeHead(200, {'Content-Type': someHead})
  if(req.url === '/'){
    res.write(fs.readFileSync(serverdir + '/' + 'index.html'));
    res.end();
  }else{
    fs.access(serverdir + '/' + req.url, fs.F_OK, (err) => {
      if(!err){
        res.write(fs.readFileSync(serverdir + '/' + req.url));
        res.end();
      }else{
        res.end();
      }
    })
  }
})

server.listen(8888, function(){
  console.log("http://" + os.networkInterfaces().en0[1].address + ':8888');
  exec('open '+ "http://" + os.networkInterfaces().en0[1].address + ':8888')
});