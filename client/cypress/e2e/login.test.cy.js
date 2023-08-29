describe('User Login', () => {
	it('logs in an existing user', () => {
		cy.visit('/login.html'); 

		cy.get('#login-email').type('johndoe@example.com');
		cy.get('#login-password').type('password123');
		cy.get('#login-btn').click();

		cy.contains('Registration successful').should('be.visible');
	});

	it('handles login form validation', () => {
		cy.visit('/login.html'); 

		cy.get('#login-btn').click();

		cy.contains('Email is required').should('be.visible');
		// cy.contains('Password is required').should('be.visible');
	});

	it('handles invalid email format during login', () => {
		cy.visit('/login.html'); 

		cy.get('#login-email').type('invalidemail');
		cy.get('#login-password').type('password123');
		cy.get('#login-btn').click();

		cy.contains('Invalid email format').should('be.visible');
	});

	it('handles login failure', () => {
		cy.visit('/login.html'); 

		cy.get('#login-email').type('nonexistent@example.com');
		cy.get('#login-password').type('wrongpassword');
		cy.get('#login-btn').click();

		cy.contains('Login failed:').should('be.visible');
	});
});
