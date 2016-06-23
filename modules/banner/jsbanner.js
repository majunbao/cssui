$(function() {
  // 获取所有的图片和控制器
  var banners = document.getElementsByClassName('banner');
  var intervals = [];
  for (var d = 0; d < banners.length; d++) {
    (function(a) {
      var nowBanner = banners[a];
      var items = banners[a].getElementsByClassName('banner-item');
      var imgs = banners[a].getElementsByClassName('banner-item-img');
      var ctrls = banners[a].getElementsByClassName('ctrl-i');
      var navsPrev = banners[a].getElementsByClassName('navs-prev');
      var navsNext = banners[a].getElementsByClassName('navs-next');

      for (var i = 0; i < ctrls.length; i++) {
        (function(j) {
          ctrls[j].addEventListener('click', function() {
            _switchBannerOfIndex(j);
          })
        })(i)
      }

      navsPrev[0].addEventListener('click', function() {
        prevBanner()
      })
      navsNext[0].addEventListener('click', function() {
        nextBanner()
      })

      // intervals.push(setInterval(function(){
      //   nextBanner()
      // },3500))

      function _switchBannerOfIndex(index) {
        var bLength = items.length;
        index = index % bLength;
        if (index < 0) {
          index = bLength - 1;
        }
        for (var j = 0; j < bLength; j++) {
          items[j].className = items[j].className.replace('now', '');
          ctrls[j].className = ctrls[j].className.replace('now', '');
        }
        items[index].className += ' now';
        ctrls[index].className += ' now';
      }

      function _switchBanner(num) {
        var i = 0;
        for (var x = 0; x < items.length; x++) {
          if (items[x].className.indexOf('now') > -1) {
            i = x;
          }
        }
        _switchBannerOfIndex(i + num)
      }

      function nextBanner() {
        _switchBanner(1)
      }

      function prevBanner() {
        _switchBanner(-1)
      }

      
    })(d)
  }

  
})
