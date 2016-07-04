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
