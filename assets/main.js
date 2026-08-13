// Navigation Dropdown & Global Interactivity
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-dropdown-toggle');
  var menu = document.querySelector('.nav-dropdown-menu');
  var dropdown = document.querySelector('.nav-dropdown');

  if (toggle && menu) {
    var closeTimer = null;
    var isTouchDevice = false;

    // Track touch device interaction
    window.addEventListener('touchstart', function onFirstTouch() {
      isTouchDevice = true;
    }, { passive: true, once: true });

    function openMenu() {
      clearTimeout(closeTimer);
      toggle.classList.add('open');
      menu.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      clearTimeout(closeTimer);
      toggle.classList.remove('open');
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    function scheduleClose() {
      if (isTouchDevice) return;
      closeTimer = setTimeout(closeMenu, 150);
    }

    // Hover handlers for mouse/desktop users
    toggle.addEventListener('mouseenter', function () {
      if (!isTouchDevice) openMenu();
    });
    toggle.addEventListener('mouseleave', scheduleClose);
    menu.addEventListener('mouseenter', function () {
      if (!isTouchDevice) clearTimeout(closeTimer);
    });
    menu.addEventListener('mouseleave', scheduleClose);

    // Click / tap toggle handler (for mobile touch and keyboard)
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var isOpen = menu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close when clicking anywhere outside
    document.addEventListener('click', function (e) {
      if (dropdown && !dropdown.contains(e.target)) {
        closeMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeMenu();
      }
    });
  }

  // Scroll fade-in animations
  var els = document.querySelectorAll('.fade-in');
  if (els.length > 0) {
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });
      els.forEach(function (el) { observer.observe(el); });
    }
  }
});
