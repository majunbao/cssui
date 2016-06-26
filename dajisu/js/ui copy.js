$(function() {
  var supportAnimation = false;
  // 支持 animation 吗
  if ('animation' in document.body.style) {
    $('body').addClass('animation');
    supportAnimation = true;
  }

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
    },
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
  });

  $('.title-modify, .each-animation, .home-match').scrollHook()

  $('.banner').banner();
})
