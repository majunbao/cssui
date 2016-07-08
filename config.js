const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

let config = yaml.safeLoad(fs.readFileSync('config/button.yml', 'utf8'));

// console.log(JSON.stringify(config))

function readConfig(config){
  for(let cfg in config){
    if(typeof config[cfg] === 'object'){
      // console.log(cfg);
      readConfig(config[cfg])
    }else{
      console.log(cfg)
    }
  }
}

readConfig(config)