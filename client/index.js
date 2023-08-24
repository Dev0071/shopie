/**
 * show and hide the search input when the search icon is clicked on the navbar
 */
const searchIcon = document.querySelector('.search-icon');
const searchInput = document.getElementById('searchInput');
const menuIcon = document.querySelector('.menu-icon');
const mobileMenu = document.querySelector('.mobile-menu');
const cartIcon = document.getElementById('cart');
const cartContainer = document.querySelector('.cart-container');
const mainDiv = document.getElementById('main');

searchIcon.addEventListener('click', () => {
	searchInput.parentElement.classList.toggle('show-search');
	searchInput.focus();
});

/**
 * show and hide the mobile menu when the menu icon is clicked on the navbar
 */

menuIcon.addEventListener('click', () => {
	mobileMenu.classList.toggle('active');
	menuIcon.classList.toggle('active');
});

/**
 * show and hide the cart when the cart icon is clicked on the navbar
 */

cartIcon.addEventListener('click', () => {
	cartContainer.style.display = 'block';
	mainDiv.style.display = 'none';
	fetchAndDisplayCartItems();
});
closeCartBtn.addEventListener('click', () => {
	cartContainer.style.display = 'none';
	mainDiv.style.display = 'block';
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
                    <div onClick = "openModal('${product.product_id}')" class="product-image">
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
                            <span class="material-icons-outlined  add-to-cart" onClick="addToCart('${product.product_id}')" >
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

// Function to handle adding a product to the cart
async function addToCart(productID) {
	// const productID = event.target.getAttribute('data-product-id');
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

/***
 * fetch cart items
 */
// Define a function to fetch and display cart items
async function fetchAndDisplayCartItems() {
	try {
		const response = await fetch('http://localhost:3000/api/cart/items'); 
		const data = await response.json();

		if (data.status === 'success') {
			const cartItems = data.items;

			const cartContainer = document.querySelector('.cart-products');
			cartContainer.innerHTML = ''; // Clear existing cart items

			// Loop through the cart items and create cart item elements
			cartItems.forEach(item => {
				const cartItemDiv = document.createElement('div');
				cartItemDiv.className = 'cart-product';
				cartItemDiv.innerHTML = `
                    <div class="cart-product-info">
                        <p>${item.product_name}</p>
                        <div class="units-left">
                            <button class="counter-btn decrease-btn">-</button>
                            <div class="counter-input">
                                <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                                <button class="counter-btn increase-btn">+</button>
                            </div>
                        </div>
                    </div>
                    <div class="cart-counter">
                        <p>$ ${item.price}</p>
                        <button class="delete-btn" onClick="removeFromCart('${item.product_id}')">Remove</button>
                    </div>
                `;

				cartContainer.appendChild(cartItemDiv);
			});
		}
	} catch (error) {
		console.error('Error fetching cart items:', error);
	}
}

/**
 * remove from cart
 */
async function removeFromCart(productID) {
    try {
        const response = await fetch(`http://localhost:3000/cart/items/${productID}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            // Refresh cart items after removal
            fetchAndDisplayCartItems();
        } else {
            const errorData = await response.json();
            // Show error message
            console.error(errorData.message);
        }
    } catch (error) {
        console.error('Error removing product from cart:', error);
    }
}

/**
 * show and hide product  modal
 */


const productModal = document.getElementById('productModal');
const modalProductImage = document.getElementById('modalProductImage');
const modalProductName = document.getElementById('modalProductName');
const modalProductDescription = document.getElementById('modalProductDescription');
const modalProductPrice = document.getElementById('modalProductPrice');
const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');
const closeModalBtn = document.querySelector('.close-modal-btn');
closeModalBtn.addEventListener('click', () => {
	productModal.style.display = 'none';
});

// Close the modal when clicking outside the modal content
window.addEventListener('click', event => {
	if (event.target === productModal) {
		productModal.style.display = 'none';
	}
});

// Function to open the modal and display the product details
/************/
 function openModal (productid) {
const product =  fetchProductById(productid);

	modalProductImage.src = product.product_image;
	modalProductName.textContent = product.product_name;
	modalProductDescription.textContent = product.description;
	modalProductPrice.textContent = product.price;
	modalAddToCartBtn.setAttribute('data-product-id', product.product_id);
	productModal.style.display = 'block';
}

/**
 * get product by id
 */

// Function to fetch a single product by its ID
async function fetchProductById(productID) {
    try {
        const response = await fetch(`http://localhost:3000/api/product/${productID}`);
        const data = await response.json();

        if (data.status === 'success') {
            const product = data.product;
            return product;
        } else {
            console.error('Error fetching product:', data.message);
            return null;
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}


/**
 * log out and pop up to manage account
 */
// Get references to the necessary elements
const userProfileIcon = document.querySelector('.user-icons .material-icons-outlined.person');
const userProfilePopup = document.getElementById('userProfilePopup');
const manageAccountOption = document.getElementById('manage-account');
const logoutOption = document.getElementById('logout');

// Show user profile popup on clicking the user icon
userProfileIcon.addEventListener('click', () => {
    userProfilePopup.style.display = 'block';
});

// Close user profile popup on clicking outside or on option
document.addEventListener('click', (event) => {
    if (!userProfilePopup.contains(event.target) && event.target !== userProfileIcon) {
        userProfilePopup.style.display = 'none';
    }
});

// Handle clicking on "Manage Account" option
manageAccountOption.addEventListener('click', () => {
    // Implement logic to navigate to the account management page
    // You can use window.location.href or other navigation methods
    // based on your application's routing system.
    // Example: window.location.href = '/account';
    userProfilePopup.style.display = 'none';
});

// Handle clicking on "Log Out" option
logoutOption.addEventListener('click', () => {
    // Implement logic to log out the user
    // You can clear session data, reset authentication status, etc.
    // Example: performLogout();
    userProfilePopup.style.display = 'none';
});
