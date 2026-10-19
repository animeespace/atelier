// Site d'Atelier : avertissement hors Windows, message après le clic sur « Télécharger », sommaire actif.
(() => {
  const ua = navigator.userAgent;
  const isWindows = /Windows NT/i.test(ua);
  if (!isWindows) {
    document.querySelectorAll(".js-not-windows").forEach((el) => { el.hidden = false; });
  }

  const toast = document.getElementById("toast");
  let timer = 0;
  const hide = () => {
    if (!toast) return;
    toast.classList.remove("show");
    setTimeout(() => { toast.hidden = true; }, 250);
  };
  const show = () => {
    if (!toast) return;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add("show"));
    clearTimeout(timer);
    timer = setTimeout(hide, 14000);
  };
  toast?.querySelector("button")?.addEventListener("click", hide);

  document.querySelectorAll(".js-download").forEach((link) => {
    link.addEventListener("click", () => {
      show();
      // Sur l'accueil : on fait défiler jusqu'aux étapes d'installation pendant le téléchargement.
      const steps = document.getElementById("installation");
      if (steps && document.body.classList.contains("home")) {
        setTimeout(() => {
          steps.scrollIntoView({ behavior: "smooth", block: "start" });
          steps.classList.add("highlight");
        }, 500);
      }
    });
  });

  // Sommaire des pages de documentation : met en avant la section affichée.
  const links = [...document.querySelectorAll('.doc-nav a[href^="#"]')];
  if (links.length && "IntersectionObserver" in window) {
    const byId = new Map(links.map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.remove("active"));
        byId.get(entry.target.id)?.classList.add("active");
      });
    }, { rootMargin: "-90px 0px -70% 0px" });
    byId.forEach((_a, id) => {
      const target = document.getElementById(id);
      if (target) observer.observe(target);
    });
  }
})();
