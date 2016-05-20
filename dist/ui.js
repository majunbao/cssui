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
    this.selector = selector;
    return this;
  }
  $$.fn = $$.prototype = {
    selectorName: function() {
      return this.selector;
    },
    constructor: $$
  }
  var a = new $$('aaa');

  var init = {
  	tab: Tab,
    $$: $$
  }

  return init;

}());