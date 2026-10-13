/**
 * Personal Portfolio Website - JavaScript
 * Author: Shristi Chaturvedi
 * College: JECRC University | B.Tech CSE Core (Section K)
 * Description: Interactive functionality including theme toggle, dynamic typing,
 * project filters, modals, mobile navigation, and contact form validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. THEME TOGGLE (Dark / Light Mode)
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;

  // Retrieve saved theme or default to system / dark preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme) {
    rootElement.setAttribute('data-theme', savedTheme);
  } else if (systemPrefersLight) {
    rootElement.setAttribute('data-theme', 'light');
  } else {
    rootElement.setAttribute('data-theme', 'dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      rootElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    });
  }

  // ==========================================================================
  // 2. DYNAMIC TYPING EFFECT
  // ==========================================================================
  const typingElement = document.getElementById('typing-text');
  const roles = [
    'Aspiring Software Engineer',
    'B.Tech CSE Core Student',
    'JECRC University • Section K',
    'Tech & Coding Enthusiast'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeEffect() {
    if (!typingElement) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before new word
    }

    setTimeout(typeEffect, typingSpeed);
  }

  // Initialize typing effect
  typeEffect();

  // ==========================================================================
  // 3. NAVBAR SCROLL EFFECT & SCROLLSPY (ACTIVE NAV LINK)
  // ==========================================================================
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('back-to-top');

  function handleScroll() {
    const scrollPosition = window.scrollY;

    // Navbar background blur & shadow on scroll
    if (navbarWrapper) {
      if (scrollPosition > 40) {
        navbarWrapper.classList.add('scrolled');
      } else {
        navbarWrapper.classList.remove('scrolled');
      }
    }

    // Floating Back to Top Button visibility
    if (backToTopBtn) {
      if (scrollPosition > 350) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }

    // Scrollspy: update active nav link
    let currentSectionId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });

      mobileNavLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Back to top click handler
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================================================
  // 4. MOBILE NAVIGATION DRAWER
  // ==========================================================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');

  function toggleMobileMenu() {
    if (!mobileDrawer || !mobileMenuBtn) return;
    const isOpen = mobileDrawer.classList.contains('open');

    if (isOpen) {
      mobileDrawer.classList.remove('open');
      mobileMenuBtn.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    } else {
      mobileDrawer.classList.add('open');
      mobileMenuBtn.classList.add('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile drawer when any link inside is clicked
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  // Close drawer if user clicks outside
  document.addEventListener('click', (event) => {
    if (
      mobileDrawer &&
      mobileDrawer.classList.contains('open') &&
      !mobileDrawer.contains(event.target) &&
      !mobileMenuBtn.contains(event.target)
    ) {
      toggleMobileMenu();
    }
  });

  // ==========================================================================
  // 5. PROJECTS FILTERING
  // ==========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Toggle active filter button
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('hidden');
          // Subtle fade-in animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ==========================================================================
  // 6. INTERACTIVE PROJECT DETAILS MODAL
  // ==========================================================================
  const projectData = {
    portfolio: {
      title: 'Personal Portfolio Website',
      category: 'Web Development',
      description:
        'A comprehensive personal website designed for Shristi Chaturvedi, a first-year B.Tech CSE Core student at JECRC University, showcasing academic credentials, skills (HTML, Python, Java, C), projects, and interests.',
      features: [
        'Pure semantic HTML5, CSS3 Custom Properties & vanilla JavaScript.',
        'Seamless Dark & Light mode toggle with user preference persistence in localStorage.',
        'Fully responsive mobile-first grid and flexbox layout across all screen sizes.',
        'Interactive project filters, accessible modals, and animated typing headlines.',
        'Client-side contact form validation with toast notifications.'
      ],
      tech: ['HTML', 'CSS3 Variables', 'Vanilla JavaScript', 'Responsive Design'],
      repoLink: 'https://github.com/shriisstiee-bae/my-portfolio'
    },
    cgpa: {
      title: 'Student Grade & CGPA Calculator',
      category: 'Academic & Core Tool',
      description:
        'An academic utility created to help college students compute semester grade points (SGPA) and cumulative GPA (CGPA) accurately based on university credit evaluation schemes.',
      features: [
        'Supports subject credit allocations and grade scale mappings.',
        'Computes weighted averages for theory and practical laboratory courses.',
        'Optionally outputs detailed grade sheets and saves records to a local file/storage.',
        'Provides goal-forecasting to calculate minimum grades required in upcoming semesters.'
      ],
      tech: ['Python', 'C', 'Logic Formulation', 'File Handling'],
      repoLink: 'https://github.com/shriisstiee-bae/student-grade-calculator'
    },
    quiz: {
      title: 'CS Fundamentals Quiz App',
      category: 'Interactive Mini Web App',
      description:
        'An engaging web quiz platform built to review computer science and programming basics including C syntax, Python logic, and computing foundations.',
      features: [
        'Dynamic question loading with randomized options and interactive countdown timer.',
        'Instant response feedback with explanations for correct and incorrect answers.',
        'Scorecard summary displaying final accuracy percentage and review breakdown.',
        'Clean, responsive user interface with animated progress indicators.'
      ],
      tech: ['HTML', 'CSS3', 'JavaScript DOM', 'LocalStorage'],
      repoLink: 'https://github.com/shriisstiee-bae/cs-fundamentals-quiz'
    },
    dsa: {
      title: 'Algorithm & Problem Solving Vault',
      category: 'Core Algorithms & DSA',
      description:
        'A structured repository containing clean implementations of fundamental algorithms and solutions in C, Java, and Python solving algorithmic challenges.',
      features: [
        'Data structure implementations: Arrays, Strings, Stacks, Queues, and Linked Lists.',
        'Core algorithms: Binary Search, Two Pointers, Bubble/Insertion/Merge Sort, Recursion.',
        'Detailed Big-O time and space complexity notes for each solution.',
        'Standard test suites and edge-case handling for practice.'
      ],
      tech: ['C', 'Java', 'Python', 'Algorithms'],
      repoLink: 'https://github.com/shriisstiee-bae/dsa-practice-vault'
    }
  };

  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTag = document.getElementById('modal-tag');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalFooter = document.getElementById('modal-footer');
  const modalTriggers = document.querySelectorAll('.project-modal-trigger');

  function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data || !projectModal) return;

    modalTag.textContent = data.category;
    modalTitle.textContent = data.title;

    // Build Modal Body
    let bodyHtml = `<p>${data.description}</p>`;
    bodyHtml += `<h4>Key Highlights &amp; Features:</h4><ul>`;
    data.features.forEach((feature) => {
      bodyHtml += `<li>${feature}</li>`;
    });
    bodyHtml += `</ul>`;

    bodyHtml += `<h4>Technologies Used:</h4><div class="tags-group">`;
    data.tech.forEach((tech) => {
      bodyHtml += `<span class="tech-tag">${tech}</span>`;
    });
    bodyHtml += `</div>`;

    modalBody.innerHTML = bodyHtml;

    // Build Modal Footer
    modalFooter.innerHTML = `
      <a href="${data.repoLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
        <span>GitHub Repository</span>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </a>
      <button class="btn btn-secondary btn-sm" id="modal-cancel-btn">Close</button>
    `;

    const cancelBtn = document.getElementById('modal-cancel-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', closeProjectModal);
    }

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  modalTriggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      openProjectModal(projectId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (event) => {
      if (event.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && projectModal && projectModal.classList.contains('open')) {
      closeProjectModal();
    }
  });

  // ==========================================================================
  // 7. CONTACT FORM VALIDATION & INTERACTIVE SUBMISSION
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const subjectInput = document.getElementById('form-subject');
  const messageInput = document.getElementById('form-message');
  const submitBtn = document.getElementById('submit-btn');

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function setFieldError(input, hasError) {
    const parentGroup = input.closest('.form-group');
    if (!parentGroup) return;
    if (hasError) {
      parentGroup.classList.add('has-error');
    } else {
      parentGroup.classList.remove('has-error');
    }
  }

  // Real-time error removal on input
  [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('input', () => {
      setFieldError(input, false);
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        setFieldError(nameInput, true);
        isValid = false;
      } else {
        setFieldError(nameInput, false);
      }

      // Validate Email
      if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
        setFieldError(emailInput, true);
        isValid = false;
      } else {
        setFieldError(emailInput, false);
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        setFieldError(subjectInput, true);
        isValid = false;
      } else {
        setFieldError(subjectInput, false);
      }

      // Validate Message (at least 10 chars)
      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        setFieldError(messageInput, true);
        isValid = false;
      } else {
        setFieldError(messageInput, false);
      }

      if (!isValid) {
        showToast('Please correct the highlighted fields.', 'info');
        return;
      }

      // Simulated form submission with loading state
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }

        contactForm.reset();
        showToast('Thank you! Your message has been sent successfully.', 'success');
      }, 1200);
    });
  }

  // ==========================================================================
  // 8. COPY EMAIL BUTTON & RESUME CTA
  // ==========================================================================
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailLink = document.getElementById('email-link');

  if (copyEmailBtn && emailLink) {
    copyEmailBtn.addEventListener('click', () => {
      const emailText = emailLink.textContent.trim();
      navigator.clipboard.writeText(emailText)
        .then(() => {
          showToast(`Copied to clipboard: ${emailText}`, 'success');
        })
        .catch(() => {
          // Fallback if clipboard API is restricted
          showToast(`Email: ${emailText}`, 'info');
        });
    });
  }

  const resumeBtn = document.getElementById('download-resume-btn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      showToast('Resume placeholder: Link your PDF file in index.html!', 'info');
    });
  }

  // ==========================================================================
  // 9. DYNAMIC COPYRIGHT YEAR
  // ==========================================================================
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ==========================================================================
  // 10. TOAST NOTIFICATION HELPER
  // ==========================================================================
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>`;
    } else {
      iconSvg = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, 300);
    }, 3200);
  }
});
