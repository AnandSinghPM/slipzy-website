/* Contact Form JavaScript - Slipzy */
/* Handles form validation, character counting, and submission */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== FORM ELEMENTS =====
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    // Form fields
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    
    // Status messages
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    // Character counter
    const charCounter = document.getElementById('char-counter');
    
    // ===== VALIDATION RULES =====
    const validation = {
        fullName: {
            required: true,
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-Z\s\-'\.]+$/,
            errorMessage: 'Please enter a valid full name (2-50 characters, letters only)'
        },
        email: {
            required: true,
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            errorMessage: 'Please enter a valid email address'
        },
        subject: {
            required: true,
            errorMessage: 'Please select a subject'
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 500,
            errorMessage: 'Message must be between 10-500 characters'
        }
    };

    // ===== UTILITY FUNCTIONS =====
    
    // Show/hide status messages
    function showMessage(type, show = true) {
        if (type === 'success') {
            successMessage.style.display = show ? 'block' : 'none';
            errorMessage.style.display = 'none';
        } else if (type === 'error') {
            errorMessage.style.display = show ? 'block' : 'none';
            successMessage.style.display = 'none';
        } else {
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';
        }
        
        if (show) {
            // Smooth scroll to message
            setTimeout(() => {
                document.querySelector('.status-message[style*="block"]').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 100);
        }
    }

    // Show/hide field error messages
    function showFieldError(fieldName, show = true, customMessage = null) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        const fieldElement = document.getElementById(fieldName);
        
        if (errorElement && fieldElement) {
            if (show) {
                errorElement.textContent = customMessage || validation[fieldName].errorMessage;
                errorElement.style.display = 'block';
                errorElement.classList.add('show');
                fieldElement.classList.add('error');
            } else {
                errorElement.style.display = 'none';
                errorElement.classList.remove('show');
                fieldElement.classList.remove('error');
            }
        }
    }

    // Clear all error messages
    function clearAllErrors() {
        Object.keys(validation).forEach(fieldName => {
            showFieldError(fieldName, false);
        });
    }

    // Validate individual field
    function validateField(fieldName, value) {
        const rules = validation[fieldName];
        if (!rules) return true;

        // Required field check
        if (rules.required && (!value || value.trim() === '')) {
            showFieldError(fieldName, true, 'This field is required');
            return false;
        }

        // Skip other validations if field is empty and not required
        if (!value || value.trim() === '') {
            showFieldError(fieldName, false);
            return true;
        }

        // Length validations
        if (rules.minLength && value.length < rules.minLength) {
            showFieldError(fieldName, true, `Minimum ${rules.minLength} characters required`);
            return false;
        }

        if (rules.maxLength && value.length > rules.maxLength) {
            showFieldError(fieldName, true, `Maximum ${rules.maxLength} characters allowed`);
            return false;
        }

        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
            showFieldError(fieldName, true);
            return false;
        }

        // Field is valid
        showFieldError(fieldName, false);
        return true;
    }

    // Validate entire form
    function validateForm() {
        let isValid = true;
        const formData = getFormData();

        Object.keys(validation).forEach(fieldName => {
            if (!validateField(fieldName, formData[fieldName])) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Get form data as object
    function getFormData() {
        return {
            fullName: fullName.value.trim(),
            email: email.value.trim(),
            subject: subject.value,
            message: message.value.trim()
        };
    }

    // Update character counter
    function updateCharacterCounter() {
        const length = message.value.length;
        const maxLength = 500;
        
        charCounter.textContent = `${length}/${maxLength} characters`;
        
        // Update counter styling based on usage
        charCounter.classList.remove('warning', 'danger');
        if (length > maxLength * 0.9) {
            charCounter.classList.add('danger');
        } else if (length > maxLength * 0.8) {
            charCounter.classList.add('warning');
        }
    }

    // Create email body for mailto
    function createEmailBody(formData) {
        const subjectLabels = {
            'product-feedback': 'Product Feedback',
            'bug-report': 'Bug Report',
            'feature-request': 'Feature Request',
            'technical-support': 'Technical Support',
            'general-question': 'General Question',
            'other': 'Other'
        };

        return `Name: ${formData.fullName}
Email: ${formData.email}
Subject: ${subjectLabels[formData.subject] || formData.subject}

Message:
${formData.message}

---
Sent from Slipzy Contact Form`;
    }

    // ===== EVENT LISTENERS =====

    // Real-time validation on blur
    [fullName, email, subject, message].forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this.id, this.value);
        });

        // Clear errors on focus
        field.addEventListener('focus', function() {
            showFieldError(this.id, false);
            showMessage('hide');
        });
    });

    // Character counter for message field
    message.addEventListener('input', updateCharacterCounter);

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous messages
        showMessage('hide');
        clearAllErrors();

        // Validate form
        if (!validateForm()) {
            showMessage('error');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        btnText.textContent = 'Sending...';
        loadingSpinner.style.display = 'block';

        // Get form data
        const formData = getFormData();

        try {
            // Simulate sending process (for better UX)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Create mailto link with form data
            const emailBody = createEmailBody(formData);
            const mailtoLink = `mailto:support@slipzy.co?subject=Contact Form: ${formData.fullName}&body=${encodeURIComponent(emailBody)}`;
            
            // Open email client
            window.location.href = mailtoLink;

            // Show success message
            showMessage('success');
            
            // Reset form after successful submission
            setTimeout(() => {
                form.reset();
                updateCharacterCounter();
                clearAllErrors();
            }, 1000);

        } catch (error) {
            console.error('Form submission error:', error);
            showMessage('error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.textContent = 'Send Message';
            loadingSpinner.style.display = 'none';
        }
    });

    // ===== ENHANCED USER EXPERIENCE =====

    // Auto-format name field (capitalize first letters)
    fullName.addEventListener('blur', function() {
        const value = this.value.trim();
        if (value) {
            this.value = value.replace(/\b\w/g, l => l.toUpperCase());
        }
    });

    // Email field: convert to lowercase and trim
    email.addEventListener('blur', function() {
        this.value = this.value.trim().toLowerCase();
    });

    // Prevent form submission on Enter key in text inputs (except textarea)
    [fullName, email].forEach(field => {
        field.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                // Move to next field
                const nextField = this.parentNode.nextElementSibling?.querySelector('input, select, textarea');
                if (nextField) {
                    nextField.focus();
                } else {
                    submitBtn.focus();
                }
            }
        });
    });

    // Subject field: move to message on Enter
    subject.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            message.focus();
        }
    });

    // Message field: Ctrl+Enter to submit
    message.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            if (validateForm()) {
                form.dispatchEvent(new Event('submit'));
            }
        }
    });

    // ===== FORM ANALYTICS (Optional) =====
    
    // Track form interaction events
    function trackFormEvent(eventName, data = {}) {
        // Log to console for debugging (remove in production)
        console.log(`Form Event: ${eventName}`, data);
        
        // Add your analytics tracking here if needed
        // Example: gtag('event', eventName, data);
    }

    // Track form start
    [fullName, email, subject, message].forEach(field => {
        field.addEventListener('focus', function() {
            if (!this.dataset.interacted) {
                this.dataset.interacted = 'true';
                trackFormEvent('form_start');
            }
        }, { once: true });
    });

    // Track form completion
    form.addEventListener('submit', function() {
        trackFormEvent('form_submit', {
            subject_category: subject.value,
            message_length: message.value.length
        });
    });

    // ===== INITIALIZATION =====
    
    // Initialize character counter
    updateCharacterCounter();
    
    // Add smooth focus transitions
    document.body.classList.add('js-loaded');
    
    // Log successful initialization
    console.log('Slipzy Contact Form initialized successfully');
    
    // ===== ACCESSIBILITY ENHANCEMENTS =====
    
    // Announce validation errors to screen readers
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Enhance form validation announcements
    const originalShowFieldError = showFieldError;
    showFieldError = function(fieldName, show, customMessage) {
        originalShowFieldError(fieldName, show, customMessage);
        
        if (show) {
            const fieldLabel = document.querySelector(`label[for="${fieldName}"]`).textContent;
            const errorText = customMessage || validation[fieldName].errorMessage;
            announceToScreenReader(`${fieldLabel}: ${errorText}`);
        }
    };

    // ===== ERROR HANDLING =====
    
    // Global error handler
    window.addEventListener('error', function(e) {
        console.error('Contact form error:', e.error);
        showMessage('error');
        
        // Reset form state if needed
        if (submitBtn.disabled) {
            submitBtn.disabled = false;
            btnText.textContent = 'Send Message';
            loadingSpinner.style.display = 'none';
        }
    });

    // Handle network connectivity
    window.addEventListener('online', function() {
        showMessage('hide');
    });

    window.addEventListener('offline', function() {
        if (submitBtn.disabled) {
            showMessage('error');
            submitBtn.disabled = false;
            btnText.textContent = 'Send Message';
            loadingSpinner.style.display = 'none';
        }
    });

});

// ===== UTILITY FUNCTIONS (Global scope) =====

// Function to manually validate form (can be called externally)
window.validateSlipzyContactForm = function() {
    const form = document.getElementById('contact-form');
    if (form) {
        return form.dispatchEvent(new Event('validate'));
    }
    return false;
};

// Function to reset form (can be called externally)
window.resetSlipzyContactForm = function() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.reset();
        // Clear all errors and messages
        document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(el => {
            el.classList.remove('error');
        });
        document.querySelectorAll('.status-message').forEach(el => el.style.display = 'none');
        // Reset character counter
        const charCounter = document.getElementById('char-counter');
        if (charCounter) charCounter.textContent = '0/500 characters';
    }
};