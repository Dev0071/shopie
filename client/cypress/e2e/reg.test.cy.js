describe('User Registration', () => {
	beforeEach(() => {
		cy.visit('/login.html'); 
		cy.get('.signup-btn').click();
		cy.wait(1000); 
	});

	it('registers a new user', () => {
		cy.get('#name').type('John');
		cy.get('#email').type('johndoe@example.com');
		cy.get('#password').type('password123');
		cy.get('#signup-form').submit();

		cy.contains('Registration successful. Redirecting...').should('be.visible');
	});

	it('handles registration form validation', () => {
		cy.get('#signup-form').submit();

		cy.contains('Name is required').should('be.visible');
		
	});

	it('handles invalid email format', () => {
		cy.get('#email').type('invalidemail@gmail.com');
		cy.get('#signup-form').submit();

		cy.contains('Name is required').should('be.visible');
	});
});
