// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
  });
});

// Active Link highlighting on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (window.pageYOffset >= (sectionTop - 250)) {
      current = section.getAttribute('id');
    }
  });

  // Force 'contact' if scrolled to the absolute bottom of the page
  if (Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
    current = 'contact';
  }

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(current)) {
      link.classList.add('active');
    }
  });
});

// Modal Logic
const modal = document.getElementById('project-modal');
const closeModal = document.querySelector('.close-modal');
const detailButtons = document.querySelectorAll('.btn-details');

const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalTags = document.getElementById('modal-tags');
const modalCarousel = document.getElementById('modal-carousel');
const modalCarouselTrack = document.getElementById('modal-carousel-track');
const modalCarouselDots = document.getElementById('modal-carousel-dots');
const modalCarouselHint = document.getElementById('modal-carousel-hint');
const carouselPrev = document.getElementById('carousel-prev');
const carouselNext = document.getElementById('carousel-next');

let currentCarouselImages = [];
let currentCarouselIndex = 0;

const setCarouselIndex = (index) => {
  if (!currentCarouselImages.length) return;

  currentCarouselIndex = (index + currentCarouselImages.length) % currentCarouselImages.length;

  modalCarouselTrack.querySelectorAll('.carousel-slide').forEach((slide, slideIndex) => {
    slide.classList.toggle('active', slideIndex === currentCarouselIndex);
  });

  modalCarouselDots.querySelectorAll('.carousel-dot').forEach((dot, dotIndex) => {
    dot.classList.toggle('active', dotIndex === currentCarouselIndex);
    dot.setAttribute('aria-current', dotIndex === currentCarouselIndex ? 'true' : 'false');
  });
};

const renderCarousel = (images, title) => {
  currentCarouselImages = images.length ? images : [];
  currentCarouselIndex = 0;

  modalCarouselTrack.innerHTML = '';
  modalCarouselDots.innerHTML = '';

  currentCarouselImages.forEach((image, index) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';

    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt || `${title} - imagem ${index + 1}`;
    slide.appendChild(img);
    modalCarouselTrack.appendChild(slide);

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Ir para a imagem ${index + 1}`);
    dot.addEventListener('click', () => setCarouselIndex(index));
    modalCarouselDots.appendChild(dot);
  });

  const hasMultipleImages = currentCarouselImages.length > 1;
  carouselPrev.hidden = !hasMultipleImages;
  carouselNext.hidden = !hasMultipleImages;
  modalCarouselDots.hidden = !hasMultipleImages;
  modalCarouselHint.hidden = !hasMultipleImages;

  setCarouselIndex(0);
};

const closeProjectModal = () => {
  modal.classList.remove('show');
};

detailButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    // get parent card
    const card = e.target.closest('.project-card');
    if (!card) return;

    // extract data
    const title = card.getAttribute('data-title');
    const imgSrc = card.getAttribute('data-img');
    const tagsStr = card.getAttribute('data-tags');
    
    const detailsDiv = card.querySelector('.project-details');
    let detailsHtml = card.getAttribute('data-desc') || '';
    let galleryImages = [];

    if (detailsDiv) {
      const detailsClone = detailsDiv.cloneNode(true);
      galleryImages = Array.from(detailsClone.querySelectorAll('.project-gallery img')).map((img) => ({
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt') || title,
      }));

      const gallery = detailsClone.querySelector('.project-gallery');
      if (gallery) gallery.remove();

      detailsHtml = detailsClone.innerHTML;
    }

    if (!galleryImages.length && imgSrc) {
      galleryImages = [{ src: imgSrc, alt: title }];
    }

    // inject data
    modalTitle.textContent = title;
    modalDesc.innerHTML = detailsHtml;
    renderCarousel(galleryImages, title);
    
    // clear and inject tags
    modalTags.innerHTML = '';
    if (tagsStr) {
      const tagsArray = tagsStr.split(',');
      tagsArray.forEach(t => {
        const span = document.createElement('span');
        span.textContent = t.trim();
        modalTags.appendChild(span);
      });
    }

    // show modal
    modal.classList.add('show');
  });
});

carouselPrev.addEventListener('click', () => setCarouselIndex(currentCarouselIndex - 1));
carouselNext.addEventListener('click', () => setCarouselIndex(currentCarouselIndex + 1));

closeModal.addEventListener('click', closeProjectModal);

// close modal on outside click
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeProjectModal();
  }
});

window.addEventListener('keydown', (e) => {
  if (!modal.classList.contains('show')) return;

  if (e.key === 'Escape') {
    closeProjectModal();
  }

  if (e.key === 'ArrowLeft' && currentCarouselImages.length > 1) {
    setCarouselIndex(currentCarouselIndex - 1);
  }

  if (e.key === 'ArrowRight' && currentCarouselImages.length > 1) {
    setCarouselIndex(currentCarouselIndex + 1);
  }
});
