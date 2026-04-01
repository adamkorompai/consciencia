// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);

    // Update active nav indicator
    document.querySelectorAll('nav ul a').forEach(function(a) {
        a.classList.remove('nav-active');
    });
    document.querySelectorAll('nav ul a[onclick*="' + pageId + '"]').forEach(function(a) {
        a.classList.add('nav-active');
    });

    // Re-init scroll reveals for the newly visible page
    setTimeout(initRevealObserver, 60);

    // Close mobile menu if open
    const menu = document.getElementById('nav-menu');
    const hamburger = document.querySelector('.hamburger');
    if (menu.classList.contains('active')) {
        menu.classList.remove('active');
        hamburger.classList.remove('active');
    }
}

// Mobile Menu Toggle
function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    const hamburger = document.querySelector('.hamburger');
    menu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Smooth Scroll
function smoothScroll(targetId) {
    const element = document.getElementById(targetId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Email Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Submit form to Netlify via fetch (keeps user on the SPA)
function submitToNetlify(form, successId, errorId) {
    fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
    })
    .then(function(response) {
        if (!response.ok) throw new Error('Submission failed');
        document.getElementById(successId).style.display = 'block';
        form.reset();
    })
    .catch(function() {
        document.getElementById(errorId).style.display = 'block';
    });
}

// Newsletter Form Handler
function handleNewsletterSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const name = document.getElementById('newsletter-name');
    const email = document.getElementById('newsletter-email');
    let isValid = true;

    // Reset errors scoped to this form
    form.querySelectorAll('.error-message').forEach(function(el) { el.style.display = 'none'; });
    form.querySelectorAll('input').forEach(function(el) { el.classList.remove('error'); });

    if (!name.value.trim()) {
        document.getElementById('newsletter-name-error').style.display = 'block';
        name.classList.add('error');
        isValid = false;
    }
    if (!validateEmail(email.value)) {
        document.getElementById('newsletter-email-error').style.display = 'block';
        email.classList.add('error');
        isValid = false;
    }

    if (isValid) {
        submitToNetlify(form, 'newsletter-success', 'newsletter-network-error');
    }
}

// Book Waitlist Form Handler
function handleBookWaitlistSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const name = document.getElementById('book-name');
    const email = document.getElementById('book-email');
    let isValid = true;

    // Reset errors scoped to this form
    form.querySelectorAll('.error-message').forEach(function(el) { el.style.display = 'none'; });
    form.querySelectorAll('input').forEach(function(el) { el.classList.remove('error'); });

    if (!name.value.trim()) {
        document.getElementById('book-name-error').style.display = 'block';
        name.classList.add('error');
        isValid = false;
    }
    if (!validateEmail(email.value)) {
        document.getElementById('book-email-error').style.display = 'block';
        email.classList.add('error');
        isValid = false;
    }

    if (isValid) {
        submitToNetlify(form, 'book-success', 'book-network-error');
    }
}

// Contact Form Handler
function handleContactSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const firstName = document.getElementById('contact-firstname');
    const surname = document.getElementById('contact-surname');
    const email = document.getElementById('contact-email');
    const interest = document.getElementById('contact-interest');
    let isValid = true;

    // Reset errors scoped to this form
    form.querySelectorAll('.error-message').forEach(function(el) { el.style.display = 'none'; });
    form.querySelectorAll('input, select').forEach(function(el) { el.classList.remove('error'); });

    if (!firstName.value.trim()) {
        document.getElementById('contact-firstname-error').style.display = 'block';
        firstName.classList.add('error');
        isValid = false;
    }
    if (!surname.value.trim()) {
        document.getElementById('contact-surname-error').style.display = 'block';
        surname.classList.add('error');
        isValid = false;
    }
    if (!validateEmail(email.value)) {
        document.getElementById('contact-email-error').style.display = 'block';
        email.classList.add('error');
        isValid = false;
    }
    if (!interest.value) {
        document.getElementById('contact-interest-error').style.display = 'block';
        interest.classList.add('error');
        isValid = false;
    }

    if (isValid) {
        submitToNetlify(form, 'contact-success', 'contact-network-error');
    }
}

// Ibiza gallery lightbox
function openLightbox(src) {
    const lb = document.getElementById('lightbox');
    document.getElementById('lightbox-img').src = src;
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
    document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLightbox();
});

// Scroll Reveal
var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            var el = entry.target;
            if (el.classList.contains('manifesto-lines')) {
                el.querySelectorAll('.manifesto-line').forEach(function(line) {
                    line.classList.add('visible');
                });
            } else {
                el.classList.add('visible');
            }
            revealObserver.unobserve(el);
        }
    });
}, { threshold: 0.12 });

function initRevealObserver() {
    document.querySelectorAll('.reveal:not(.visible)').forEach(function(el) {
        revealObserver.observe(el);
    });
    document.querySelectorAll('.manifesto-lines:not([data-observed])').forEach(function(el) {
        el.setAttribute('data-observed', '1');
        revealObserver.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initRevealObserver();
    // Set home as active nav item on load
    var homeLink = document.querySelector('nav ul a[onclick*="home"]');
    if (homeLink) homeLink.classList.add('nav-active');
});

// FAQ Accordion
function toggleFaq(btn) {
    var item = btn.closest('.faq-item');
    var answer = item.querySelector('.faq-answer');
    var isOpen = item.classList.contains('open');

    // Close all open items
    document.querySelectorAll('.faq-item.open').forEach(function(openItem) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-answer').style.maxHeight = '0';
    });

    // Open the clicked item if it was closed
    if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
    }
}
