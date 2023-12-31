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
const desktopSearchInput = document.getElementById('desktop-search');

searchIcon.addEventListener('click', () => {
	searchInput.parentElement.classList.toggle('show-search');
	searchInput.focus();
});
/**
 * search product
*/
console.log(desktopSearchInput.value);
desktopSearchInput.addEventListener('input', () => {
	// console.log(desktopSearchInput.value);
	searchProduct(desktopSearchInput.value);
});
searchInput.addEventListener('input', ()=> searchProduct(searchInput.value));


const searchProduct = async (query) => {
	// let query = searchInput.value;
	// console.log(query);
	const response = await fetch(`http://localhost:3000/api/product/search/${query}`);
	const data = await response.json();
	console.log(data);
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
						<img src="${product.product_image}" onClick = "openModal('${product.product_id}')"  alt="">
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
							<span class="material-icons-outlined" onClick="addToCart('${product.product_id}')">
								shopping_cart
							</span>
						</div>
					</div>
				`;

			// Append the product to the products container
			productsContainer.appendChild(productDiv);
		});
	}
};

// desktopSearchInput.addEventListener('input', searchProduct);

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
	displayCartItems();
	calculateCartTotal();
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
                        <img src="${product.product_image}" onClick = "openModal('${product.product_id}')"  alt="">
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
                            <span class="material-icons-outlined" onClick="addToCart('${product.product_id}')">
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

	const session_id = localStorage.getItem('session_id');
	console.log('current session_id', session_id);
	const user = localStorage.getItem('user');
	const user_id = JSON.parse(user).id;

	try {
		if (!session_id) {
			const res = await fetch(`http://localhost:3000/api/cart/${productID}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (res.ok) {
				const responseData = await res.json();
				const session_id = responseData.sess;
				// console.log(session_id);
				localStorage.setItem('session_id', session_id);
				// Show success message or update cart count
				const cartNotification = document.getElementById('cart-notification');
				cartNotification.style.display = 'block';
				cartNotification.textContent = 'Item added to cart!';
				cartNotification.style.color = 'green';
				setTimeout(() => {
					cartNotification.textContent = '';
					cartNotification.style.display = 'none';
				}, 3000);
				console.log(responseData.message);
			}
		} else {
			const response = await fetch(`http://localhost:3000/api/cart/${productID}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ session_id, user_id }),
			});

			if (response.ok) {
				const responseData = await response.json();
				const cartNotification = document.getElementById('cart-notification');
				cartNotification.style.display = 'block';
				cartNotification.textContent = 'Item added to cart!';
				cartNotification.style.color = 'green';
				setTimeout(() => {
					cartNotification.textContent = '';
					cartNotification.style.display = 'none';
				}, 3000);
				console.log(responseData.message);
			}
		}
		setCartCount();
	} catch (error) {
		console.error('Error adding product to cart:', error);
	}
}
const setCartCount = async () => {
	const cartCount = document.querySelector('#cart-counter');
	const products = await fetchCartItems();
	if (products === undefined) {
		cartCount.textContent = 0;
	}
	const cartItems = products.length;
	console.log('items in cart', cartItems);
	cartCount.textContent = cartItems;
};
setCartCount();

// cartCount.textContent = parseInt(cartCount.textContent) + 1;

/***
 * fetch cart items
 */
// Define a function to fetch and display cart items
async function fetchCartItems() {
	const session_id = localStorage.getItem('session_id');
	const user = localStorage.getItem('user');
	const user_id = JSON.parse(user).id;
	console.log(' current user', user_id);

	try {
		const response = await fetch(`http://localhost:3000/api/cart/items/${session_id}/${user_id}`);
		const data = await response.json();
		// console.log(data);

		if (data.status === 'success') {
			const cartItems = data.products;
			return cartItems;
		}
	} catch (error) {
		console.error('Error fetching cart items:', error);
	}
}

/**
 * display cart items
 */

const displayCartItems = async () => {
	const cartItems = await fetchCartItems();
	// console.log(cartItems);
	const cartContainer = document.querySelector('.cart-items');
	cartContainer.innerHTML = ''; // Clear existing cart items

	// Loop through the cart items and create cart item elements
	if (cartItems) {
		cartItems.forEach(async item => {
			const product = await fetchProductById(item.product_id);
			// console.log(item.product);
			const { product_name, product_image, price, product_quantity, product_id } = product;
			const cartItemDiv = document.createElement('div');
			cartItemDiv.className = 'cart-product';
			cartItemDiv.innerHTML = `
                     <div class="cart-product">
                    <div class="cart-product-image">
                        <img src='${product_image}'alt="">
                    </div>
                    <div class="cart-product-info">
                        <p class="description">${product_name}.</p>
                        <p class="price">$
						${price}</p>
                        <p class="units-left">
                            <span class="material-icons-outlined" style="color: red;">
                                error_outline
                            </span>
                            ${product_quantity} items left
                        </p>
                        <div class="cart-counter">
                            <button class="delete-btn" onClick="removeFromCart('${product_id}')">
                                <span class="material-icons-outlined" style="color: red;">
                                    delete
                                </span>
                                Remove</button>
                            <div class="counter-input">
                                <button class="increase-counter-btn" onClick="increaseCartItemQuantity('${item.product_id}')">+</button>
                                <p class="product-quantity">${item.quantity}</p>
                                <button class="decrease-counter-btn" onClick="decreaseCartItemQuantity('${item.product_id}')">-</button>
                            </div>
                        </div>
                    </div>
                </div>
                `;

			cartContainer.appendChild(cartItemDiv);
		});
		calculateCartTotal();
	} else {
		const emptyCartMessage = document.createElement('p');
		emptyCartMessage.className = 'empty-cart-message';
		emptyCartMessage.textContent = 'Cart is empty';
		cartContainer.appendChild(emptyCartMessage);
	}
};

