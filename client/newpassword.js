const resetPasswordForm = document.getElementById('reset-password-form');
const resetMessage = document.getElementById('reset-message');

resetPasswordForm.addEventListener('submit', async event => {
	event.preventDefault();

	const passwordInput = document.getElementById('password');
	const newPassword = passwordInput.value;

	const urlParams = new URLSearchParams(window.location.search);
	const token = urlParams.get('token');

	try {
		const response = await fetch(`http://localhost:3000/api/user/change-password/${token}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ password: newPassword }),
		});

		const data = await response.json();

		if (response.ok) {
			resetMessage.style.display = 'block';
			resetMessage.textContent = 'Password reset successfully redirecting...';
			resetMessage.style.color = 'green';
			setTimeout(() => {
				window.location.href = 'http://127.0.0.1:5500/client/login.html';
			}, 1000);
		} else {
			resetMessage.style.display = 'block';
			resetMessage.textContent = data.message;
			resetMessage.style.color = 'red';
		}
		setTimeout(() => {
			resetMessage.style.display = 'none';
		}, 3000);
	} catch (error) {
		console.error('Error resetting password:', error);
		resetMessage.textContent = 'An error occurred while resetting the password.';
		resetMessage.style.color = 'red';
	}
});
