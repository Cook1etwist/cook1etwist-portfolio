
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

// Reveal content as it enters the screen.
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
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

