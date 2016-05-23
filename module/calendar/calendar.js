import $$ from '../query/query.js';

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

Calendar.prototype.render = function(){
  var week = Calendar.prototype.init(2016,5,25).week;
  var dom = document.getElementsByClassName('calendar')[0];
  var td = dom.getElementsByTagName('td');
  var i = 1;
  Array.prototype.forEach.call(td, function(html){
    // html[week] = i++;
  })
}

document.addEventListener('DOMContentLoaded', function(){
  Calendar.prototype.render();
})

export default Calendar;