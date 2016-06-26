$(function() {
  
  var supportAnimation = false;
  // 支持 animation 吗
  if ('animation' in document.body.style) {
    $('body').addClass('animation');
    supportAnimation = true;
  }

  $('.banner').banner();
  $('.title-modify, .each-animation, .home-match').scrollHook();
})
