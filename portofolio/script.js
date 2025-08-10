// Wait DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  // Typed Text Effect
  const typedSpan = document.querySelector(".txt-typed");
  if (typedSpan) {
    const words = JSON.parse(typedSpan.dataset.words);
    let index = 0, letterIndex = 0, isDeleting = false;
    let delay = 150;
    function type() {
      let word = words[index];
      if (!isDeleting) {
        typedSpan.textContent = word.slice(0, letterIndex + 1);
        letterIndex++;
        if (letterIndex === word.length) {
          isDeleting = true;
          delay = 1500;
        } else {
          delay = 150;
        }
      } else {
        typedSpan.textContent = word.slice(0, letterIndex - 1);
        letterIndex--;
        if (letterIndex === 0) {
          isDeleting = false;
          index = (index + 1) % words.length;
          delay = 500;
        } else {
          delay = 80;
        }
      }
      setTimeout(type, delay);
    }
    type();
  }

  // Navigation active link on scroll
  const navLinks = document.querySelectorAll(".nav-link");
  function updateActiveNav() {
    let scrollPos = window.scrollY + window.innerHeight / 3;
    navLinks.forEach(link => {
      const section = document.querySelector(link.hash);
      if (section) {
        if (
          scrollPos >= section.offsetTop &&
          scrollPos < section.offsetTop + section.offsetHeight
        ) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      }
    });
  }
  updateActiveNav();
  window.addEventListener("scroll", updateActiveNav);

  // Smooth scrolling for nav links
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      // Close mobile nav if open
      if (window.innerWidth < 961) {
        navToggle(false);
      }
    });
  });

  // Nav burger toggle for mobile
  const navBurger = document.querySelector(".nav-burger");
  const nav = document.querySelector(".nav");
  navBurger.addEventListener("click", () => {
    const expanded = navBurger.getAttribute("aria-expanded") === "true";
    navToggle(!expanded);
  });

  function navToggle(show) {
    if (show) {
      nav.style.display = "flex";
      navBurger.setAttribute("aria-expanded", "true");
    } else {
      nav.style.display = "none";
      navBurger.setAttribute("aria-expanded", "false");
    }
  }

  // Reveal on scroll
  const reveals = document.querySelectorAll(".reveal");
  function revealOnScroll() {
    const windowHeight = window.innerHeight;
    reveals.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < windowHeight * 0.85) {
        el.classList.add("active");
      }
    });
  }
  revealOnScroll();
  window.addEventListener("scroll", revealOnScroll);

  // Simple tilt effect (mousemove)
  const tiltEls = document.querySelectorAll("[data-tilt]");
  tiltEls.forEach(el => {
    el.style.transition = "transform 0.3s ease";
    el.addEventListener("mousemove", e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 10;
      const rotateY = (x / rect.width) * 10;
      el.style.transform = `perspective(400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "perspective(400px) rotateX(0) rotateY(0) scale(1)";
    });
  });

  // Lightbox for work items
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbTitle = document.getElementById("lb-title");
  const lbClose = lightbox.querySelector(".lightbox-close");

  document.querySelectorAll(".work-item").forEach(item => {
    item.addEventListener("click", () => {
      const src = item.dataset.src;
      const title = item.dataset.title;
      if (src && title) {
        lbImg.src = src;
        lbTitle.textContent = title;
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        lbClose.focus();
      }
    });
  });

  function closeLightbox() {
    lightbox.setAttribute("aria-hidden", "true");
    lbImg.src = "";
    lbTitle.textContent = "";
    document.body.style.overflow = "";
  }

  lbClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && lightbox.getAttribute("aria-hidden") === "false") {
      closeLightbox();
    }
  });

  // Show all button - toggle visibility of all work items
  const showAllBtn = document.getElementById("showAll");
  let showingAll = false;
  showAllBtn.addEventListener("click", () => {
    showingAll = !showingAll;
    document.querySelectorAll(".work-item").forEach((item, idx) => {
      if (idx >= 4) {
        item.style.display = showingAll ? "block" : "none";
      }
    });
    showAllBtn.textContent = showingAll ? "Tutup Karya" : "Lihat Semua Karya";
  });

  // Initialize work items: hide beyond 4 initially
  document.querySelectorAll(".work-item").forEach((item, idx) => {
    if (idx >= 4) item.style.display = "none";
  });

  // Contact form simple validation and fake submission
  const contactForm = document.getElementById("contactForm");
  const formStatus = contactForm.querySelector(".form-status");

  contactForm.addEventListener("submit", e => {
    e.preventDefault();
    formStatus.textContent = "";
    const formData = new FormData(contactForm);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const message = formData.get("message").trim();

    if (!name || !email || !message) {
      formStatus.textContent = "Mohon isi semua kolom wajib dengan benar.";
      formStatus.style.color = "tomato";
      return;
    }
    if (!validateEmail(email)) {
      formStatus.textContent = "Email tidak valid.";
      formStatus.style.color = "tomato";
      return;
    }

    // Simulate sending
    formStatus.textContent = "Mengirim...";
    formStatus.style.color = "var(--accent)";
    setTimeout(() => {
      formStatus.textContent = "Pesan berhasil dikirim! Terima kasih.";
      contactForm.reset();
    }, 1500);
  });

  function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  // Update footer year
  document.getElementById("yr").textContent = new Date().getFullYear();
});
