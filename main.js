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

  // ===== CHAT IA =====
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const chatMessages = document.getElementById('chatMessages');
  
  let conversationHistory = [];

  // Función para añadir un mensaje al chat
  function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'user-message' : 'bot-message';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // Scroll al último mensaje
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Función para mostrar el indicador de escritura
  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'bot-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = '<span></span><span></span><span></span>';
    
    typingDiv.appendChild(messageContent);
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Función para remover el indicador de escritura
  function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  // Función para enviar mensaje
  async function sendMessage() {
    const message = chatInput.value.trim();
    
    if (message === '') return;
    
    // Agregar mensaje del usuario
    addMessage(message, true);
    conversationHistory.push({ role: 'user', content: message });
    
    // Limpiar input
    chatInput.value = '';
    
    // Deshabilitar botón mientras procesa
    chatSendBtn.disabled = true;
    chatInput.disabled = true;
    
    // Mostrar indicador de escritura
    showTypingIndicator();
    
    try {
      // Llamar a la API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversationHistory: conversationHistory.slice(-10) // Solo últimos 10 mensajes
        }),
      });
      
      const data = await response.json();
      
      // Remover indicador de escritura
      removeTypingIndicator();
      
      if (data.success) {
        // Agregar respuesta del bot
        addMessage(data.reply, false);
        conversationHistory.push({ role: 'assistant', content: data.reply });
      } else {
        addMessage('Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.', false);
      }
      
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      removeTypingIndicator();
      addMessage('Lo siento, no pude conectarme al servidor. Verifica tu conexión e intenta nuevamente.', false);
    } finally {
      // Rehabilitar botón e input
      chatSendBtn.disabled = false;
      chatInput.disabled = false;
      chatInput.focus();
    }
  }

  // Event listeners para el chat
  if (chatSendBtn && chatInput) {
    chatSendBtn.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }
});
