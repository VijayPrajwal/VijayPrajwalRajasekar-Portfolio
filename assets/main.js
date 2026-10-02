// --- Theme Management (Dark / Light Mode) ---
(function initTheme() {
  var savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    var initialTheme = prefersLight ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', initialTheme);
  }
})();

// Navigation Dropdown & Global Interactivity
document.addEventListener('DOMContentLoaded', function () {
  
  // Setup Theme Switcher Toggle Button
  function setupThemeToggle() {
    var headerWrap = document.querySelector('.site-header .wrap');
    if (!headerWrap) return;

    var existingBtn = document.getElementById('themeToggle');
    if (existingBtn) return;

    var btn = document.createElement('button');
    btn.className = 'theme-toggle-btn';
    btn.id = 'themeToggle';
    btn.type = 'button';
    
    var currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    btn.setAttribute('aria-label', currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    btn.setAttribute('title', 'Toggle dark / light mode');

    btn.innerHTML = 
      '<span class="theme-toggle-track">' +
        '<svg class="theme-icon moon-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>' +
        '</svg>' +
        '<svg class="theme-icon sun-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<circle cx="12" cy="12" r="5"></circle>' +
          '<line x1="12" y1="1" x2="12" y2="3"></line>' +
          '<line x1="12" y1="21" x2="12" y2="23"></line>' +
          '<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>' +
          '<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>' +
          '<line x1="1" y1="12" x2="3" y2="12"></line>' +
          '<line x1="21" y1="12" x2="23" y2="12"></line>' +
          '<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>' +
          '<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>' +
        '</svg>' +
        '<span class="theme-toggle-thumb"></span>' +
      '</span>' +
      '<span class="theme-toggle-label">Theme</span>';

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      var nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('theme', nextTheme);
      btn.setAttribute('aria-label', nextTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });

    headerWrap.appendChild(btn);
  }

  setupThemeToggle();

  // Listen for OS system theme changes if user hasn't set an explicit preference
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem('theme')) {
        var newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    });
  }

  // Abstract dropdown setup to allow re-binding when nav HTML is restored
  function setupDropdown() {
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
  }

  // Initial dropdown setup
  setupDropdown();

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

  // Handle contact form submission
  function setupFormHandler(formId, successId) {
    var form = document.getElementById(formId);
    var success = document.getElementById(successId);
    var btn = form ? form.querySelector('button[type="submit"]') : null;
    if (!form || !success || !btn) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      btn.disabled = true;
      var originalBtnText = btn.textContent;
      btn.textContent = 'Sending…';

      fetch('https://formspree.io/f/mgawwapr', {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
      .then(function (res) {
        if (res.ok) {
          success.style.color = 'var(--telemetry)';
          success.style.borderColor = 'rgba(74,222,128,0.25)';
          success.style.background = 'rgba(74,222,128,0.07)';
          var successSvg = success.querySelector('svg');
          if (successSvg) successSvg.style.display = '';
          success.childNodes[success.childNodes.length - 1].textContent = " Message sent — I'll get back to you soon.";
          success.classList.add('show');
          form.reset();
          setTimeout(function () { success.classList.remove('show'); }, 6000);
        } else {
          success.style.color = '#f87171';
          success.style.borderColor = 'rgba(248,113,113,0.3)';
          success.style.background = 'rgba(248,113,113,0.07)';
          var successSvg = success.querySelector('svg');
          if (successSvg) successSvg.style.display = 'none';
          success.childNodes[success.childNodes.length - 1].textContent = ' Something went wrong — please try emailing me directly.';
          success.classList.add('show');
        }
      })
      .catch(function () {
        success.style.color = '#f87171';
        success.style.borderColor = 'rgba(248,113,113,0.3)';
        success.style.background = 'rgba(248,113,113,0.07)';
        var successSvg = success.querySelector('svg');
        if (successSvg) successSvg.style.display = 'none';
        success.childNodes[success.childNodes.length - 1].textContent = ' Network error — please try emailing me directly.';
        success.classList.add('show');
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = originalBtnText;
      });
    });
  }

  setupFormHandler('contactForm', 'formSuccess');
});
