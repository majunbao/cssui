import util from '../util/util.js';

var dateUtil = {};

dateUtil.isDate = function(object){
  if(util.getType(object) === 'date'){
    return true;
  }else{
    return false;
  }
};

// @description 是否为闰年
// @param year {num} 可能是年份或者为一个date实例对象
// @return {boolean} 返回值
dateUtil.isLeapYear = function(year){
  if(dateUtil.isDate(year)){
    year = year.getFullYear();
  }
  if((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)){
    return true;
  }else{
    return false;
  }
};

dateUtil.getDaysOfMonth = function(year, month){
  if(dateUtil.isDate(year)){
    month = year.getMonth()+1;
    year = year.getFullYear();
  }
  return [31, dateUtil.isLeapYear(year)? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month-1];
};

dateUtil.getBeginDayOfMouth = function(year, month){
  if(dateUtil.isDate(year)){
    month = year.getMonth();
    year = year.getFullYear();
  }
  return new Date(year, month-1).getDay();
};


export default dateUtil;

