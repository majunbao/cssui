import $$ from '../query/query.js';
import date from '../date/date.js';

var Calendar = function(){

}
Calendar.prototype = {
  init : function(y, m, d){
    var week = new Date(y, m-1, d).getDay();
    var weekstr="";
    switch(week){
      case 1: weekstr="星期一"; break;
      case 2: weekstr="星期二"; break;
      case 3: weekstr="星期三"; break;
      case 4: weekstr="星期四"; break;
      case 5: weekstr="星期五"; break;
      case 6: weekstr="星期六"; break;
      case 7: weekstr="星期日"; break;
    }
    return {
      weekstr: weekstr,
      week: week
    };
  }
}

Calendar.prototype.render = function(y,m,d){
  var dom = document.getElementsByClassName('calendar')[0].getElementsByTagName('table')[0];
  dom.innerHTML = date(y,m).html()[0];
}


Calendar.prototype.next = function(){
}
Calendar.prototype.prev = function(){

}

document.addEventListener('DOMContentLoaded', function(){
  Calendar.prototype.render(2016,2)
})

export default Calendar;