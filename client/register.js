const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const errordivlogin = document.querySelector('.errordivlogin');
const errordiv = document.querySelector('.errordiv');

/**
 * registerUser - Register a new user
 */
const registerUser = async () => {
	const u_name = document.getElementById('name').value;
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;
	const user = { u_name, email, password };

	try {
		const response = await fetch('http://localhost:3000/api/user/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(user),
		});

		if (response.ok) {
			const responseData = await response.json();

			// Save token and user data to local storage
			localStorage.setItem('token', responseData.token);
			localStorage.setItem('user', JSON.stringify(responseData.user));

			// show success message
			errordiv.innerHTML = 'Registration successful. Redirecting...';
			errordiv.style.color = 'green';
			clearFormFields();

			// redirect to login page
			setTimeout(() => {
				window.location.href = 'http://127.0.0.1:5500/client/index.html'; // Replace with your homepage URL
			}, 1000);
		} else {
			const responseData = await response.json();
			errordiv.innerHTML = responseData.message;
			errordiv.style.color = 'red';
		}
	} catch (error) {
		console.error('Error registering user:', error);
	}
};

/**
 * register the user when the signup form is submitted
 */
signupForm.addEventListener('submit', function (event) {
	event.preventDefault();
	const name = document.getElementById('name').value;
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;

	errordiv.textContent = '';

	if (name === '') {
		showError('name', 'Name is required');
	} else if (email === '') {
		showError('email', 'Email is required');
	} else if (!isValidEmail(email)) {
		showError('email', 'Invalid email format');
	} else if (password === '') {
		showError('password', 'Password is required');
	} else {
		registerUser();
	}
});

/**
 * loginUser - Log in an existing user
 */

const loginBtn = document.getElementById('login-btn');

const loginUser = async () => {
	// console.log(loginForm);
	// console.log('log -submitted');
	const email = document.getElementById('login-email').value;
	const password = document.getElementById('login-password').value;
	const credentials = { email, password };

	try {
		const response = await fetch('http://localhost:3000/api/user/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(credentials),
		});

		if (response.ok) {
			const responseData = await response.json();

			// Save token and user data to local storage
			localStorage.setItem('token', responseData.token);
			localStorage.setItem('user', JSON.stringify(responseData.user));
			console.log(responseData);

			//reidrect to the required page
			if (responseData.user.is_admin) {
				console.log(responseData.user.is_admin);
				// Redirect to admin page
				
				setTimeout(() => {
					window.location.href = 'http://127.0.0.1:5500/client/admin.html';
				}, 1000);
			} else {
				// Redirect to homepage after a brief delay (e.g., 3 seconds)
				errordivlogin.innerHTML = 'Login successful. Redirecting to homepage...';
				errordivlogin.style.color = 'green';
				clearFormFields();

				setTimeout(() => {
					window.location.href = 'http://127.0.0.1:5500/client/index.html';
				}, 1000);
			}

			// show success message
			errordivlogin.innerHTML = 'Registration successful. Redirecting...';
			errordivlogin.style.color = 'green';
			clearFormFields();

			
		} else {
			const responseData = await response.json();
			errordivlogin.textContent = 'Login failed: ' + responseData.message;
			errordivlogin.style.color = 'red';
			setTimeout(() => {
				clearError();
			}, 3000);
		}
	} catch (error) {
		console.error('Error logging in:', error);
	}
};

loginBtn.addEventListener('click', function (event) {
	event.preventDefault();
	const email = document.getElementById('login-email').value;
	const password = document.getElementById('login-password').value;


	if (email === '') {
		showError('login-email', 'Email is required');
	} else if (!isValidEmail(email)) {
		showError('login-email', 'Invalid email format');
	} else if (password === '') {
		showError('login-password', 'Password is required');
	} else {
		loginUser();
	}
});

function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

function showError(field, message) {
	errordiv.textContent = message;
	errordiv.style.color = 'red';
	errordivlogin.textContent = message;
	errordivlogin.style.color = 'red';
	const input = document.querySelector(`#${field}`);
	input.focus();
	input.style.borderBottom = '1px solid red';

	setTimeout(() => {
		clearError();
	}, 3000);
}

function clearError() {
	errordiv.textContent = '';
	errordiv.style.color = '';
	errordivlogin.textContent = '';
	errordivlogin.style.color = '';
}

const clearFormFields = () => {
	document.getElementById('name').value = '';
	document.getElementById('email').value = '';
	document.getElementById('password').value = '';
};
