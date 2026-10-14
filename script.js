
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

// Open and close the mobile navigation.
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Open navigation" : "Close navigation"
  );

  nav.classList.toggle("open", !isOpen);
});

// Close the mobile menu after choosing a section.
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
});

// Reveal content every time it enters the screen.
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Relance l'animation quand l'élément entre dans l'écran
          entry.target.classList.add("is-visible");
        } else {
          // Prépare l'élément pour la prochaine apparition
          entry.target.classList.remove("is-visible");
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

// Update the progress bar while scrolling.
const progressBar = document.getElementById("scrollProgress");

function updateScrollProgress() {
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress =
    scrollableHeight > 0
      ? (window.scrollY / scrollableHeight) * 100
      : 0;

  progressBar.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

// Keep the copyright year current.
document.getElementById("year").textContent = new Date().getFullYear();


/* ========================================
   COOK1ETWIST — FLOATING PARTICLES
   ======================================== */

(() => {
    function initParticles() {
        const canvas = document.getElementById("ambient-cubes");
        if (!canvas) {
            console.warn("Canvas #ambient-cubes introuvable dans index.html");
            return;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let particles = [];
        let animationId = null;

        const colors = [
            "255, 125, 45",
            "255, 155, 65",
            "65, 135, 255",
            "80, 165, 255"
        ];

        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const count = Math.min(
                90,
                Math.max(35, Math.floor(width * height / 15000))
            );

            particles = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: 1 + Math.random() * 2,
                speed: 0.2 + Math.random() * 0.45,
                drift: (Math.random() - 0.5) * 0.35,
                alpha: 0.35 + Math.random() * 0.55,
                color: colors[Math.floor(Math.random() * colors.length)]
            }));
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            for (const p of particles) {
                // Petit halo lumineux
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color}, ${p.alpha * 0.15})`;
                ctx.fill();

                // Centre de la particule
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
                ctx.fill();

                // Mouvement flottant
                p.y -= p.speed;
                p.x += p.drift;

                if (p.y < -10) {
                    p.y = height + 10;
                    p.x = Math.random() * width;
                }

                if (p.x < -10) p.x = width + 10;
                if (p.x > width + 10) p.x = -10;
            }

            animationId = requestAnimationFrame(animate);
        }

        function restart() {
            if (animationId !== null) {
                cancelAnimationFrame(animationId);
            }
            resize();
            animate();
        }

        window.addEventListener("resize", restart);
        restart();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initParticles);
    } else {
        initParticles();
    }
})();

/* ========================================
   COOK1ETWIST — BUILD GALLERIES
   ======================================== */

(() => {
  const galleries = {
    simulator: {
      title: "SIMULATOR WORLDS",
      images: [
        { src: "images/simulator/world-01.png", name: "WORLD 01" },
        { src: "images/simulator/world-02.png", name: "WORLD 02" },
        { src: "images/simulator/world-03.png", name: "WORLD 03" },
        { src: "images/simulator/world-04.png", name: "WORLD 04" }
      ]
    },

    lobbies: {
      title: "LOBBIES & ZONES",
      images: [
        { src: "images/lobbies/lobby-01.png", name: "LOBBY 01" },
        { src: "images/lobbies/lobby-02.png", name: "LOBBY 02" },
        { src: "images/lobbies/lobby-03.png", name: "LOBBY 03" },
        { src: "images/lobbies/lobby-04.png", name: "LOBBY 04" },
        { src: "images/lobbies/lobby-05.png", name: "LOBBY 05" },
        { src: "images/lobbies/lobby-06.png", name: "LOBBY 06" }
      ]
    },

    hybrid: {
      title: "HYBRID GAME PROJECT",
      images: [
        { src: "images/hybrid/project-01.png", name: "PROJECT 01" },
        { src: "images/hybrid/project-02.png", name: "PROJECT 02" }
      ]
    }
  };

  const modal = document.getElementById("galleryModal");
  if (!modal) return;

  const image = document.getElementById("galleryImage");
  const category = document.getElementById("galleryCategory");
  const imageName = document.getElementById("galleryImageName");
  const current = document.getElementById("galleryCurrent");
  const total = document.getElementById("galleryTotal");
  const progress = document.getElementById("galleryProgressBar");

  const closeButton = modal.querySelector(".gallery-close");
  const previousButton = modal.querySelector(".gallery-prev");
  const nextButton = modal.querySelector(".gallery-next");

  let activeGallery = null;
  let activeIndex = 0;
  let previousFocus = null;
  let imageRequest = 0;

  const formatNumber = (number) => String(number).padStart(2, "0");

  function displayImage() {
    const gallery = galleries[activeGallery];
    if (!gallery) return;

    const item = gallery.images[activeIndex];
    const requestId = ++imageRequest;

    image.classList.add("is-changing");

    const preload = new Image();

    preload.onload = () => {
      if (requestId !== imageRequest) return;

      image.src = item.src;
      image.alt = item.name + " — " + gallery.title;
      imageName.textContent = item.name;
      current.textContent = formatNumber(activeIndex + 1);
      total.textContent = formatNumber(gallery.images.length);

      progress.style.width =
        ((activeIndex + 1) / gallery.images.length * 100) + "%";

      requestAnimationFrame(() => {
        if (requestId === imageRequest) {
          image.classList.remove("is-changing");
        }
      });
    };

    preload.onerror = () => {
      if (requestId !== imageRequest) return;

      image.classList.remove("is-changing");
      console.error("Image introuvable :", item.src);
    };

    preload.src = item.src;
  }

  function openGallery(name) {
    const gallery = galleries[name];

    if (!gallery || gallery.images.length === 0) return;

    activeGallery = name;
    activeIndex = 0;
    previousFocus = document.activeElement;

    category.textContent = gallery.title;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("gallery-open");

    displayImage();
    closeButton.focus();
  }

  function closeGallery() {
    if (!activeGallery) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("gallery-open");

    activeGallery = null;
    imageRequest++;

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  function changeImage(direction) {
    if (!activeGallery) return;

    const images = galleries[activeGallery].images;

    activeIndex =
      (activeIndex + direction + images.length) % images.length;

    displayImage();
  }

  // Open a gallery by clicking its card.
  document.querySelectorAll("[data-gallery]").forEach((card) => {
    card.addEventListener("click", () => {
      openGallery(card.dataset.gallery);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openGallery(card.dataset.gallery);
      }
    });
  });

  // Previous and next images.
  previousButton.addEventListener("click", () => changeImage(-1));
  nextButton.addEventListener("click", () => changeImage(1));

  // Close buttons and background.
  modal.querySelectorAll("[data-gallery-close]").forEach((element) => {
    element.addEventListener("click", closeGallery);
  });

  // Keyboard controls.
  document.addEventListener("keydown", (event) => {
    if (!activeGallery) return;

    if (event.key === "Escape") {
      closeGallery();
    } else if (event.key === "ArrowLeft") {
      changeImage(-1);
    } else if (event.key === "ArrowRight") {
      changeImage(1);
    }
  });
})();

