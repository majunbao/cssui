import util from '../util/util.js';
import dateUtil from 'dateUtil.js';

// 传入 date 对象，返回 date 字符串
// dateFormat(new Date(), 'yyyy-MM-dd')
function format(dateObject, format){
  format = format.replace('yyyy', dateObject.getFullYear());
  format = format.replace('MM', dateObject.getMonth() + 1);
  format = format.replace('dd', dateObject.getDate());
  return format;
}

// 传入 date 字符串，返回 Date 日期对象
function parse(dateString){

  if(dateUtil.isDate(dateString)){return dateString};

  if(util.getType(dateString)==='string'){
    return new Date(dateString.toString().replace(/[^0-9]/g," "));
  }

  return null;
}

var calendar = function(date){
  return new calendar.prototype.init(date);
};

calendar.prototype = {
  constructor: calendar,
  length: 0,

  pushStack: function( elems ) {
    // Build a new jQuery matched element set
    var ret = util.merge( this.constructor(), elems );

    // Add the old object onto the stack (as a reference)
    ret.prevObject = this;

    // Return the newly-formed element set
    return ret;
  },

  toArray: function(){
    if(util.getType(this.rootArguments)==='string'){
      return this.rootArguments.replace(/[^0-9]/g,' ').split(' ');
    }
  },

  eq: function(i){
    var len = this.length,
      j = +i + ( i < 0 ? len : 0 );
    return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
  },

  slice: function(){
    return this.pushStack([].slice.apply(this, arguments))
  },

  first: function(){
    return this.eq(0);
  },

  last: function(){
    return this.eq(this.length - 1);
  },

  sibling: function( dir ) {
    // return this.constructor(this.year && this.year+dir, this.month && this.month+dir, this.date && this.date+dir);
    if(this.rootArguments.length === 1){
      var nowDate = new Date(this.rootArguments[0]);
      nowDate.setFullYear(nowDate.getFullYear() + dir);
      return this.constructor(nowDate.getFullYear())
    }else{
      var nowDate = new Date(this.rootArguments[0], this.rootArguments[1]);
      nowDate.setMonth(nowDate.getMonth() + dir);
      return this.constructor(nowDate.getFullYear() + ' ' + nowDate.getMonth())
    }
  },

  next: function(index){
    return this.sibling(index || 1);
  },

  prev: function(index){
    return this.sibling(-index || -1);
  },

  table: function(){
    var inner = [];
    var result = [];

    if(this.rootArguments.length===1){

      for(var i=0; i<this.length;i++){
        inner.push('<td><a>'+(+this[i].getMonth()+1)+'</a></td>');
      };

      for(var i=0; i<=this.length;i+=4){
        result += '<tr>' + inner.slice(i, i+4) + '</tr>';
      }

    }else{
      var thisDay = this[0].getDay();

      for(var j=0;j<thisDay;j++){
        inner.push('<td><a class=disabled>'+j+'</a></td>')
      }
      for(var i=0; i<this.length;i++){
        inner.push('<td><a>'+this[i].getDate()+'</a></td>');
      };

      for(var i=0; i<=this.length;i+=7){
        result += '<tr>' + inner.slice(i, i+7) + '</tr>';
      }
    }
   
    this.value = result.toString().replace(/,/g,'');

    return this;
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

var init = calendar.prototype.init = function(date){
  // 支持 null undefined ""
  this.length = 0;
  // this.splice = [].splice;


  if(!date){
    return this;
  }

  this.rootArguments = date.toString().replace(/[^0-9]/g,' ').split(' ');

  var dateArray = this.rootArguments;

  // 参数为 date(2017)
  if(dateArray.length === 1){

    this.length = 12;

    for(var i=0;i<this.length;i++){
      this[i] = parse(dateArray[0] + '-' + (i+1));
      // this[i] = format(parse(date + ' ' + (i+1)), 'yyyy-MM-dd');
    }

    return this;
  }else if(dateArray.length === 2){

    this.length = dateUtil.getDaysOfMonth(dateArray[0], dateArray[1]);

    for(var i=0; i<=this.length;i++){
      this[i] = parse(dateArray[0] + ' ' + dateArray[1] + ' ' + (i+1));
      // this[i] = format(parse(dateArray[0] + ' ' + dateArray[1] + ' ' + (i+1)), 'yyyy-MM-dd');
    }

    return this;
  }

  return this;
};

init.prototype = calendar.prototype;

export default calendar;


