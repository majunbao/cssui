;(function(){
  $(function(){
    $('[tip]').each(function(){
      $(this).html('?').on('mouseenter',function(){
        $(this).html('?<span class=tip-content>'+ $(this).attr('tip') +'</span>').find('.tip-content').css({'left':($(this).offset().left) - ($(this).find('.tip-content').width()/2)+2,'top':$(this).offset().top-($(this).find('.tip-content').height())-12,})
      })
    })
  })
})()