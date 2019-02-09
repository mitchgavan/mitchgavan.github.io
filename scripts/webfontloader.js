var WebFontConfig = {
  google: {
    families: [
			'Roboto Slab:400',
			'Roboto:300,400',
			'Merriweather:300,400,700',
			'Source+Code+Pro:400'
		]
  }
};

(function(){
	var wf = document.createElement("script");
	wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
	    '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
	wf.async = 'true';
	document.head.appendChild(wf);
})();