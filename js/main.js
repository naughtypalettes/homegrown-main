// Progressive enhancement only. The mobile nav (<details>/<summary>) and the
// FAQ accordions on sparks.html work without this script; it just closes the
// mobile nav automatically after a link is chosen or focus leaves it.
(function () {
  var mobileNav = document.querySelector(".mobile-nav");
  if (!mobileNav) return;

  mobileNav.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
      mobileNav.removeAttribute("open");
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && mobileNav.hasAttribute("open")) {
      mobileNav.removeAttribute("open");
    }
  });

  document.addEventListener("click", function (event) {
    if (mobileNav.hasAttribute("open") && !mobileNav.contains(event.target)) {
      mobileNav.removeAttribute("open");
    }
  });

  // Link groups (Explore / SPARKS / About) act as an accordion: opening one
  // closes the others so the panel stays short on small screens.
  var groups = mobileNav.querySelectorAll(".mobile-nav-group");
  groups.forEach(function (group) {
    group.addEventListener("toggle", function () {
      if (!group.open) return;
      groups.forEach(function (other) {
        if (other !== group) other.removeAttribute("open");
      });
    });
  });
})();

// Desktop nav dropdowns (Team, SPARKS): toggle on click, close on outside
// click or Escape, and close one when the other opens.
(function () {
  var dropdowns = document.querySelectorAll(".nav-dropdown");
  if (!dropdowns.length) return;

  function closeAll(except) {
    dropdowns.forEach(function (dd) {
      if (dd !== except) {
        dd.classList.remove("open");
        var t = dd.querySelector(".nav-dropdown-toggle");
        if (t) t.setAttribute("aria-expanded", "false");
      }
    });
  }

  dropdowns.forEach(function (dd) {
    var toggle = dd.querySelector(".nav-dropdown-toggle");
    if (!toggle) return;
    toggle.addEventListener("click", function (event) {
      event.stopPropagation();
      var willOpen = !dd.classList.contains("open");
      closeAll(dd);
      dd.classList.toggle("open", willOpen);
      toggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
    dd.addEventListener("click", function (event) {
      if (event.target.tagName === "A") closeAll(null);
    });
  });

  document.addEventListener("click", function () { closeAll(null); });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeAll(null);
  });
})();
