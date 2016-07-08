document.addEventListener('DOMContentLoaded', function() {
    var backStyle = document.getElementById('uicss');
    var backStyleSrc = backStyle.href;
    var sourceScss = '\n@import "modules/init"\n';
    var configs = '';
    var styleElement = document.createElement('style');
    styleElement.id = "buildcss";
    document.getElementsByTagName('head')[0].appendChild(styleElement);
    render();
    modify();
    function render() {
      sass.compile(configs + sourceScss, function(date) {
        if (date.status === 0) {
          // result.value = date.text;
          styleElement.innerHTML = date.text;
          backStyle.href='';
        } else {
          // result.value = date.message;
          console.log(date.message)
        }
      })
    }
    function modify() {
      var modifyTextarea = document.createElement('textarea');
      modifyTextarea.id = 'modify';
      modifyTextarea.className="margin-bottom-20"

      document.querySelectorAll('.demo-h2').forEach(function(element){
        element.style.cursor='inherit';
        element.addEventListener('click', function(){
          modifyTextarea.value = '';
          element.parentNode.insertBefore(modifyTextarea,element.nextSibling)
          modifyTextarea.focus();
        })
      })
      modifyTextarea.addEventListener('input', function(){
        configs = modifyTextarea.value;
        render();
      })
    }
  })