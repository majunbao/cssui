import util from '../util/util.js';
import dateUtil from 'dateUtil.js';

var date = function(year, month, day){
  return new date.prototype.init(year, month, day);
};

date.prototype = {
  constructor: date,
  length: 0,

  pushStack: function( elems ) {
    // Build a new jQuery matched element set
    var ret = util.merge( this.constructor(), elems );

    // Add the old object onto the stack (as a reference)
    ret.prevObject = this;

    // Return the newly-formed element set
    return ret;
  },

  eq: function(i){
    var len = this.length,
      j = +i + ( i < 0 ? len : 0 );
    return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
  },

  first: function(){
    return this.eq(0);
  },

  last: function(){
    return this.eq(this.length - 1);
  },

  sibling: function( dir ) {
    return this.constructor(this.year && this.year+dir, this.month && this.month+dir, this.date && this.date+dir);
  },

  next: function(index){
    return this.sibling(index || 1);
  },

  prev: function(index){
    return this.sibling(-index || -1);
  },

  html: function(tml){
    var inner = [];
    var tml = tml || 'td';
    for(var i=1; i<=this.length;i++){
      inner.push('<'+tml+'><a>' + i + '<\/a><\/'+tml+'>');
    };
    var result = []
    for(var i=0,len=inner.length;i<len;i+=7){
       result += ('<tr>' + inner.slice(i,i+7).toString().replace(/,/g,'') + '</tr>');
    }
    var that = util.merge(this.constructor(), new Array(result));

    that.year = this.year || null;
    that.month = this.month || null;
    that.date = this.date || null;
    that.prevObject = this;

    return that;
  }
};

// 初始化函数
// 返回 date日历对象 
// {
//   年:{
//     月:{日,日,日,日,...,日},
//     月:{日,日,日,日,...,日},
//     月:{日,日,日,日,...,日},
//   }
// }
// 支持的调用方法
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

var init = date.prototype.init = function(year, month, date){
  // 支持 null undefined ""
  this.length = 0;
  this.splice = [].splice;

  if(!year){
    return this;
  }

  if(date){
    this.length = 1;
    this[0] = date;

    this.year = year;
    this.month = month;
    this.date = date;

    return this;
  }

  if(month){
    this.length = dateUtil.getDaysOfMonth(year, month);

    for(var i=0; i<=this.length;i++){
      this[i] = i+1;
    }

    this.year = year;
    this.month = month;

    return this;
  }

  if(dateUtil.isDate(year) || util.getType(year) === 'number'){
    util.merge(this, [1,2,3,4,5,6,7,8,9,10,11,12])
    this.year = year;

    return this;
  }

  return this;
};

init.prototype = date.prototype;

export default date;


