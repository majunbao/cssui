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

// readConfig(config)

let readBase = (bases) => {
  if(bases)
    console.log(bases)
}

let readColor = (colors) => {
  if(colors)
    console.log(colors)
}

let readSize = (sizes) => {
  if(sizes)
    console.log(sizes)
}

let readString = (strings) => {
  console.log(strings)
}

let readObject = (objects) => {
  let content = '';
  for(var object in objects){
    content += `<label>${object}</label>` + `<textarea>${objects[object]}</textarea>`
  }
  return (`<form>${content}</form>`)
}

let render = () => {
  console.log(readObject(config.bases))
  // let container = document.getElementById('namespace-setting-container');
  // container.innerHTML = readObject(config.bases)
}

render();
// readBase(config.bases);
// readColor(config.colors);
// readSize(config.sizes)
// readSize(config.black)