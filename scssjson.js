const fs = require('fs');
const scsstojson = require('scss-to-json');

let configs = scsstojson('modules/button/config.scss');

let readObject = (objects) => {
  let content = '';
  for(var object in objects){
    content += `<label>`+object.replace(/^\$[a-z]+-/,'')+`</label>` + `<textarea>${objects[object]}</textarea>`
  }
  return (`<form>${content}</form>`)
}

let render = () => {
  console.log(readObject(configs))
}

render();