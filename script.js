(function () {
  "use strict";

  /* Mobile menu toggle */
  var toggle = document.querySelector(".menu-toggle");
  var links = document.querySelector("nav.links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Active nav highlight on scroll */
  var navLinks = document.querySelectorAll("nav.links a[href^='#']");
  var sections = [];
  navLinks.forEach(function (a) {
    var id = a.getAttribute("href").slice(1);
    var el = document.getElementById(id);
    if (el) sections.push({ link: a, el: el });
  });

  if (sections.length && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var match = sections.find(function (s) { return s.el === entry.target; });
          if (!match) return;
          if (entry.isIntersecting) {
            sections.forEach(function (s) { s.link.classList.remove("active"); });
            match.link.classList.add("active");
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { navObserver.observe(s.el); });
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* Lightbox gallery */
  var galleryButtons = Array.prototype.slice.call(document.querySelectorAll(".screens button.shot"));
  var lightbox = document.getElementById("lightbox");
  if (galleryButtons.length && lightbox) {
    var lightboxImg = lightbox.querySelector("img");
    var closeBtn = lightbox.querySelector(".lightbox-close");
    var prevBtn = lightbox.querySelector(".lightbox-nav.prev");
    var nextBtn = lightbox.querySelector(".lightbox-nav.next");
    var currentIndex = 0;

    function showImage(index) {
      currentIndex = (index + galleryButtons.length) % galleryButtons.length;
      var btn = galleryButtons[currentIndex];
      var img = btn.querySelector("img");
      var full = btn.getAttribute("data-full") || img.getAttribute("src");
      lightboxImg.src = full;
      lightboxImg.alt = img.getAttribute("alt") || "";
    }

    function openLightbox(index) {
      showImage(index);
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      lightboxImg.src = "";
    }

    galleryButtons.forEach(function (btn, i) {
      btn.addEventListener("click", function () { openLightbox(i); });
    });

    closeBtn.addEventListener("click", closeLightbox);
    prevBtn.addEventListener("click", function () { showImage(currentIndex - 1); });
    nextBtn.addEventListener("click", function () { showImage(currentIndex + 1); });

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showImage(currentIndex - 1);
      if (e.key === "ArrowRight") showImage(currentIndex + 1);
    });

    /* swipe to close/navigate on touch */
    var touchStartX = 0;
    var touchStartY = 0;
    lightbox.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
    }, { passive: true });

    lightbox.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      var dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dy) > 80 && Math.abs(dy) > Math.abs(dx)) {
        closeLightbox();
      } else if (dx > 60) {
        showImage(currentIndex - 1);
      } else if (dx < -60) {
        showImage(currentIndex + 1);
      }
    }, { passive: true });
  }
})();
