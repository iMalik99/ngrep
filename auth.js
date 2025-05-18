// Common JavaScript for all pages
function createErrorMessage(message, parentElement) {
    // Remove any existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    errorDiv.style.backgroundColor = '#fff0f0';
    errorDiv.style.color = '#d32f2f';
    errorDiv.style.padding = '10px 15px';
    errorDiv.style.borderRadius = '8px';
    errorDiv.style.marginBottom = '15px';
    errorDiv.style.fontSize = '14px';
    errorDiv.style.border = '1px solid #ffcdd2';
    errorDiv.style.display = 'flex';
    errorDiv.style.alignItems = 'center';
    errorDiv.style.animation = 'fadeIn 0.3s';
    
    // Add animation
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    // Insert error message at the beginning of the form
    parentElement.insertBefore(errorDiv, parentElement.firstChild);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        errorDiv.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => {
            errorDiv.remove();
        }, 300);
    }, 5000);
}

// Check if user is already logged in
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    if (isLoggedIn === 'true') {
        // If user is logged in but trying to access login or register page, redirect to dashboard
        if (currentPage === 'index.html' || currentPage === 'register.html' || currentPage === '') {
            window.location.href = 'dashboard.html';
        }
    } else {
        // If user is not logged in but trying to access dashboard, redirect to login
        if (currentPage === 'dashboard.html') {
            window.location.href = 'index.html';
        }
    }
}

// Run auth check on page load
document.addEventListener('DOMContentLoaded', checkAuthStatus);

// Registration Page Specific JavaScript
if (document.querySelector('.register-box')) {
    const registerForm = document.querySelector('.register-box form');
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = this.querySelector('input[type="text"]').value.trim();
        const state = this.querySelector('select').value;
        const mda = this.querySelector('.dropdowns input').value.trim();
        const email = this.querySelector('input[type="email"]').value.trim();
        const password = this.querySelectorAll('input[type="password"]')[0].value;
        const confirmPassword = this.querySelectorAll('input[type="password"]')[1].value;
        
        // Validate all fields
        if (!fullName || !state || !mda || !email || !password || !confirmPassword) {
            createErrorMessage('Please fill in all fields', registerForm);
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            createErrorMessage('Please enter a valid email address', registerForm);
            return;
        }
        
        // Check if passwords match
        if (password !== confirmPassword) {
            createErrorMessage('Passwords do not match', registerForm);
            return;
        }
        
        // Check if email already registered
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        if (existingUsers.some(user => user.email === email)) {
            createErrorMessage('This email is already registered', registerForm);
            return;
        }
        
        // Store user data
        const userData = {
            fullName,
            state,
            mda,
            email,
            password // In a real app, this should be hashed
        };
        
        existingUsers.push(userData);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        
        // Redirect to login page
        window.location.href = 'index.html';
    });
}