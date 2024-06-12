document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signUpForm = document.getElementById('signUpForm');
    const showSignUp = document.getElementById('showSignUp');
    const showLogin = document.getElementById('showLogin');

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
        const password = document.getElementById('loginPassword').value;

        const storedPassword = localStorage.getItem(username);
        if (storedPassword && storedPassword === password) {
            alert('Login successful!');
            // Redirect to the main application page
            window.location.href = 'index.html';
        } else {
            alert('Invalid username or password.');
        }
    });
});