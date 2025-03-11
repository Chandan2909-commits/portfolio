// Loading Screen
document.addEventListener('DOMContentLoaded', function() {
  // Show loading screen
  document.body.classList.remove('loaded');
  
  // Get start time to ensure minimum display time
  const startTime = new Date().getTime();
  const minDisplayTime = 2000; // minimum time to show loader (ms)
  
  // Function to hide loader after minimum time
  function hideLoader() {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;
    
    if (elapsedTime >= minDisplayTime) {
      // If enough time has passed, hide loader immediately
      document.body.classList.add('loaded');
      
      // Initialize rest of the scripts after loading
      initializePortfolio();
    } else {
      // Otherwise, wait for the remaining time
      const remainingTime = minDisplayTime - elapsedTime;
      setTimeout(function() {
        document.body.classList.add('loaded');
        
        // Initialize rest of the scripts after loading
        initializePortfolio();
      }, remainingTime);
    }
  }
  
  // Hide loader when page is fully loaded
  window.addEventListener('load', hideLoader);
  
  // Fallback in case 'load' event doesn't fire
  setTimeout(function() {
    if (!document.body.classList.contains('loaded')) {
      hideLoader();
    }
  }, 5000); // Max wait time of 5 seconds
});

// Main initialization function
function initializePortfolio() {
  // Detect device performance capabilities
  const isLowPerfDevice = checkLowPerformanceDevice();
  
  // Add class to body based on device performance
  if (isLowPerfDevice) {
    document.body.classList.add('low-perf-device');
  }
  
  // Initialize AOS (Animate On Scroll) with settings based on device capabilities
  AOS.init({
    duration: isLowPerfDevice ? 500 : 800,
    easing: 'ease-out',
    once: true,
    mirror: false,
    disable: 'mobile' // Disable animations on mobile for better performance
  });
  
  // Function to check if device is likely a low-performance device
  function checkLowPerformanceDevice() {
    // Check for mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Check for low memory (if available in browser)
    const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
    
    // Check for low CPU cores (if available)
    const hasLowCPUCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    
    // Return true if any of the conditions are met
    return isMobile || hasLowMemory || hasLowCPUCores;
  }

  // Resume Modal Functionality
  const resumeBtn = document.getElementById('resume-btn');
  const resumeModal = document.querySelector('.resume-modal');
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalClose = document.querySelector('.modal-close');
  const shareButtons = document.querySelectorAll('.share-btn');
  
  // Open modal
  resumeBtn.addEventListener('click', function(e) {
    e.preventDefault();
    document.body.classList.add('modal-open', 'modal-visible');
  });
  
  // Close modal when clicking the close button
  modalClose.addEventListener('click', function() {
    closeModal();
  });
  
  // Close modal when clicking outside of it
  modalOverlay.addEventListener('click', function() {
    closeModal();
  });
  
  // Prevent clicks inside modal from closing it
  resumeModal.addEventListener('click', function(e) {
    e.stopPropagation();
  });
  
  // Close modal with escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.body.classList.contains('modal-visible')) {
      closeModal();
    }
  });
  
  // Function to close the modal
  function closeModal() {
    document.body.classList.remove('modal-open', 'modal-visible');
  }
  
  // Share functionality
  shareButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const resumeUrl = 'Chandan\'s Resume.pdf';
      const fullUrl = window.location.href.split('#')[0] + resumeUrl;
      
      if (this.title === 'Share on LinkedIn') {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`, '_blank');
      } else if (this.title === 'Share via Email') {
        window.location.href = `mailto:?subject=Check out Chandan's Resume&body=Here's my resume: ${encodeURIComponent(fullUrl)}`;
      } else if (this.title === 'Copy Link') {
        navigator.clipboard.writeText(fullUrl).then(() => {
          // Show a temporary tooltip
          const tooltip = document.createElement('div');
          tooltip.classList.add('copy-tooltip');
          tooltip.textContent = 'Link copied!';
          this.appendChild(tooltip);
          
          setTimeout(() => {
            tooltip.remove();
          }, 2000);
        });
      }
    });
  });

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinksContainer = document.querySelector('.nav-links');
  const sections = document.querySelectorAll('section');
  
  // Handle mobile menu
  menuToggle.addEventListener('click', function() {
    navLinksContainer.classList.toggle('active');
    if (navLinksContainer.classList.contains('active')) {
      menuToggle.innerHTML = '<i class="fas fa-times"></i>';
      // Prevent body scrolling when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      document.body.style.overflow = 'auto';
    }
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    const isClickInsideNavbar = navbar.contains(event.target);
    
    if (!isClickInsideNavbar && navLinksContainer.classList.contains('active')) {
      navLinksContainer.classList.remove('active');
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      document.body.style.overflow = 'auto';
    }
  });

  // Close mobile menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (navLinksContainer.classList.contains('active')) {
        navLinksContainer.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = 'auto';
      }
    });
  });

  // Navbar scroll effect with performance optimization
  let lastScrollTop = 0;
  let scrollTimer;
  
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimer);
    
    scrollTimer = setTimeout(function() {
      const scrollTop = window.scrollY;
      
      // Add 'scrolled' class to navbar when page is scrolled
      if (scrollTop > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      // Highlight active menu item based on scroll position
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
      
      lastScrollTop = scrollTop;
    }, 50); // 50ms throttle for better performance
  });

  // Form validation and submission
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // Basic form validation
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;
      
      if (!name || !email || !subject || !message) {
        alert('Please fill out all fields in the form.');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      
      // Show success message (in a real scenario, you would handle the form submission to a server)
      const submitBtn = document.querySelector('.submit-btn');
      const originalBtnText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...';
      submitBtn.disabled = true;
      
      // Simulate form submission (remove this in a real application and use actual form submission)
      setTimeout(function() {
        contactForm.reset();
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        
        setTimeout(function() {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        }, 3000);
      }, 2000);
    });
  }

  // Smooth scroll for anchor links with mobile optimization
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Adjust offset based on screen size
        const offset = window.innerWidth <= 768 ? 70 : 80;
        
        window.scrollTo({
          top: targetElement.offsetTop - offset,
          behavior: 'smooth'
        });
      }
    });
  });

  // Better project card interaction for touch devices
  const projectCards = document.querySelectorAll('.project-card');
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  projectCards.forEach(card => {
    const cardFront = card.querySelector('.card-front');
    const cardBack = card.querySelector('.card-back');
    
    if (isTouchDevice) {
      // For touch devices, toggle on tap
      card.addEventListener('touchstart', function(e) {
        e.preventDefault();
        
        // Toggle visibility
        if (cardBack.style.visibility === 'visible') {
          cardFront.style.visibility = 'visible';
          cardFront.style.opacity = '1';
          cardBack.style.visibility = 'hidden';
          cardBack.style.opacity = '0';
        } else {
          cardFront.style.visibility = 'hidden';
          cardFront.style.opacity = '0';
          cardBack.style.visibility = 'visible';
          cardBack.style.opacity = '1';
        }
      });
      
      // Ensure links work on touch devices
      const links = card.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('touchstart', function(e) {
          e.stopPropagation();
        });
      });
    }
    
    // No need for mouse enter/leave handlers as CSS takes care of it for non-touch devices
  });

  // Back to top button with improved mobile UX
  const goTopBtn = document.querySelector('.go-top');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      goTopBtn.style.opacity = '1';
      goTopBtn.style.visibility = 'visible';
    } else {
      goTopBtn.style.opacity = '0';
      goTopBtn.style.visibility = 'hidden';
    }
  });
  
  // Add active touch feedback for mobile
  if (isTouchDevice) {
    const touchButtons = document.querySelectorAll('.primary-btn, .secondary-btn, .project-link, .submit-btn, .view-more-btn');
    
    touchButtons.forEach(button => {
      button.addEventListener('touchstart', function() {
        this.classList.add('touch-active');
      });
      
      button.addEventListener('touchend', function() {
        this.classList.remove('touch-active');
      });
      
      button.addEventListener('touchcancel', function() {
        this.classList.remove('touch-active');
      });
    });
  }

  // Add counter animation to statistics with reduced animation on mobile
  const statNumbers = document.querySelectorAll('.stat-number');
  
  function animateCounter(element, target) {
    // Simplify animation for mobile
    if (window.innerWidth <= 768) {
      element.textContent = target + (target.toString().includes('+') ? '' : '+');
      return;
    }
    
    let count = 0;
    const duration = 2000; // ms
    const interval = 50; // ms
    const step = target / (duration / interval);
    
    const counter = setInterval(function() {
      count += step;
      
      if (count >= target) {
        element.textContent = target + (target.toString().includes('+') ? '' : '+');
        clearInterval(counter);
      } else {
        element.textContent = Math.floor(count) + (target.toString().includes('+') ? '' : '+');
      }
    }, interval);
  }
  
  // Initialize counter animations when elements are in viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.textContent);
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  statNumbers.forEach(number => {
    observer.observe(number);
  });

  // Add a class to the body when JS is loaded
  document.body.classList.add('js-loaded');
  
  // Fix project card heights on mobile
  function adjustProjectCardHeights() {
    if (window.innerWidth <= 576) {
      const projectCards = document.querySelectorAll('.project-card');
      projectCards.forEach(card => {
        const imgHeight = card.querySelector('.card-image-container').offsetHeight;
        const infoHeight = card.querySelector('.card-info').offsetHeight;
        card.style.height = (imgHeight + infoHeight + 20) + 'px';
      });
    }
  }
  
  // Run on load and resize
  window.addEventListener('load', adjustProjectCardHeights);
  window.addEventListener('resize', adjustProjectCardHeights);
} 
