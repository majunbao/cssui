var ui = (function () {
  'use strict';

  var html5Element = [
    'section',
    'article'
  ];

  function demo(){
    for(var i = 0;i<html5Element.length;i++){
      document.createElement(html5Element[i])
    }
  }

  demo();

  // import calendar from 'calendar/calendar.js';
  // import date from 'date/date.js';


  var init = {
  	// tab: tab,
    // calendar: calendar,
    // date: date
  };

  return init;

}());