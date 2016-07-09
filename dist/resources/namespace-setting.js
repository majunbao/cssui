document.addEventListener('DOMContentLoaded', function() {
  var uikit = document.querySelector('.namespace-uikit');
  var setting = document.querySelector('.namespace-setting');
  var settingWidth = setting.querySelector('.namespace-setting-width');

  var textareas = document.querySelectorAll('.namespace-setting textarea');
  for (var i = 0; i < textareas.length; i++) {
    textareas[i].addEventListener('input', function() {
      this.style.height = '';
      this.style.height = this.scrollHeight - parseFloat(window.getComputedStyle(this).paddingTop) - parseFloat(window.getComputedStyle(this).paddingBottom) + 'px'
    }, false)
  };

  // 改变设置面板宽度
  var changeSettingWidth = function(event) {
    var settingEnd = document.body.clientWidth - event.clientX + 'px';
    setting.style.width = settingEnd
    uikit.style.marginRight = settingEnd
  }
  settingWidth.addEventListener('mousedown', function(event) {
    document.addEventListener('mousemove', changeSettingWidth)
  })
  settingWidth.addEventListener('mouseup', function(event) {
    document.removeEventListener('mousemove', changeSettingWidth)
  })
  
  // 设置面板滚动时禁止滚动页面

}, false)
