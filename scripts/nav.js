var NavToggle = (function () {

    var didScroll;
    var lastScrollTop = 0;
    var delta = 5;
    var $body = $('body');
    var $navbar = $('#nav');
    var navbarHeight = $navbar.outerHeight();
    var $banner = $('#banner');
    var bannerHeight = $banner.outerHeight();

    var bindScrollAction = $(window).scroll(function(event){
        didScroll = true;
    });

    var checkScroll = function() {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    };

    var checkScrollAlt = function() {
        if (didScroll) {
            hasScrolledAlt();
            didScroll = false;
        }
    };

    if ($body.hasClass('default')) {
        var scrollInterval = setInterval(checkScroll, 250);

    } else {

        var scrollIntervalAlt = setInterval(checkScrollAlt, 250);

    }

    var hasScrolled = function() {
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
    };

    var hasScrolledAlt = function() {
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
    };

});
