// Explain: Client-side interactions for navigation and forms.
document.addEventListener('DOMContentLoaded', function() {
    var mobileContactButton = document.getElementById('mobileContactButton');
    var contactOverlay = document.getElementById('contactOverlay');
    var closeContactOverlay = document.getElementById('closeContactOverlay');
    var contactForm = document.getElementById('contactForm');
    var overlayContactForm = document.getElementById('overlayContactForm');

    // Navigation Overlay Elements
    var navOpenButton = document.getElementById('navOpenButton');
    var navCloseButton = document.getElementById('navCloseButton');
    var navOverlay = document.getElementById('navOverlay');
    var navCloseLinks = document.querySelectorAll('.nav-close-link');

    // Form Status Handlers
    function showStatus(formEl, type, message) {
        var key = formEl && formEl.id === 'overlayContactForm' ? 'overlay' : 'contact';
        var status = document.querySelector('[data-form-status="' + key + '"]');
        if (!status) {
            return;
        }
        status.textContent = message;
        status.classList.remove('success', 'error');
        status.classList.add(type);
    }

    function setSubmitting(formEl, isSubmitting) {
        if (!formEl) {
            return;
        }
        var button = formEl.querySelector('button[type="submit"]');
        if (!button) {
            return;
        }
        button.disabled = isSubmitting;
        button.textContent = isSubmitting ? 'Sending...' : 'Send Message';
    }

    function submitContactForm(formEl) {
        if (!formEl) {
            return;
        }
        if (!formEl.checkValidity()) {
            formEl.reportValidity();
            return;
        }
        if (!window.MessagesSystem || typeof window.MessagesSystem.submit !== 'function') {
            showStatus(formEl, 'error', 'Messaging is temporarily unavailable. Please try again shortly.');
            return;
        }

        setSubmitting(formEl, true);
        showStatus(formEl, 'success', 'Sending your message...');

        window.MessagesSystem.submit([
            { label: 'Name', value: formEl.name.value, type: 'text' },
            { label: 'Email', value: formEl.email.value, type: 'email' },
            { label: 'Message', value: formEl.message.value, type: 'textarea' }
        ], formEl).then(function(response) {
            if (response && response.success) {
                formEl.reset();
                showStatus(formEl, 'success', 'Thank you! We will be in touch soon.');
            } else {
                showStatus(formEl, 'error', response && response.error ? response.error : 'Your message could not be sent. Please try again.');
            }
        }).catch(function() {
            showStatus(formEl, 'error', 'A connection issue prevented sending. Please try again.');
        }).finally(function() {
            setSubmitting(formEl, false);
        });
    }

    // Overlay controls for the contact form
    function openContactOverlay() {
        if (!contactOverlay) {
            return;
        }
        contactOverlay.classList.add('is-open');
        contactOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        var firstInput = contactOverlay.querySelector('input[name="name"]');
        if (firstInput) {
            firstInput.focus();
        }
    }

    function closeContactOverlayFn() {
        if (!contactOverlay) {
            return;
        }
        contactOverlay.classList.remove('is-open');
        contactOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Overlay controls for Navigation
    function openNav() {
        if (!navOverlay) return;
        navOverlay.classList.remove('hidden');
        navOverlay.classList.add('flex');
        navOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        if (!navOverlay) return;
        navOverlay.classList.add('hidden');
        navOverlay.classList.remove('flex');
        navOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Listeners for the contact forms
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            submitContactForm(event.currentTarget);
        });
    }

    if (overlayContactForm) {
        overlayContactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            submitContactForm(event.currentTarget);
        });
    }

    if (mobileContactButton) {
        mobileContactButton.addEventListener('click', openContactOverlay);
    }

    if (closeContactOverlay) {
        closeContactOverlay.addEventListener('click', closeContactOverlayFn);
    }

    if (contactOverlay) {
        contactOverlay.addEventListener('click', function(event) {
            if (event.target === contactOverlay) {
                closeContactOverlayFn();
            }
        });
    }

    // Listeners for Navigation Menu
    if (navOpenButton) {
        navOpenButton.addEventListener('click', openNav);
    }

    if (navCloseButton) {
        navCloseButton.addEventListener('click', closeNav);
    }

    if (navCloseLinks) {
        navCloseLinks.forEach(function(link) {
            link.addEventListener('click', closeNav);
        });
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeContactOverlayFn();
            closeNav();
        }
    });
});