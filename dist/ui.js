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

  var Query = function(selector){
    this.getDOMObject(selector)
  };

  Query.prototype.getDOMObject = function(selector) {
    if (selector) {
      return document.querySelector(selector);
    }
  };

  var query = new Query('body');

  var init = {
  	tab: Tab,
    $$: query
  }

  return init;

}());