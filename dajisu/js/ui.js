(function () {
  'use strict';

  ;(function(){
    $(function(){
      $('[tip]').each(function(){
        $(this).html('?').on('mouseenter',function(){
          $(this).html('?<span class=tip-content>'+ $(this).attr('tip') +'</span>').find('.tip-content').css({'left':($(this).offset().left) - ($(this).find('.tip-content').width()/2)+2,'top':$(this).offset().top-($(this).find('.tip-content').height())-12,})
        })
      })
    })
  })()

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

  $.fn.extend({
    banner: function() {
      var banners = $(this);
      banners.each(function() {
        var $banner = $(this);
        var $items = $banner.find('.banner-item');
        var $length = $items.length;
        var $imgs = $banner.find('.banner-item-img');
        var $texts = $banner.find('.banner-item-text');
        var $textsInner = $texts.find('.banner-item-text-inner');
        var $ctrls = $banner.find('.ctrl-i');
        var $navsPrev = $banner.find('.navs-prev');
        var $navsNext = $banner.find('.navs-next');
        var $index = new Array($length);
        var $start = 0;
        var $animateTime = 1000;
        var $animateDelay = 600;

        function init() {
          autoIndex($start);

          $imgs.css('opacity', 0);
          $texts.css({ 'opacity': 0 });
          $textsInner.css({ 'width': 0 });

          $imgs.eq($start).animate({ 'opacity': 1 }, 1500)
          $texts.eq($start).animate({ 'opacity': 1 }, 1500)
          $textsInner.eq($start).delay($animateDelay).animate({ 'width': '100%' }, 1500);

          $items.eq($start).addClass('now')
          $ctrls.eq($start).addClass('now');

        }

        function autoIndex(index) {
          index = index % $length

          if (index < 0) {
            index = $length + index;
          }
          $index.pop()
          $index.unshift(index);
          $start = index;
        }

        function switchBannerOfIndex() {
          $items.eq($index[0]).addClass('now');

          $imgs.eq($index[1]).stop().animate({
            opacity: 0
          }, $animateTime, function() {
            $items.eq($index[1]).removeClass('now')
          });

          $imgs.eq($index[0]).stop().animate({
            opacity: 1
          }, $animateTime);

          $texts.eq($index[1]).stop().css({ 'opacity': 0 })
          $texts.eq($index[0]).addClass('now').stop().animate({
            opacity: 1
          }, $animateTime);

          $texts.eq($index[1]).stop().css({ 'opacity': 0 })
          $texts.eq($index[0]).addClass('now').stop().animate({
            opacity: 1
          }, $animateTime);

          $textsInner.eq($index[1]).stop().css({ 'width': 0 })
          $textsInner.eq($index[0]).addClass('now').stop().delay($animateDelay).animate({
            width: '100%'
          }, $animateTime);

          $ctrls.eq($index[1]).removeClass('now');
          $ctrls.eq($index[0]).addClass('now');

        }



        $ctrls.on('click', function() {
          autoIndex($(this).index())
          switchBannerOfIndex();
        })
        $navsPrev.on('click', function() {
          autoIndex(--$start)
          switchBannerOfIndex();
        })

        $navsNext.on('click', function() {
          autoIndex(++$start)
          switchBannerOfIndex();
        })

        init();
      })
    }
  })

  $.fn.extend({
    scrollHook: function(callback) {
      var hooks = $(this);
      var timeStart = new Date();
      var timeEnd;
      var timeInterval = 10;
      var scrollStart = $(window).scrollTop();
      var scrollEnd = $(window).scrollTop();
      var screenW = $(window).width();
      var screenH = $(window).height();
      var animateDelayPX = 100;

      $(document).on('ready scroll', function() {
        timeEnd = new Date();
        if (event.type == 'DOMContentLoaded') {
          timeEnd = timeStart.getTime() + timeInterval;

          hooks.each(function() {
            if (!$(this).hasClass('each-animation')) {
              $(this).addClass('have-animation');
            }
          })
        }

        if (timeEnd - timeStart >= timeInterval) {
          // 滚动事件执行
          timeStart = timeEnd;
          scrollEnd = $(window).scrollTop();

          hooks.each(function() {
            if (scrollEnd > $(this).offset().top - screenH + animateDelayPX) {
              if ($(this).hasClass('each-animation')) {
                $(this).addClass('now-each-animation')
              } else {
                $(this).addClass('have-animation now-animation')
              }

            }
            callback && callback($(this))
          });
        }
      })
    }
  })

  var inputNode = document.getElementsByTagName('input');
  for(var i = 0;i<inputNode.length;i++){
    console.log(inputNode[i].className);
  }

}());