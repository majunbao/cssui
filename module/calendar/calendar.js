import $$ from '../query/query.js';
import dateUtil from '../dateUtil/dateUtil.js';

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

Calendar.prototype.render = function(y,d){
  var week = dateUtil.getBeginDayOfMouth(y, d);
  var dom = document.getElementsByClassName('calendar')[0].getElementsByTagName('table')[0];
  dom.innerHTML = Calendar.prototype.td(week, dateUtil.getDaysOfMonth(y,d));
}

Calendar.prototype.td = function(start, date){
  var data = [];
  var d = date-start
  // 上个月日期
  for(var i = 0; i<start;i++){
    data.push('<td class="disabled"><a>' + (++d) +'</a></td>');
  }
  // 当月日期
  for(var i = 1;i<=date;i++){
    data.push('<td><a>' + i + '</a></td>');
  }
  // 下个月日期
  for(var i = 1;i<= (35-start-date);i++){
    data.push('<td class="disabled"><a>' + i +'</a></td>');
  }
  var result = '';
  for(var i=0,len=data.length;i<len;i+=7){
     result += ('<tr>' + data.slice(i,i+7).toString().replace(/,/g,'') + '</tr>');
  }
  return result;
}
Calendar.prototype.next = function(){
  Calendar.prototype.render(2016,3)
}
Calendar.prototype.prev = function(){

}

document.addEventListener('DOMContentLoaded', function(){
  Calendar.prototype.render(2016,2)
})

export default Calendar;