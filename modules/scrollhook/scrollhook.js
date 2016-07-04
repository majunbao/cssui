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

    $(document).on('ready scroll', function(event) {

      timeEnd = new Date();
      if (event.type == 'ready') {
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
