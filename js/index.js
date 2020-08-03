var $ = require('jquery');
var navToggle = require('./nav');
var smoothScroll = require('./smoothScroll');

$(document).ready(function () {
  // Init
  navToggle();
  smoothScroll();
});
