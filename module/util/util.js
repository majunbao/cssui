var util = {}

util.getType = function(obj){
  return Object.prototype.toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
}

util.each = function(array, call){
  if(!array){
    return null;
  }
  var length = array.length || 0;
}

export default util;