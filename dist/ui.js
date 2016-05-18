var ui = (function () {
  'use strict';

  function Tab(options){
  	options = options || {};
  }

  Tab.prototype.render = function(options){
  	var selector = options.selector;

  	if(selector){
  		
  	}
  }

  var tab = new Tab({

  })

  var $$ = function(selector, children) {
    return _instance();
    // if(!selector){
    //   return _instance();
    // }else if(selector){
    //   // fun
    // }else{
    //   // dom
    //   var dom = '<h1>This is h1.</h1>'
    //   return _instance(dom, selector);
    // }
  }

  var _instance = function(dom, selector){
    var dom = dom || [];
    console.log(1)
    dom.selector = selector;
    if (!(this instanceof _instance)) {
      console.log(2)
      return new _instance;
      
    }
    
  }

  _instance.prototype = $$.fn = {};

  $$.fn.a = 2;

  var init = {
  	tab: Tab,
    $$: $$
  }

  return init;

}());