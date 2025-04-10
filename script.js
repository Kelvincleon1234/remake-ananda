// DOM Elements
const loader = document.querySelector('.loader');
const languageToggle = document.getElementById('language-toggle');
const languageDropdown = document.querySelector('.language-dropdown');
const langCode = document.querySelector('.lang-code');
const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');
const backToTop = document.querySelector('.back-to-top');
const contactForm = document.getElementById('contactForm');

// Current language (default: English)
let currentLanguage = 'en';

// Load languages from JSON files
async function loadLanguage(lang) {
    try {
        const response = await fetch(`languages/${lang}.json`);
        if (!response.ok) {
            throw new Error('Language file not found');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading language:', error);
        // Fallback to English if there's an error
        if (lang !== 'en') {
            return loadLanguage('en');
        }
        return {};
    }
}

// Update page content with selected language
async function updateContent(lang) {
    const translations = await loadLanguage(lang);
    
    // Update all elements with data-lang attribute
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[key]) {
            // Handle different types of elements
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = translations[key];
            } else if (element.tagName === 'OPTION') {
                if (element.hasAttribute('selected')) {
                    element.selected = true;
                }
                element.textContent = translations[key];
            } else {
                element.textContent = translations[key];
            }
        }
    });
    
    // Update placeholder texts
    document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
        const key = element.getAttribute('data-lang-placeholder');
        if (translations[key]) {
            element.setAttribute('placeholder', translations[key]);
        }
    });
    
    // Update language toggle button
    langCode.textContent = lang.toUpperCase();
    
    // Store selected language
    currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);
}

// Toggle language dropdown
languageToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    languageDropdown.classList.toggle('show');
});

// Close language dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!languageToggle.contains(e.target) && !languageDropdown.contains(e.target)) {
        languageDropdown.classList.remove('show');
    }
});

// Change language
document.querySelectorAll('.language-dropdown button').forEach(button => {
    button.addEventListener('click', () => {
        const lang = button.getAttribute('data-lang');
        updateContent(lang);
        languageDropdown.classList.remove('show');
    });
});

// Toggle mobile menu
menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
    menuToggle.innerHTML = navbar.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking a link
document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Show/hide back to top button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        try {
            // Here you would typically send the data to a server
            // For demo purposes, we'll just show an alert
            const translations = await loadLanguage(currentLanguage);
            alert(translations['contact-form-success'] || 'Thank you for your message! We will contact you soon.');
            contactForm.reset();
        } catch (error) {
            console.error('Error submitting form:', error);
            const translations = await loadLanguage(currentLanguage);
            alert(translations['contact-form-error'] || 'There was an error submitting your message. Please try again.');
        }
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Hide loader after page loads
    setTimeout(() => {
        loader.classList.add('fade-out');
    }, 1000);
    
    // Remove loader after animation completes
    loader.addEventListener('transitionend', () => {
        loader.style.display = 'none';
    });
    
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
        updateContent(savedLanguage);
    } else {
        // Default to browser language if available, otherwise English
        const browserLang = navigator.language.split('-')[0];
        updateContent(['en', 'id'].includes(browserLang) ? browserLang : 'en');
    }
    
    // Initialize form selects
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        if (!select.value) {
            select.value = select.querySelector('option[disabled][selected]') ? '' : select.options[0].value;
        }
    });
});

// Close dropdowns when pressing Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        languageDropdown.classList.remove('show');
    }
});