document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.page-wrapper');
  let currentPage = 1;
  const totalPages = 6; // Total de páginas (Home + 3 Noticias + Tabla + Form)
  let isAnimating = false;
  const animationDuration = 1000;

  /* === Detectar secciones para animar entrada === */
  const sections = document.querySelectorAll('.section');

  function updateSectionVisibility() {
    sections.forEach((sec, index) => {
      if (index + 1 === currentPage) {
        sec.classList.add('visible');
      } else {
        sec.classList.remove('visible');
      }
    });
  }

  /* Función principal para cambiar página */
  function changePage(delta, specificPage = null) {
    if (isAnimating) return;

    // Si nos pasan una página específica (desde el menú), usamos esa
    if (specificPage !== null) {
      currentPage = specificPage;
    } else {
      // Si no, usamos el delta (scroll/teclado)
      currentPage += delta;
    }

    // Límites
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;

    // Aplicar cambio al wrapper
    wrapper.setAttribute('data-page', currentPage);

    // Actualizar visibilidad y animaciones
    updateSectionVisibility();

    // Bloquear interacciones durante la animación
    isAnimating = true;
    setTimeout(() => (isAnimating = false), animationDuration);
  }

  /* === Eventos de Scroll (Mouse) === */
  window.addEventListener('wheel', (event) => {
    if (event.deltaY > 0) changePage(1);
    else if (event.deltaY < 0) changePage(-1);
  });

  /* === Eventos de Teclado === */
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') changePage(1);
    if (e.key === 'ArrowUp') changePage(-1);
  });

  /* === AÑADIDO: Funcionalidad del Menú de Navegación === */
  const navLinks = document.querySelectorAll('.main-nav a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // Evitar el salto brusco del ancla por defecto
      const targetPage = parseInt(link.getAttribute('data-target'));
      
      // Solo cambiar si no es la página actual
      if (targetPage !== currentPage) {
        changePage(0, targetPage);
      }
    });
  });

  /* Inicializar primera sección visible */
  updateSectionVisibility();
});