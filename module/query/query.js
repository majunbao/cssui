import sizzle from '../sizzle/sizzle.js';

var query  = function(selector, content){
  return new query.fn.init(selector)
}
var init;

query.find = sizzle;

query.fn = query.prototype = {
  name: 'query'
}

init = query.fn.init = function(selector){
  if(!selector){
    return this;
  }
  if(selector){
    this.length = 1;
    console.log(this)
    merge(this, sizzle(selector));
    console.log(this)
    return this;
  }
},

init.prototype = query.fn;

query.fn.a = function(){
  console.log(2)
};

// Support: Android <=4.0 only, PhantomJS 1 only
// push.apply(_, arraylike) throws on ancient WebKit
var merge = function( first, second ) {
  var len = +second.length,
    j = 0,
    i = first.length;

  for ( ; j < len; j++ ) {
    first[ i++ ] = second[ j ];
  }

  first.length = i;

  return first;
}


export default query;