// Menú hamburguesa móvil
document.addEventListener('DOMContentLoaded', function() {
  const navToggler = document.querySelector('.navbar-toggler');
  const navCollapse = document.getElementById('navbarNavAltMarkup');
  const navLinks = document.querySelectorAll('.nav-link-custom');
  const btnCloseMenu = document.querySelector('.btn-close-menu');
  const body = document.body;

  // Función para abrir menú
  function openMenu() {
    navCollapse.classList.add('show');
    body.classList.add('menu-open');
    navToggler.setAttribute('aria-expanded', 'true');
  }

  // Función para cerrar menú
  function closeMenu() {
    navCollapse.classList.remove('show');
    body.classList.remove('menu-open');
    navToggler.setAttribute('aria-expanded', 'false');
  }

  // Toggle menú hamburguesa
  navToggler.addEventListener('click', function() {
    if (navCollapse.classList.contains('show')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Cerrar con botón de cerrar
  if (btnCloseMenu) {
    btnCloseMenu.addEventListener('click', closeMenu);
  }

  // Cerrar menú al hacer clic en un enlace
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Cerrar menú al hacer clic en el overlay
  body.addEventListener('click', function(event) {
    if (body.classList.contains('menu-open') && 
        !navCollapse.contains(event.target) && 
        !navToggler.contains(event.target)) {
      closeMenu();
    }
  });

  // Smooth scroll para las secciones
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Modal para diplomas
  const diplomaModal = document.getElementById('diplomaModal');
  const modalImage = document.getElementById('modalImage');
  const closeModal = document.getElementById('closeModal');
  const diplomaImages = document.querySelectorAll('.diplomas-grid img');

  // Abrir modal al hacer clic en una imagen de diploma
  diplomaImages.forEach(img => {
    img.addEventListener('click', function() {
      diplomaModal.classList.add('active');
      modalImage.src = this.src;
      modalImage.alt = this.alt;
      document.body.style.overflow = 'hidden'; // Prevenir scroll
    });
  });

  // Cerrar modal
  function closeDiplomaModal() {
    diplomaModal.classList.remove('active');
    document.body.style.overflow = ''; // Restaurar scroll
  }

  closeModal.addEventListener('click', closeDiplomaModal);

  // Cerrar modal al hacer clic fuera de la imagen
  diplomaModal.addEventListener('click', function(e) {
    if (e.target === diplomaModal) {
      closeDiplomaModal();
    }
  });

  // Cerrar modal con tecla Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && diplomaModal.classList.contains('active')) {
      closeDiplomaModal();
    }
  });
});
