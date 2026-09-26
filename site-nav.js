/* Shared primary navigation and Features dropdown behaviour. */
(function () {
  var links = document.querySelectorAll('nav > a');
  var featuresNav = document.querySelector('.features-nav');
  var featuresTrigger = document.querySelector('.features-trigger');
  var primaryNav = featuresNav.parentElement;
  var featuresMenuLinks = document.querySelectorAll('.features-menu a');
  var hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  var activeByHash = {
    "#about": "/#about"
  };

  function setActive(href) {
    links.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === href);
    });
    featuresTrigger.classList.toggle("active", href === "features");
  }

  function syncActiveLink() {
    var featurePath = window.location.pathname.replace(/\/$/, "");
    var featureIsActive = featurePath.indexOf("/features/") === 0;

    setActive(featureIsActive ? "features" : (activeByHash[window.location.hash] || "/"));
    featuresMenuLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === featurePath);
    });
  }

  function openFeatures() {
    primaryNav.classList.add("features-menu-open");
    featuresNav.classList.add("is-open");
    featuresTrigger.setAttribute("aria-expanded", "true");
  }

  function closeFeatures(returnFocus) {
    if (returnFocus) featuresTrigger.focus();
    primaryNav.classList.remove("features-menu-open");
    featuresNav.classList.remove("is-open");
    featuresTrigger.setAttribute("aria-expanded", "false");
  }

  links.forEach(function (link) {
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
  featuresNav.addEventListener("focusin", openFeatures);
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
