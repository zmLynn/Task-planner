document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signUpForm = document.getElementById('signUpForm');
    const showSignUp = document.getElementById('showSignUp');
    const showLogin = document.getElementById('showLogin');
    const passwordField = document.getElementById('loginPassword');
    const passwordStrengthBar = document.getElementById('password-strength-bar');

    // Show sign up form
    showSignUp.addEventListener('click', (event) => {
        event.preventDefault();
        loginForm.style.display = 'none';
        signUpForm.style.display = 'block';
    });

    // Show login form
    showLogin.addEventListener('click', (event) => {
        event.preventDefault();
        signUpForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // Handle sign up form submission
    document.getElementById('signUp').addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('signUpUsername').value;
        const password = document.getElementById('signUpPassword').value;

        if (localStorage.getItem(username)) {
            alert('Username already exists!');
        } else {
            localStorage.setItem(username, password);
            alert('Sign up successful! Please log in.');
            signUpForm.style.display = 'none';
            loginForm.style.display = 'block';
        }
    });

    // Handle login form submission
    document.getElementById('login').addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = passwordField.value;

        const storedPassword = localStorage.getItem(username);
        if (storedPassword && storedPassword === password) {
            alert('Login successful!');
            // Redirect to the main application page
            window.location.href = 'taskPlanner.html';
        } else {
            alert('Invalid username or password.');
        }
    });

    // Toggle password visibility
    window.togglePasswordVisibility = function() {
        const toggleIcon = document.querySelector('.password-toggle-icon i');
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            toggleIcon.classList.remove('far', 'fa-eye');
            toggleIcon.classList.add('fas', 'fa-eye-slash');
        } else {
            passwordField.type = 'password';
            toggleIcon.classList.remove('fas', 'fa-eye-slash');
            toggleIcon.classList.add('far', 'fa-eye');
        }
    };

    // Calculate password strength
    passwordField.addEventListener('input', () => {
        const password = passwordField.value;
        const strength = calculatePasswordStrength(password);
        passwordStrengthBar.value = strength;
    });

    function calculatePasswordStrength(password) {
        // Simple password strength calculation (you can enhance this)
        const length = password.length;
        if (length < 6) return 0;
        if (length < 10) return 50;
        return 100;
    }

    // Social login functions (placeholders for actual implementations)
    window.signInWithGoogle = function() {
        alert('Google login not implemented');
    };

    window.signInWithFacebook = function() {
        alert('Facebook login not implemented');
    };

    window.signInWithX = function() {
        alert('X login not implemented');
    };
});
