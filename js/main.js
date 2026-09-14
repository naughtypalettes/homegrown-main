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
})();
