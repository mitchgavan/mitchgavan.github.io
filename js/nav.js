const NavToggle = () => {
  const body = document.body;
  const navbar = document.getElementById('nav');

  if (!body || !navbar) {
    return;
  }

  const banner = document.getElementById('banner');
  const isDefaultPage = body.classList.contains('default');
  const delta = 5;
  let lastScrollTop = window.scrollY || window.pageYOffset || 0;
  let navbarHeight = navbar.offsetHeight;
  let bannerHeight = banner ? banner.offsetHeight : 0;
  let ticking = false;

  const updateMeasurements = () => {
    navbarHeight = navbar.offsetHeight;
    bannerHeight = banner ? banner.offsetHeight : 0;
  };

  const getPageHeight = () => document.documentElement.scrollHeight;

  const hasScrolled = scrollTop => {
    if (Math.abs(lastScrollTop - scrollTop) <= delta) {
      return;
    }

    if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
      navbar.classList.add('is-navUp');
    } else if (scrollTop + window.innerHeight < getPageHeight()) {
      navbar.classList.remove('is-navUp');
    }

    lastScrollTop = scrollTop;
  };

  const hasScrolledAlt = scrollTop => {
    if (Math.abs(lastScrollTop - scrollTop) <= delta) {
      return;
    }

    if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
      navbar.classList.add('is-navUp');
    } else if (scrollTop + window.innerHeight < getPageHeight()) {
      navbar.classList.remove('is-navUp', 'headerSubpage-transparent');

      if (scrollTop < bannerHeight) {
        navbar.classList.add('headerSubpage-transparent');
      }
    }

    lastScrollTop = scrollTop;
  };

  const handleScroll = () => {
    if (ticking) {
      return;
    }

    ticking = true;

    window.requestAnimationFrame(() => {
      const scrollTop = window.scrollY || window.pageYOffset || 0;

      if (isDefaultPage) {
        hasScrolled(scrollTop);
      } else {
        hasScrolledAlt(scrollTop);
      }

      ticking = false;
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', updateMeasurements);
};

export default NavToggle;
