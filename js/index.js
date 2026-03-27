var $ = require('jquery');
var navToggle = require('./nav');
var smoothScroll = require('./smoothScroll');
var initTheme = require('./theme');

import '../scss/style.scss';

$(document).ready(function () {
  initTheme();
  navToggle();
  smoothScroll();
});
