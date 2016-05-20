var $$ = function(selector, children) {
  this.selector = selector;
  return this;
}
$$.fn = $$.prototype = {
  selectorName: function() {
    return this.selector;
  },
  constructor: $$
}
var a = new $$('aaa');

// console.log(a.selectorName())

export default $$;
