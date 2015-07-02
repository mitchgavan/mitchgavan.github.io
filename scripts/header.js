// Hide nav on on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var $body = $('body');
var $navbar = $('#nav');
var navbarHeight = $navbar.outerHeight();


$(window).scroll(function(event){
    didScroll = true;
});


if ($body.hasClass('default')) {

    setInterval(function() {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);

} else {

    var $banner = $('#banner');
    var bannerHeight = $banner.outerHeight();

    setInterval(function() {
        if (didScroll) {
            hasScrolledDefault();
            didScroll = false;
        }
    }, 250);

}

function hasScrolled() {
    var st = $(this).scrollTop();
    
    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta)
        return;
    
    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight){
        // Scroll Down
        $navbar.addClass('is-navUp');
        
    } else {
        // Scroll Up
        if(st + $(window).height() < $(document).height()) {
            $navbar.removeClass('is-navUp');
        } 
    }
    
    lastScrollTop = st;
}

function hasScrolledDefault() {
    var st = $(this).scrollTop();
    
    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta)
        return;
    
    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight){
        // Scroll Down
        $navbar.addClass('is-navUp');
        
    } else {
        // Scroll Up
        if(st + $(window).height() < $(document).height()) {
            $navbar.removeClass('is-navUp headerSubpage-transparent');

            if (st < bannerHeight) {
                $navbar.addClass('headerSubpage-transparent');
            }
        } 
    }
    
    lastScrollTop = st;
}