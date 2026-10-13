
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
   COOK1ETWIST — FLOATING CUBES
   ======================================== */

(() => {
    const canvas = document.getElementById("ambient-cubes");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    let width = 0;
    let height = 0;
    let cubes = [];
    let animationId;

    const colors = [
        "255, 125, 45",
        "255, 155, 65",
        "65, 135, 255",
        "80, 165, 255"
    ];

    function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = Math.min(
            32,
            Math.max(14, Math.floor((width * height) / 35000))
        );

        cubes = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            size: 3 + Math.random() * 8,
            speed: 0.12 + Math.random() * 0.28,
            drift: (Math.random() - 0.5) * 0.35,
            rotation: Math.random() * Math.PI,
            spin: (Math.random() - 0.5) * 0.008,
            alpha: 0.12 + Math.random() * 0.25,
            color: colors[Math.floor(Math.random() * colors.length)]
        }));
    }

    function drawCube(cube) {
        const s = cube.size;
        const x = cube.x;
        const y = cube.y;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(cube.rotation);
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(${cube.color}, ${cube.alpha})`;
        ctx.fillStyle = `rgba(${cube.color}, ${cube.alpha * 0.12})`;

        // Face avant
        ctx.fillRect(-s / 2, -s / 2, s, s);
        ctx.strokeRect(-s / 2, -s / 2, s, s);

        // Petites arêtes pour donner un aspect cubique
        ctx.beginPath();
        ctx.moveTo(-s / 2, -s / 2);
        ctx.lineTo(-s * 0.15, -s * 0.85);
        ctx.lineTo(s * 0.85, -s * 0.85);
        ctx.lineTo(s / 2, -s / 2);

        ctx.moveTo(s / 2, -s / 2);
        ctx.lineTo(s * 0.85, -s * 0.85);

        ctx.moveTo(s / 2, s / 2);
        ctx.lineTo(s * 0.85, s * 0.15);
        ctx.lineTo(s * 0.85, -s * 0.85);
        ctx.stroke();

        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (const cube of cubes) {
            drawCube(cube);

            if (!reducedMotion.matches) {
                cube.y -= cube.speed;
                cube.x += cube.drift;
                cube.rotation += cube.spin;

                if (cube.y < -20) {
                    cube.y = height + 20;
                    cube.x = Math.random() * width;
                }

                if (cube.x < -20) cube.x = width + 20;
                if (cube.x > width + 20) cube.x = -20;
            }
        }

        if (!reducedMotion.matches) {
            animationId = requestAnimationFrame(animate);
        }
    }

    function startAnimation() {
        if (animationId) cancelAnimationFrame(animationId);
        resizeCanvas();
        animate();
    }

    window.addEventListener("resize", startAnimation);
    startAnimation();
})();
