import 'cypress-file-upload';
describe('Admin page', () => {
	beforeEach(() => {
		cy.visit('/login.html');

		cy.get('#login-email').type('kabs@gmail.com');
		cy.get('#login-password').type('123456q');
		cy.get('#login-btn').click();


		cy.contains('Registration successful').should('be.visible');
		cy.wait(1000)
	});

	it('should toggle "Add Product" form visibility', () => {
		// cy.location('pathname').should('eq', '/admin.html');
		cy.get('#toggle-add-product-form-btn').click();
		cy.get('#add-product-form').should('be.visible');
		cy.get('#toggle-add-product-form-btn').click();
		cy.get('#add-product-form').should('not.be.visible');
	});
	it('should submit "Add Product" form with valid data', () => {
		cy.get('#toggle-add-product-form-btn').click();
		cy.get('#product-name').type('New Product');
		cy.get('#product-description').type('Description of new product.');
		cy.get('#product-price').type('99.99');
		cy.get('#product-quantity').type('10');
		cy.get('#product-image').type('product_image_url');
		cy.get('#product-category').select('Electronics');
		cy.get('#add-product-form').submit();
		cy.get('#product-table tbody').should('contain', 'New Product');
	});
	it('should delete a product from the list', () => {
		// cy.visit('/path-to-your-admin-page'); 
		cy.get('.product-name').first().invoke('text').as('productName');
		cy.get('.delete-button').first().click();
		// cy.get('.swal-button--danger').click(); 
		cy.get('@productName').then(productName => {
			cy.get('#product-table tbody').should('not.contain', productName);
		});
	});
	// it('should upload an image and copy its URL', () => {
	// 	cy.get("#image-upload").attachFile('/headphones1.jpg');
	// 	cy.get('#upload-button').click();
	// 	cy.wait(2000);
	// 	cy.get('#copy-url-button').click();
	// 	// cy.get('.errorupdate').should('contain', 'Image URL copied to clipboard!');
	// 	cy.get('.errorupdate').should('be.visible');
	// });


});
