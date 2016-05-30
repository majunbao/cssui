// import $$ from '../query/query.js';
import date from '../date/date.js';

date.prototype.render = function(){
  var dom = document.getElementsByClassName('calendar')[0].getElementsByTagName('table')[0];

  dom.innerHTML = this.value || this.table().value;

  return this
}

document.addEventListener('DOMContentLoaded', function(){
  var a = date('2015.1').render();

  document.getElementsByClassName('on-right')[0].addEventListener('click',function(){
    a = a.next().render();
    document.getElementsByClassName('calendar')[0].getElementsByTagName('span')[0].innerHTML = a.month + ' ' + a.year;
  })

  document.getElementsByClassName('on-left')[0].addEventListener('click',function(){
    a = a.prev().render();
    document.getElementsByClassName('calendar')[0].getElementsByTagName('span')[0].innerHTML = a.month + ' ' + a.year;
  })
})

