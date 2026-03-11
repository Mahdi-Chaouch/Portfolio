document.addEventListener("DOMContentLoaded", () => {
  // Lucide Icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // Menu hamburger (mobile)
  const navToggle = document.querySelector(".nav-toggle");
  const navListWrap = document.querySelector(".nav-list-wrap");
  const mainNav = document.querySelector(".main-nav");
  const headerInner = mainNav ? mainNav.parentElement : null;
  if (navToggle && navListWrap && mainNav && headerInner) {
    function openNav() {
      document.body.classList.add("nav-open");
      document.body.appendChild(mainNav);
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Fermer le menu");
      // #region agent log
      requestAnimationFrame(() => {
        const rNav = mainNav ? mainNav.getBoundingClientRect() : null;
        const rToggle = navToggle.getBoundingClientRect();
        const rWrap = navListWrap.getBoundingClientRect();
        const csNav = mainNav ? getComputedStyle(mainNav) : null;
        const csToggle = getComputedStyle(navToggle);
        const header = mainNav ? mainNav.closest(".site-header") : null;
        const headerRect = header ? header.getBoundingClientRect() : null;
        const payload = {
          sessionId: "78cdad",
          location: "main.js:openNav",
          message: "menu opened",
          data: {
            viewport: { w: window.innerWidth, h: window.innerHeight },
            mainNavRect: rNav ? { top: rNav.top, left: rNav.left, width: rNav.width, height: rNav.height } : null,
            navToggleRect: { top: rToggle.top, left: rToggle.left, width: rToggle.width, height: rToggle.height },
            navListWrapRect: { top: rWrap.top, left: rWrap.left, width: rWrap.width, height: rWrap.height },
            headerRect: headerRect ? { top: headerRect.top, left: headerRect.left, width: headerRect.width, height: headerRect.height } : null,
            mainNavPosition: csNav ? csNav.position : null,
            mainNavZIndex: csNav ? csNav.zIndex : null,
            navToggleZIndex: csToggle.zIndex
          },
          timestamp: Date.now(),
          hypothesisId: "H1-H5"
        };
        fetch("http://127.0.0.1:7375/ingest/6fb74847-7909-4675-b926-89f5fdaa0f42", { method: "POST", headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "78cdad" }, body: JSON.stringify(payload) }).catch(() => {});
      });
      // #endregion
    }
    function closeNav() {
      document.body.classList.remove("nav-open");
      headerInner.appendChild(mainNav);
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Ouvrir le menu");
    }
    navToggle.addEventListener("click", () => {
      if (document.body.classList.contains("nav-open")) {
        closeNav();
      } else {
        openNav();
      }
    });
    navListWrap.addEventListener("click", (e) => {
      if (e.target === navListWrap) {
        closeNav();
      }
    });
    document.querySelectorAll(".main-nav a").forEach((link) => {
      link.addEventListener("click", () => {
        /* fermer le menu après un court délai pour laisser la navigation se faire */
        setTimeout(closeNav, 0);
      });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
        closeNav();
      }
    });
  }

  // Bouton « Revenir en haut » (affiché au défilement)
  const backToTop = document.createElement("button");
  backToTop.type = "button";
  backToTop.className = "back-to-top";
  backToTop.setAttribute("aria-label", "Revenir en haut de la page");
  backToTop.innerHTML = "↑";
  document.body.appendChild(backToTop);

  const scrollThreshold = 300;
  function updateBackToTop() {
    if (window.scrollY > scrollThreshold) {
      backToTop.classList.add("is-visible");
    } else {
      backToTop.classList.remove("is-visible");
    }
  }
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || !targetId.startsWith("#")) return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      event.preventDefault();

      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }

  // Exemple de structure pour gérer tes projets plus tard en JS.
  // Tu pourras soit lier ces données aux cartes HTML existantes,
  // soit générer automatiquement les cartes à partir de ce tableau.
  const projects = [
    {
      title: "Dashboard étudiant",
      description:
        "Interface web pour suivre les cours, les notes et les tâches à rendre.",
      technologies: ["HTML", "CSS", "JavaScript"],
      url: "#",
    },
    {
      title: "Portfolio minimal",
      description:
        "Site responsive pour présenter un profil, des compétences et quelques projets.",
      technologies: ["HTML", "CSS Grid"],
      url: "#",
    },
    {
      title: "Application de tâches",
      description:
        "Application de to‑do list pour gérer les tâches quotidiennes.",
      technologies: ["JavaScript", "LocalStorage"],
      url: "#",
    },
  ];

  // window.portfolioProjects = projects; // Décommente si tu veux y accéder dans la console.

  // Animations d'apparition au chargement (stagger léger)
  const animatedElements = [];

  const heroContent = document.querySelector(".hero-content");
  const heroVisual = document.querySelector(".hero-visual");

  if (heroContent) animatedElements.push(heroContent);
  if (heroVisual) animatedElements.push(heroVisual);

  const projectSectionHeader = document.querySelector(
    ".section-projects .section-header",
  );
  if (projectSectionHeader) animatedElements.push(projectSectionHeader);

  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach((card) => animatedElements.push(card));

  const aboutText = document.querySelector(".section-about .about-text");
  const aboutSkills = document.querySelector(".section-about .about-skills");
  if (aboutText) animatedElements.push(aboutText);
  if (aboutSkills) animatedElements.push(aboutSkills);

  const footerContact = document.querySelector(".footer-contact");
  const footerCopy = document.querySelector(".footer-copy");
  if (footerContact) animatedElements.push(footerContact);
  if (footerCopy) animatedElements.push(footerCopy);

  animatedElements.forEach((el, index) => {
    const delay = 0.12 * index;
    el.classList.add("animate-on-load");
    el.style.animationDelay = `${delay}s`;
  });

  // Page À propos : fade-in des sections au scroll
  const aboutReveals = document.querySelectorAll(".about-reveal");
  if (aboutReveals.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.05 }
    );
    aboutReveals.forEach((section) => observer.observe(section));
  }

  // Page d'accueil : fade-in des sections au scroll
  const sectionReveals = document.querySelectorAll(".section-reveal");
  if (sectionReveals.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { rootMargin: "0px 0px -50px 0px", threshold: 0.08 }
    );
    sectionReveals.forEach((section) => revealObserver.observe(section));
  }

  // Page Contact : validation simple du formulaire (front uniquement)
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    const successEl = contactForm.querySelector(".contact-form-success");

    function setFieldError(fieldName, message) {
      const input = contactForm.querySelector(`[name="${fieldName}"]`);
      const errorEl = contactForm.querySelector(
        `.contact-form-error[data-field="${fieldName}"]`
      );
      if (!input || !errorEl) return;
      if (message) {
        input.setAttribute("aria-invalid", "true");
        errorEl.textContent = message;
      } else {
        input.removeAttribute("aria-invalid");
        errorEl.textContent = "";
      }
    }

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (successEl) {
        successEl.textContent = "";
      }

      const formData = new FormData(contactForm);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const subject = String(formData.get("subject") || "").trim();
      const message = String(formData.get("message") || "").trim();

      let hasError = false;

      // #region agent log
      fetch("http://127.0.0.1:7375/ingest/6fb74847-7909-4675-b926-89f5fdaa0f42", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "2a0d40",
        },
        body: JSON.stringify({
          sessionId: "2a0d40",
          runId: "contact-form",
          hypothesisId: "H1",
          location: "main.js:contact-submit:start",
          message: "Contact form submit start",
          data: {
            nameLength: name.length,
            hasEmail: Boolean(email),
            subjectLength: subject.length,
            hasMessage: Boolean(message),
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion

      if (!name) {
        setFieldError("name", "Le nom est obligatoire.");
        hasError = true;
      } else {
        setFieldError("name", "");
      }

      if (!email) {
        setFieldError("email", "L’email est obligatoire.");
        hasError = true;
      } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
          setFieldError("email", "Merci d’indiquer un email valide.");
          hasError = true;
        } else {
          setFieldError("email", "");
        }
      }

      if (!subject) {
        setFieldError("subject", "Le sujet est obligatoire.");
        hasError = true;
      } else {
        setFieldError("subject", "");
      }

      if (!message) {
        setFieldError("message", "Le message est obligatoire.");
        hasError = true;
      } else {
        setFieldError("message", "");
      }

      if (hasError) return;

      try {
        // #region agent log
        fetch("http://127.0.0.1:7375/ingest/6fb74847-7909-4675-b926-89f5fdaa0f42", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "2a0d40",
          },
          body: JSON.stringify({
            sessionId: "2a0d40",
            runId: "contact-form",
            hypothesisId: "H2",
            location: "main.js:contact-submit:before-fetch",
            message: "Contact form about to call /api/contact",
            data: {
              nameLength: name.length,
              emailDomain: email.includes("@") ? email.split("@")[1] : null,
              subjectLength: subject.length,
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion

        const res = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, subject, message }),
        });

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        // #region agent log
        fetch("http://127.0.0.1:7375/ingest/6fb74847-7909-4675-b926-89f5fdaa0f42", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "2a0d40",
          },
          body: JSON.stringify({
            sessionId: "2a0d40",
            runId: "contact-form",
            hypothesisId: "H3",
            location: "main.js:contact-submit:after-fetch",
            message: "Contact form fetch success",
            data: {
              status: 200,
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion

        contactForm.reset();
        if (successEl) {
          successEl.textContent =
            "Merci pour votre message ! Votre email a bien été envoyé.";
          window.setTimeout(() => {
            if (successEl.textContent) {
              successEl.textContent = "";
            }
          }, 4000);
        }
      } catch (error) {
        // #region agent log
        fetch("http://127.0.0.1:7375/ingest/6fb74847-7909-4675-b926-89f5fdaa0f42", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "2a0d40",
          },
          body: JSON.stringify({
            sessionId: "2a0d40",
            runId: "contact-form",
            hypothesisId: "H4",
            location: "main.js:contact-submit:catch",
            message: "Contact form fetch error",
            data: {
              errorMessage: error instanceof Error ? error.message : String(error),
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion

        if (successEl) {
          successEl.textContent =
            "Une erreur est survenue lors de l’envoi. Merci de réessayer plus tard.";
        } else {
          // Fallback minimal si l’élément de succès n’existe pas
          alert(
            "Une erreur est survenue lors de l’envoi. Merci de réessayer plus tard.",
          );
        }
      }
    });
  }
});
