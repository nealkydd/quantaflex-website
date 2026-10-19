/* Shared primary navigation and Features dropdown behaviour. */
(function () {
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
  var hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

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
      link.classList.toggle("active", link.getAttribute("href") === featurePath);
    });
  }

  function openFeatures() {
    previewNavItem(featuresTrigger);
    primaryNav.classList.add("features-menu-open");
    featuresNav.classList.add("is-open");
    featuresTrigger.setAttribute("aria-expanded", "true");
  }

  function closeFeatures(returnFocus) {
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

  featuresTrigger.addEventListener("click", function () {
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

  featuresNav.addEventListener("mouseenter", function () {
    if (hoverQuery.matches) openFeatures();
  });
  featuresNav.addEventListener("mouseleave", function () {
    if (hoverQuery.matches) closeFeatures(false);
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
