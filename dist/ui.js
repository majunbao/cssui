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

	var merge = function( first, second ) {
	  var len = +second.length,
	    j = 0,
	    i = first.length;

	  for ( ; j < len; j++ ) {
	    first[ i++ ] = second[ j ];
	  }

	  first.length = i;

	  return first;
	};

	var  pushStack = function( elems ) {

	    // Build a new jQuery matched element set
	    var ret = merge( date.prototype.constructor(), elems );

	    // Add the old object onto the stack (as a reference)
	    ret.prevObject = this;

	    // Return the newly-formed element set
	    return ret;
	  };

	// date(new Date())
	// date(new Date(2016,2))
	// date(new Date(2016,2,16))
	// date(2016)
	// date(2016,2)
	// date(2016,2,16)

	// date(new Date()).first()
	// date(new Date()).last()
	// date(new Date()).eq(0)

	// 格式转换
	// date(new Date()).format(y-n-d)
	// date(new Date()).html()

	var date = function(){
	  return new date.prototype.init();
	}

	date.prototype = {
	  constructor: date,

	  eq: function(i){
	    var len = this.length,
	      j = +i + ( i < 0 ? len : 0 );
	    return pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	  },

	  first: function(){

	  },

	  last: function(){

	  }
	}

	var init$1 = date.prototype.init = function(){
	  
	  this.splice = [].splice;
	  for(var i=0; i<=20;i++){
	    this[i] = i
	  }
	  this.length = i;
	  return this;
	}

	init$1.prototype = date.prototype;

	var init = {
		tab: Tab,
	  // calendar: calendar,
	  date: date
	}

	return init;

}());