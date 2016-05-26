var util = {};

util.getType = function(obj){
  return Object.prototype.toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
};

util.each = function(array, call){
  if(!array){
    return null;
  }
  var length = array.length || 0;
};

util.merge = function( first, second ) {
  var len = +second.length,
    j = 0,
    i = first.length;

  for ( ; j < len; j++ ) {
    first[ i++ ] = second[ j ];
  }

  first.length = i;

  return first;
};

export default util;