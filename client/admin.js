const productsArray = [];
const addProductForm = document.getElementById('add-product-form');
const productList = document.getElementById('product-list');
const uploadButton = document.getElementById('upload-button');
const imageUrlContainer = document.getElementById('image-url-container');
const imageUrlElement = document.getElementById('image-url');
const imageUploadInput = document.getElementById('image-upload');

addProductForm.addEventListener('submit', addProduct);
function addProduct(event) {
	event.preventDefault();

	const productName = document.getElementById('product-name').value;
	const productDescription = document.getElementById('product-description').value;
	const productPrice = document.getElementById('product-price').value;
	const productQuantity = document.getElementById('product-quantity').value;
	const productImage = document.getElementById('product-image').value; // You can handle file upload logic here
	const productCategory = document.getElementById('product-category').value;

	if (
		productName &&
		productDescription &&
		productPrice &&
		productQuantity &&
		productImage &&
		productCategory
	) {
		const productItem = createProductItem(
			productName,
			productDescription,
			productPrice,
			productQuantity,
			productCategory,
		);
		productList.appendChild(productItem);
		// Add the new product to the products array
		productsArray.push(productItem);

		// Display the products in the UI
		displayProducts();
		// Clear form inputs
		addProductForm.reset();
	}
}

/**
 * Create product item
 */
function createProductItem(name, description, price, quantity, category) {
	const productItem = document.createElement('div');
	productItem.className = 'product-item';

	const productInfo = document.createElement('div');
	productInfo.innerHTML = `
        <strong>Name:</strong> ${name}<br>
        <strong>Description:</strong> ${description}<br>
        <strong>Price:</strong> $${price}<br>
        <strong>Quantity:</strong> ${quantity}<br>
        <strong>Category:</strong> ${category}
    `;
	productItem.appendChild(productInfo);

	const deleteButton = document.createElement('button');
	deleteButton.textContent = 'Delete';
	deleteButton.addEventListener('click', deleteProduct);
	productItem.appendChild(deleteButton);

	return productItem;
}
/**
 * Delete product
 */

function deleteProduct(event) {
	const productItem = event.target.parentElement;
	productList.removeChild(productItem);
}

/**
 * Display products in the UI
 */
function displayProducts() {
	productList.innerHTML = '';

	productsArray.forEach(product => {
		const productItem = createProductItem(
			product.name,
			product.description,
			product.price,
			product.quantity,
			product.category,
		);
		productList.appendChild(productItem);
	});
}

/**
 * Upload image
 */

cloudinary.setCloudName('dlrkyzhnp');
const cloudinaryUploadPreset = 'shopie';
const removeBgApiKey = 'xwS5YwzaUPf3FQCU7TtZAhYS';
uploadButton.addEventListener('click', handleImageUpload);

function handleImageUpload() {
	const imageFile = imageUploadInput.files[0];

	if (imageFile) {
		const formData = new FormData();
		formData.append('image_file', imageFile);

		// Remove.bg API call for background removal
		fetch('https://api.remove.bg/v1.0/removebg', {
			method: 'POST',
			body: formData,
			headers: {
				'X-Api-Key': removeBgApiKey,
			},
		})
			.then(response => response.blob()) // Convert response to blob
			.then(imageBlob => {
				// Create a URL for the blob and display the image
				const cloudinaryFormData = new FormData();
				cloudinaryFormData.append('file', imageBlob);
				cloudinaryFormData.append('upload_preset', 'shopie');

				// Upload image to Cloudinary
				return fetch('https://api.cloudinary.com/v1_1/dlrkyzhnp/image/upload', {
					method: 'POST',
					body: cloudinaryFormData,
				});
			})
			.then(response => response.json())
			.then(data => {
				const imageUrl = data.secure_url;
				console.log(imageUrl);

				imageUrlContainer.style.display = 'block';
				imageUrlElement.textContent = imageUrl;
			})

			.catch(error => {
				console.error('Image processing failed:', error);
			});
	}
}

/**
 * copy image url
 */

// Reference the "Copy" button
const copyUrlButton = document.getElementById('copy-url-button');

// Add a click event listener to the "Copy" button
copyUrlButton.addEventListener('click', copyImageUrl);

// Function to copy the image URL to the clipboard
function copyImageUrl() {
	const imageUrlElement = document.getElementById('image-url');
	const imageUrl = imageUrlElement.textContent;

	// Create a temporary textarea element to copy the URL to the clipboard
	const textarea = document.createElement('textarea');
	textarea.value = imageUrl;
	document.body.appendChild(textarea);
	textarea.select();
	document.execCommand('copy');
	document.body.removeChild(textarea);

	// Notify the user that the URL has been copied
	alert('Image URL copied to clipboard!');
}
