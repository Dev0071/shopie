describe('User Registration', () => {
	beforeEach(() => {
		cy.visit('/login.html'); // Update the URL as needed
		cy.get('.signup-btn').click(); // Assuming there's a signup button that navigates to the sign-up form
	});

	it('registers a new user', () => {
		cy.get('#name').type('John Doe');
		cy.get('#email').type('johndoe@example.com');
		cy.get('#password').type('password123');
		cy.get('#signup-form').submit();

		cy.contains('Registration successful. Redirecting...').should('be.visible');
	});

	it('handles registration form validation', () => {
		cy.get('#signup-form').submit();

		cy.contains('Name is required').should('be.visible');
		cy.contains('Email is required').should('be.visible');
		cy.contains('Password is required').should('be.visible');
	});

	it('handles invalid email format', () => {
		cy.get('#email').type('invalidemail');
		cy.get('#signup-form').submit();

		cy.contains('Invalid email format').should('be.visible');
	});
});
