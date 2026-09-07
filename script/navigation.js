(() => {
  const menuToggle = document.querySelector(".menu-toggle");
  const mainMenu = document.getElementById("menu-principale");
  if (!menuToggle || !mainMenu) return;

  const setMenuOpen = (isOpen) => {
    mainMenu.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Chiudi il menu" : "Apri il menu");
  };

  menuToggle.addEventListener("click", () => {
    setMenuOpen(!mainMenu.classList.contains("is-open"));
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mainMenu.classList.contains("is-open")) {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
  mainMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });
  const closeOutsideMenu = (event) => {
    if (!mainMenu.contains(event.target) && !menuToggle.contains(event.target)) {
      setMenuOpen(false);
    }
  };
  document.addEventListener("click", closeOutsideMenu);
  document.addEventListener("focusin", closeOutsideMenu);

  // Lo stesso limite di 760px è usato dai menu nei fogli CSS di pagina.
  const mobileMenu = window.matchMedia("(max-width: 760px)");
  mobileMenu.addEventListener("change", () => {
    const focusInMenu = mainMenu.contains(document.activeElement);
    setMenuOpen(false);
    if (focusInMenu) {
      (mobileMenu.matches ? menuToggle : mainMenu.querySelector("a"))?.focus();
    }
  });
})();
