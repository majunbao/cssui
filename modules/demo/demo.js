var html5Element = [
  'section',
  'article',
  'tip'
];

var inputNode = document.getElementsByTagName('input');
for(var i = 0;i<inputNode.length;i++){
  console.log(inputNode[i].className);
}

export default function(){
  for(var i = 0;i<html5Element.length;i++){
    document.createElement(html5Element[i])
  }
}