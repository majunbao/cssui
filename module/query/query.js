var Query = function(selector){
  this.getDOMObject(selector)
};

Query.prototype.getDOMObject = function(selector) {
  if (selector) {
    return document.querySelector(selector);
  }
};

var query = new Query('body');

export default query;
