// Axle IA - Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // ======================
    // NAVIGATION FUNCTIONALITY
    // ======================
    
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });
    }
    
    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // ======================
    // SMOOTH SCROLLING
    // ======================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ======================
    // HEADER SCROLL EFFECTS
    // ======================
    
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        // Add/remove scrolled class for styling
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    }
    
    window.addEventListener('scroll', updateHeader, { passive: true });
    
    // ======================
    // REGION MANAGEMENT
    // ======================
    
    const regionSelector = document.getElementById('regionSelector');
    const savedRegion = localStorage.getItem('selectedRegion') || 'dubai';
    
    // Set initial region
    if (regionSelector) {
        regionSelector.value = savedRegion;
        updateRegionContent(savedRegion);
        
        regionSelector.addEventListener('change', function() {
            const selectedRegion = this.value;
            localStorage.setItem('selectedRegion', selectedRegion);
            updateRegionContent(selectedRegion);
        });
    }
    
    function updateRegionContent(region) {
        const dubaiContent = document.querySelectorAll('.dubai-content');
        const ciContent = document.querySelectorAll('.ci-content');
        
        dubaiContent.forEach(el => {
            el.style.display = region === 'dubai' ? 'block' : 'none';
            if (region === 'dubai') {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
        
        ciContent.forEach(el => {
            el.style.display = region === 'ci' ? 'block' : 'none';
            if (region === 'ci') {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    }
    
    // ======================
    // MODAL FUNCTIONALITY
    // ======================
    
    const contactModal = document.getElementById('contactModal');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const newsletterBtn = document.getElementById('newsletterBtn');
    const closeModal = document.getElementById('closeModal');
    const contactForm = document.getElementById('contactForm');
    
    // Open contact modal
    function openContactModal() {
        if (contactModal) {
            contactModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            // Focus on first input for accessibility
            setTimeout(() => {
                const firstInput = contactModal.querySelector('input');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    }
    
    // Close contact modal
    function closeContactModal() {
        if (contactModal) {
            contactModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', openContactModal);
    }
    
    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', openContactModal);
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', closeContactModal);
    }
    
    // Close modal when clicking outside
    if (contactModal) {
        contactModal.addEventListener('click', function(e) {
            if (e.target === contactModal) {
                closeContactModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && contactModal && contactModal.style.display === 'block') {
            closeContactModal();
        }
    });
    
    // ======================
    // FORM SUBMISSION
    // ======================
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                company: document.getElementById('company').value,
                message: document.getElementById('message').value,
                region: regionSelector ? regionSelector.value : 'dubai',
                language: localStorage.getItem('selectedLanguage') || 'en'
            };
            
            // Submit to ClickUp (function defined in clickup-integration.js)
            if (window.submitToClickUp) {
                window.submitToClickUp(formData);
            } else {
                console.error('ClickUp integration not loaded');
                alert('Error: Form submission not configured. Please contact hello@axle-ia.com directly.');
            }
        });
    }
    
    // ======================
    // SCROLL ANIMATIONS
    // ======================
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.service-card, .process-step, .mission-content').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
    
    // ======================
    // COUNTER ANIMATIONS
    // ======================
    
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
            const suffix = counter.textContent.replace(/[0-9]/g, '');
            let current = 0;
            const increment = target / 100;
            const duration = 2000;
            const stepTime = duration / 100;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current) + suffix;
                }
            }, stepTime);
        });
    }
    
    // Trigger counter animation when mission section is visible
    const missionSection = document.querySelector('.mission');
    if (missionSection) {
        const missionObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    missionObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        missionObserver.observe(missionSection);
    }
    
    // ======================
    // PERFORMANCE OPTIMIZATIONS
    // ======================
    
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
    
    // ======================
    // ERROR HANDLING
    // ======================
    
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        // Could send to analytics service here
    });
    
    // ======================
    // ACCESSIBILITY IMPROVEMENTS
    // ======================
    
    // Keyboard navigation for custom elements
    document.querySelectorAll('.cta-button, .nav-link').forEach(element => {
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                element.click();
            }
        });
    });
    
    // Focus management for modal
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    function trapFocus(element) {
        const focusable = element.querySelectorAll(focusableElements);
        const firstFocusable = focusable[0];
        const lastFocusable = focusable[focusable.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
    
    if (contactModal) {
        trapFocus(contactModal);
    }
    
    // ======================
    // UTILS
    // ======================
    
    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Throttle function for scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Apply throttle to scroll events
    window.addEventListener('scroll', throttle(updateHeader, 10), { passive: true });
    
    // ======================
    // INITIALIZATION COMPLETE
    // ======================
    
    console.log('🚀 Axle IA website initialized successfully');
    
    // Remove loading class if present
    document.body.classList.remove('loading');
});