const url = 'http://localhost:3000/api/user/';


const forgotPasswordForm = document.getElementById('forgot-password-form');
const messageElement = document.getElementById('message');

forgotPasswordForm.addEventListener('submit', async event => {
	event.preventDefault();
	const email = document.getElementById('email').value;

	try {
		const response = await fetch('http://localhost:3000/api/user/reset-password', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email }),
		});

		const data = await response.json();
		if (response.ok) {
            console.log(data.message);
			messageElement.textContent = data.message;
			messageElement.classList.remove('hidden');
			messageElement.style.color = 'green';
		} else {
			messageElement.textContent = data.error;
			messageElement.classList.remove('hidden');
			messageElement.style.color = 'red';
		}
	} catch (error) {
		console.error('Error:', error);
		messageElement.textContent = 'An error occurred. Please try again later.';
		messageElement.classList.remove('hidden');
		messageElement.style.color = 'red';
	}
	setTimeout(() => {
		messageElement.style.display = 'none';
	}, 3000);
});




