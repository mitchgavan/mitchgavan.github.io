var $ = require('jquery');
var navToggle = require('./nav');
var smoothScroll = require('./smoothScroll');

import '../scss/style.scss';

$(document).ready(function () {
  // Init
  navToggle();
  smoothScroll();
});
