(() => {
  const modal = document.querySelector(".order-modal");
  const openButtons = document.querySelectorAll("[data-order-open]");
  const closeButton = document.querySelector("[data-order-close]");
  let returnFocus = null;

  const focusableSelector =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const openModal = (trigger) => {
    if (!modal) return;
    returnFocus = trigger;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    requestAnimationFrame(() => closeButton?.focus());
  };

  const closeModal = () => {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    returnFocus?.focus();
  };

  openButtons.forEach((button) => {
    button.addEventListener("click", () => openModal(button));
  });

  closeButton?.addEventListener("click", closeModal);

  modal?.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (!modal || modal.hidden) return;

    if (event.key === "Escape") {
      closeModal();
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = [...modal.querySelectorAll(focusableSelector)].filter(
      (element) => !element.hasAttribute("hidden") && element.getAttribute("aria-hidden") !== "true",
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const filterButtons = document.querySelectorAll("[data-filter]");
  const menuCards = document.querySelectorAll("[data-menu-card]");
  const menuMore = document.querySelector("[data-menu-more]");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((candidate) => {
        const active = candidate === button;
        candidate.classList.toggle("is-active", active);
        candidate.setAttribute("aria-pressed", String(active));
      });

      menuCards.forEach((card, index) => {
        const visible = filter === "all" || card.dataset.category === filter;
        card.hidden = !visible;
        if (visible) card.style.setProperty("--delay", `${index * 45}ms`);
      });
      if (menuMore) menuMore.hidden = filter !== "all";
    });
  });

  document.querySelector("[data-back-to-top]")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
