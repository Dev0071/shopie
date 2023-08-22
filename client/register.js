// Simulated user data storage (replace this with server-side database)
const loginform = document.getElementById('login-form');
const registerform = document.getElementById('signup-form');
const submitbtn = document.getElementById('submit-btn');
const users = [];
console.log(users);

function registerUser() {
	console.log('form submitted');
	const name = document.getElementById('name').value;
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;

	const user = { name, email, password };
	users.push(user);

	alert('Registration successful. You can now log in.');
	// Clear registration form
	document.getElementById('name').value = '';
	document.getElementById('email').value = '';
	document.getElementById('password').value = '';
}
registerform.addEventListener('submit', registerUser);

// Function to handle login form submission
function loginUser() {
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;

	// Simulated login validation (replace with actual validation)
	const user = users.find(user => user.email === email && user.password === password);

	if (user) {
		alert(`Welcome back, ${user.name}!`);
	} else {
		alert('Invalid email or password. Please try again.');
	}

	// Clear login form
	document.getElementById('email').value = '';
	document.getElementById('password').value = '';
}
loginform.addEventListener('submit', loginUser);
