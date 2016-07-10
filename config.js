const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

let config = yaml.safeLoad(fs.readFileSync('config/button.yml', 'utf8'));


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
}

render();