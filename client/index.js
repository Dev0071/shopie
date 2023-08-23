window.addEventListener('load', () => {
	/**
	 * show and hide the search input when the search icon is clicked on the navbar
	 */
	const searchIcon = document.querySelector('.search-icon');
	const searchInput = document.getElementById('searchInput');

	searchIcon.addEventListener('click', () => {
		searchInput.parentElement.classList.toggle('show-search');
		searchInput.focus();
	});

	/**
	 * show and hide the mobile menu when the menu icon is clicked on the navbar
	 */

	const menuIcon = document.querySelector('.menu-icon');
	const mobileMenu = document.querySelector('.mobile-menu');

	menuIcon.addEventListener('click', () => {
		mobileMenu.classList.toggle('active');
		menuIcon.classList.toggle('active');
	});

	/**
	 * loop through the productNames array and change the text in the span element
	 */
	const productNames = ['gadgets', 'cosmetics', 'books', 'furnitures', 'accessories', 'clothing'];
	const changingText = document.getElementById('changing-text');
	let index = 0;

	const changeText = () => {
		changingText.textContent = productNames[index];
		index = (index + 1) % productNames.length;
	};

	setInterval(changeText, 1000);

	/**
	 * fetches and displays products by categories
	 */

	const categoriesBtns = document.querySelectorAll('.categories-btns li');
	const productsContainer = document.querySelector('.products');

	categoriesBtns.forEach(btn => {
		btn.addEventListener('click', () => {
			// Remove 'active-btn' class from all category buttons
			categoriesBtns.forEach(categoryBtn => {
				categoryBtn.classList.remove('active-btn');
			});
			btn.classList.add('active-btn');
			productsContainer.innerHTML = '';
			const category = btn.textContent.toLowerCase();
			console.log(category);
			if (category !== 'all') {
				fetchAndDisplayProductsByCategory(category);
			} else {
				fetchAndDisplayProducts();
			}
		});
	});

	/**
	 * fetches and displays products by categories
	 *
	 */
	// Get a reference to the dropdown content element
	const dropdownContent = document.querySelector('.dropdown-content');
	const categoryButtons = dropdownContent.querySelectorAll('li');

	categoryButtons.forEach(categoryButton => {
		categoryButton.addEventListener('click', () => {
			categoryButtons.forEach(btn => {
				btn.classList.remove('active-btn');
			});

			categoryButton.classList.add('active-btn');

			const categoryID = categoryButton.getAttribute('id');

			const categoryName = categoryID.replace('-btn', '');

			if (categoryName === 'all-categories') {
				fetchAndDisplayProducts();
			} else {
				fetchAndDisplayProductsByCategory(categoryName);
			}
		});
	});

	// Define a function to fetch and display products by category
	async function fetchAndDisplayProductsByCategory(category) {
		try {
			const response = await fetch(`http://localhost:3000/api/product/all/${category}`);
			const data = await response.json();

			if (data.status === 'success') {
				const products = data.products;

				const productsContainer = document.querySelector('.products');

				// Clear existing products
				productsContainer.innerHTML = '';

				// Loop through the products and create product elements
				products.forEach(product => {
					const productDiv = document.createElement('div');
					productDiv.className = 'product';
					productDiv.innerHTML = `
                    <div class="product-image">
                        <img src="${product.product_image}" alt="">
                    </div>
                    <div class="product-info">
                        <div class="product-info-text">
                            <p>${product.product_name}</p>
                            <div class="rating">
                                <span class="material-icons-outlined" style="color: rgb(241, 180, 67);">
                                    star_outline
                                </span>
                                <span class="material-icons-outlined" style="color: rgb(241, 180, 67);">
                                    star_outline
                                </span>
                            </div>
                            <p>$ ${product.price}</p>
                        </div>
                        <div class="product-icons">
                            <span class="material-icons-outlined">
                                favorite_border
                            </span>
                            <span class="material-icons-outlined">
                                shopping_cart
                            </span>
                        </div>
                    </div>
                `;

					// Append the product to the products container
					productsContainer.appendChild(productDiv);
				});
			}
		} catch (error) {
			console.error('Error fetching products by category:', error);
		}
	}

	/**
	 * cart logic
	 */

	/***
	 * get all products
	 */

	// Define the function to fetch and display products
	async function fetchAndDisplayProducts() {
		try {
			const response = await fetch('http://localhost:3000/api/product/');
			const data = await response.json();

			if (data.status === 'success') {
				const products = data.products;

				const productsContainer = document.querySelector('.products');

				// Clear existing products
				productsContainer.innerHTML = '';

				// Loop through the products and create product elements
				products.forEach(product => {
					const productDiv = document.createElement('div');
					productDiv.className = 'product';
					productDiv.innerHTML = `
                    <div class="product-image">
                        <img src="${product.product_image}" alt="">
                    </div>
                    <div class="product-info">
                        <div class="product-info-text">
                            <p>${product.product_name}</p>
                            <div class="rating">
                                <span class="material-icons-outlined" style="color: rgb(241, 180, 67);">
                                    star_outline
                                </span>
                                <span class="material-icons-outlined" style="color: rgb(241, 180, 67);">
                                    star_outline
                                </span>
                            </div>
                            <p>$ ${product.price}</p>
                        </div>
                        <div class="product-icons">
                            <span class="material-icons-outlined">
                                favorite_border
                            </span>
                            <span class="material-icons-outlined  add-to-cart" data-product-id=${product.product_id}>
                                shopping_cart
                            </span>
                        </div>
                    </div>
                `;

					// Append the product to the products container
					productsContainer.appendChild(productDiv);
				});
			}
		} catch (error) {
			console.error('Error fetching products:', error);
		}
	}

	// Call the fetchAndDisplayProducts function to fetch and display products
	fetchAndDisplayProducts();

	/**
	 * add to cart
	 */
	// Add event listener to all "Add to Cart" icons
	const addToCartIcons = document.querySelectorAll('.add-to-cart');

	addToCartIcons.forEach(icon => {
		icon.addEventListener('click', addToCart);
		console.log('clicked');
	});

	// Function to handle adding a product to the cart
	async function addToCart(event) {
		const productID = event.target.getAttribute('data-product-id');
		console.log(productID);

		try {
			const response = await fetch(`http://localhost:3000/api/cart/${productID}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (response.ok) {
				const responseData = await response.json();
				// Show success message or update cart count
				console.log(responseData.message);
			} else {
				const errorData = await response.json();
				// Show error message
				console.error(errorData.message);
			}
		} catch (error) {
			console.error('Error adding product to cart:', error);
		}
	}

	const cartIcon = document.getElementById('cart');
	const cartContainer = document.querySelector('.cart-container');
	const mainDiv = document.getElementById('main');

	cartIcon.addEventListener('click', () => {
		cartContainer.style.display = 'block';
		mainDiv.style.display = 'none';
	});
	closeCartBtn.addEventListener('click', () => {
		cartContainer.style.display = 'none';
		mainDiv.style.display = 'block';
	});
});