//increaseCcartItemQuantity

const increaseCartItemQuantity = async product_id => {
	const productQuantity = document.querySelector('.product-quantity');
	await addToCart(product_id);
	console.log(product_id);
	productQuantity.textContent = parseInt(productQuantity.textContent) + 1;
	await fetchCartItems();
	await displayCartItems();
};
const decreaseCartItemQuantity = async product_id => {
	console.log(product_id);

	const productQuantity = document.querySelector('.product-quantity');
	await removeItemFromCart(product_id);
	productQuantity.textContent = parseInt(productQuantity.textContent) - 1;

	if (parseInt(productQuantity.textContent) === 0) {
		await removeFromCart(product_id);
	}
	setCartCount();
	await displayCartItems();
	await fetchCartItems();
};

const removeItemFromCart = async product_id => {
	const session_id = localStorage.getItem('session_id');
	const user = localStorage.getItem('user');
	const user_id = JSON.parse(user).id;
	try {
		const response = await fetch(`http://localhost:3000/api/cart/item/${product_id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ session_id, user_id }),
		});
		const data = await response.json();
		console.log(data);
	} catch (error) {
		console.error('Error removing product from cart:', error);
	}
};

/**
 * cart  calculation
 */
const calculateCartTotal = async () => {
	const cartItems = await fetchCartItems();
	const cartTotal = document.querySelector('.cart-total');
	const allTotals = document.querySelector('.all-total');
	let total = 0;
	cartItems.forEach(item => {
		total += item.price * item.quantity;
	});
	cartTotal.textContent = total;
	allTotals.textContent = total;
};

/**
 * remove from cart
 */
async function removeFromCart(productID) {
	const session_id = localStorage.getItem('session_id');
	const user = localStorage.getItem('user');
	const user_id = JSON.parse(user).id;
	console.log('user', user_id, 'session', session_id);
	try {
		const response = await fetch(`http://localhost:3000/api/cart/item/${productID}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ session_id, user_id }),
		});

		if (response.ok) {
			// Refresh cart items after removal
			// fetchCartItems();
			const data = await response.json();
			console.log(data);
			const cartCount = document.querySelector('#cart-counter');
			cartCount.textContent = parseInt(cartCount.textContent) - 1;
			// fetchCartItems();
			displayCartItems();
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
 * clear cart
 */
const clearCartBtn = document.querySelector('.clear-cart-btn');
clearCartBtn.addEventListener('click', () => {
	clearCart();
});
const clearCart = async () => {
	const session_id = localStorage.getItem('session_id');
	const user = localStorage.getItem('user');
	const user_id = JSON.parse(user).id;

	try {
		console.log('  user', user_id);
		console.log('  session', session_id);
		const response = await fetch(`http://localhost:3000/api/cart/all/items`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ session_id, user_id }),
		});

		if (response.ok) {
			// Refresh cart items after removal
			// displayCartItems();
			fetchCartItems();
			displayCartItems();
			const data = await response.json();
			console.log(data);
			const cartCount = document.querySelector('#cart-counter');
			cartCount.textContent = 0;
		} else {
			const errorData = await response.json();
			// Show error message
			console.error(errorData.message);
		}
	} catch (error) {
		console.error('Error removing product from cart:', error);
	}
};

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
async function openModal(productid) {
	const product = await fetchProductById(productid);

	modalProductImage.src = product.product_image;
	modalProductName.textContent = product.product_name;
	modalProductDescription.textContent = product.product_description;
	modalProductPrice.textContent = product.price;
	// modalAddToCartBtn.setAttribute('data-product-id', product.product_id);
	productModal.style.display = 'block';
	modalAddToCartBtn.addEventListener(
		'click',
		() => {
			addToCart(product.product_id);
		},
		{ once: true },
	);
}

/**
 * get product by id
 */

// Function to fetch a single product by its ID
async function fetchProductById(productID) {
	try {
		const response = await fetch(`http://localhost:3000/api/product/${productID}`);
		const data = await response.json();
		// console.log(data);

		if (data.status === 'success') {
			const product = data?.product;
			// console.log(product);
			// openModal(product);

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

const loggout = async () => {
	try {
		const response = await fetch('http://localhost:3000/api/user/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (response.ok) {
			localStorage.clear();

			window.location.href = 'http://127.0.0.1:5500/client/login.html';
		} else {
			const errorData = await response.json();
			console.error(errorData.message);
		}
	} catch (error) {
		console.error('Error logging out:', error);
	}
};
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
document.addEventListener('click', event => {
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
	loggout();
	userProfilePopup.style.display = 'none';
});
