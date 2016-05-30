var ui = (function () {
  'use strict';

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

  var dateUtil = {};

  dateUtil.isDate = function(object){
    if(util.getType(object) === 'date'){
      return true;
    }else{
      return false;
    }
  };

  // @description 是否为闰年
  // @param year {num} 可能是年份或者为一个date实例对象
  // @return {boolean} 返回值
  dateUtil.isLeapYear = function(year){
    if(dateUtil.isDate(year)){
      year = year.getFullYear();
    }
    if((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)){
      return true;
    }else{
      return false;
    }
  };

  dateUtil.getDaysOfMonth = function(year, month){
    if(dateUtil.isDate(year)){
      month = year.getMonth()+1;
      year = year.getFullYear();
    }
    return [31, dateUtil.isLeapYear(year)? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month-1];
  };

  dateUtil.getBeginDayOfMouth = function(year, month){
    if(dateUtil.isDate(year)){
      month = year.getMonth();
      year = year.getFullYear();
    }
    return new Date(year, month-1).getDay();
  };

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

  var init$1 = calendar.prototype.init = function(date){
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

  init$1.prototype = calendar.prototype;

  calendar.prototype.render = function(){
    var dom = document.getElementsByClassName('calendar')[0].getElementsByTagName('table')[0];

    dom.innerHTML = this.value || this.table().value;

    return this
  }

  document.addEventListener('DOMContentLoaded', function(){
    var a = calendar('2015.1').render();

    document.getElementsByClassName('on-right')[0].addEventListener('click',function(){
      a = a.next().render();
      document.getElementsByClassName('calendar')[0].getElementsByTagName('span')[0].innerHTML = a.month + ' ' + a.year;
    })

    document.getElementsByClassName('on-left')[0].addEventListener('click',function(){
      a = a.prev().render();
      document.getElementsByClassName('calendar')[0].getElementsByTagName('span')[0].innerHTML = a.month + ' ' + a.year;
    })
  })

  var init = {
  	// tab: tab,
    // calendar: calendar,
    date: calendar
  };

  return init;

}());