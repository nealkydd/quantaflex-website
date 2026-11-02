/* Shared primary navigation and Features dropdown behaviour. */
(function () {
  function ensureSiteIcon(rel, href) {
    if (document.head.querySelector('link[rel="' + rel + '"]')) return;
    var icon = document.createElement('link');
    icon.rel = rel;
    icon.href = href;
    document.head.appendChild(icon);
  }
  ensureSiteIcon('icon', '/assets/q-quantaflex.png?v=1');
  var footerLinks = document.querySelector('.footer-links');
  var journalFooterLink = footerLinks && footerLinks.querySelector('a[href="/journal/"]');
  if (journalFooterLink) {
    journalFooterLink.href = '/journal/own-it/';
    journalFooterLink.textContent = 'Blog';
  }
  if (footerLinks && !footerLinks.querySelector('.nav-resources')) {
    var resources = document.createElement('a');
    resources.className = 'nav-resources';
    resources.href = '/resources/';
    resources.textContent = 'Resources';
    footerLinks.insertBefore(resources, footerLinks.firstChild);
  }
  var nav = document.querySelector('nav[aria-label="Primary"]');
  if (nav && !nav.querySelector('.nav-blog')) {
    var blog = document.createElement('a');
    blog.className = 'nav-blog';
    blog.href = '/journal/own-it/';
    blog.textContent = 'BLOG';
    var blogBuy = nav.querySelector('.nav-shop');
    nav.insertBefore(blog, blogBuy || null);
  }
  if (nav && !nav.querySelector('.nav-contact')) {
    var contact = document.createElement('a');
    contact.className = 'nav-contact';
    contact.href = '/contact.html';
    contact.textContent = 'CONTACT';
    var buy = nav.querySelector('.nav-shop');
    nav.insertBefore(contact, buy || null);
  }
  var links = document.querySelectorAll('nav > a');
  var featuresNav = document.querySelector('.features-nav');
  var featuresTrigger = document.querySelector('.features-trigger');
  if (!featuresNav || !featuresTrigger) return;
  var primaryNav = featuresNav.parentElement;
  var featuresMenuLinks = document.querySelectorAll('.features-menu a');
  featuresMenuLinks.forEach(function (link) {
    if (link.getAttribute('href') === '/features/kineplex') link.textContent = 'Kineplex';
  });
  var hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  var closeTimer = null;

  function cancelScheduledClose() {
    if (closeTimer !== null) {
      window.clearTimeout(closeTimer);
      closeTimer = null;
    }
  }

  function scheduleClose() {
    cancelScheduledClose();
    closeTimer = window.setTimeout(function () {
      closeFeatures(false);
    }, 160);
  }

  function previewNavItem(item) {
    links.forEach(function (link) {
      link.classList.remove("nav-preview");
    });
    featuresTrigger.classList.remove("nav-preview");
    item.classList.add("nav-preview");
    primaryNav.classList.add("nav-previewing");
  }

  function clearNavPreview() {
    links.forEach(function (link) {
      link.classList.remove("nav-preview");
    });
    featuresTrigger.classList.remove("nav-preview");
    primaryNav.classList.remove("nav-previewing");
  }

  function setActive(href) {
    links.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === href);
    });
    featuresTrigger.classList.toggle("active", href === "features");
  }

  function syncActiveLink() {
    var featurePath = window.location.pathname.replace(/\/$/, "");
    var featureIsActive = featurePath.indexOf("/features/") === 0;
    var activePage = featurePath === "/downloads.html" ? "/downloads.html" : featurePath === "/about.html" ? "/about.html" : featurePath === "/contact.html" ? "/contact.html" : featurePath.indexOf("/journal/") === 0 ? "/journal/own-it/" : "/";

    setActive(featureIsActive ? "features" : activePage);
    featuresMenuLinks.forEach(function (link) {
      var isCurrentFeature = link.getAttribute("href") === featurePath;
      link.classList.remove("active");
      if (isCurrentFeature) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function openFeatures() {
    cancelScheduledClose();
    previewNavItem(featuresTrigger);
    primaryNav.classList.add("features-menu-open");
    featuresNav.classList.add("is-open");
    featuresTrigger.setAttribute("aria-expanded", "true");
  }

  function closeFeatures(returnFocus) {
    cancelScheduledClose();
    if (returnFocus) featuresTrigger.focus();
    primaryNav.classList.remove("features-menu-open");
    featuresNav.classList.remove("is-open");
    featuresTrigger.setAttribute("aria-expanded", "false");
    clearNavPreview();
  }

  links.forEach(function (link) {
    link.addEventListener("mouseenter", function () {
      previewNavItem(link);
    });
    link.addEventListener("mouseleave", clearNavPreview);
    link.addEventListener("focus", function () {
      previewNavItem(link);
    });
    link.addEventListener("blur", clearNavPreview);
    link.addEventListener('click', function () {
      setActive(link.getAttribute("href"));
      closeFeatures(false);
    });
  });

  featuresTrigger.addEventListener("click", function (event) {
    /* A desktop pointer opens the menu on hover before the click arrives.
       Keep that menu open instead of immediately toggling it shut. Keyboard
       activation (detail 0) and touch retain the expected toggle behaviour. */
    if (hoverQuery.matches && event.detail !== 0) {
      openFeatures();
      return;
    }
    if (featuresNav.classList.contains("is-open")) {
      closeFeatures(false);
    } else {
      openFeatures();
    }
  });

  featuresTrigger.addEventListener("keydown", function (event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openFeatures();
      featuresMenuLinks[0].focus();
    }
  });

  featuresNav.addEventListener("pointerenter", function () {
    if (hoverQuery.matches) {
      cancelScheduledClose();
      openFeatures();
    }
  });
  featuresNav.addEventListener("pointerleave", function () {
    if (hoverQuery.matches) scheduleClose();
  });
  featuresNav.addEventListener("focusin", function (event) {
    if (event.target !== featuresTrigger) openFeatures();
  });
  featuresNav.addEventListener("focusout", function () {
    window.setTimeout(function () {
      if (!featuresNav.contains(document.activeElement)) closeFeatures(false);
    }, 0);
  });

  featuresMenuLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      setActive("features");
    });
  });

  document.addEventListener("click", function (event) {
    if (!featuresNav.contains(event.target)) closeFeatures(false);
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && featuresNav.classList.contains("is-open")) {
      closeFeatures(true);
    }
  });

  window.addEventListener("hashchange", syncActiveLink);
  syncActiveLink();
})();
