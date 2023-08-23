const productsArray = [];
const addProductForm = document.getElementById('add-product-form');
const productList = document.getElementById('product-list');
const uploadButton = document.getElementById('upload-button');
const imageUrlContainer = document.getElementById('image-url-container');
const imageUrlElement = document.getElementById('image-url');
const imageUploadInput = document.getElementById('image-upload');

// addProductForm.addEventListener('submit', addProduct);
// Assuming you have a form with appropriate input fields for adding a product
// const addProductForm = document.getElementById('add-product-form');

addProductForm.addEventListener('submit', async event => {
	event.preventDefault();

	const productName = document.getElementById('product-name').value;
	const productDescription = document.getElementById('product-description').value;
	const productPrice = document.getElementById('product-price').value;
	const productQuantity = document.getElementById('product-quantity').value;
	const productImage = document.getElementById('product-image').value;
	const productCategory = document.getElementById('product-category').value;
	const errordiv = document.querySelector('.error');

	const productData = {
		product_name: productName,
		product_description: productDescription,
		price: productPrice,
		product_quantity: productQuantity,
		product_image: productImage,
		product_category: productCategory,
	};
console.log(productData);
	const token = localStorage.getItem('token');
	console.log(token);

	try {
		const response = await fetch('http://localhost:3000/api/product/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(productData),
		});

		if (response.ok) {
			const responseData = await response.json();
			console.log('Product added successfully:', responseData);
			// You can update the UI or perform other actions here
		} else {
			const errorData = await response.json();
			console.error('Error adding product:', errorData);
			errordiv.textContent = errorData.message;
			// Handle the error and display a message to the user
		}
	} catch (error) {
		console.error('Error:', error);
		errordiv.textContent = error.message;
		// Handle any network or other errors
	}
});

/**
 * Create product item
 */
function createProductItem(
	productName,
	productDescription,
	productPrice,
	productQuantity,
	productCategory,
) {
	const productItem = document.createElement('div');
	productItem.className = 'product-item';

	const productInfo = document.createElement('div');
	productInfo.innerHTML = `
        <strong>Name:</strong> ${productName}<br>
        <strong>Description:</strong> ${productDescription}<br>
        <strong>Price:</strong> $${productPrice}<br>
        <strong>Quantity:</strong> ${productQuantity}<br>
        <strong>Category:</strong> ${productCategory}<br>
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
		productList.appendChild(product);
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
			.then(response => response.blob())
			.then(imageBlob => {
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

copyUrlButton.addEventListener('click', copyImageUrl);

function copyImageUrl() {
	const imageUrlElement = document.getElementById('image-url');
	const imageUrl = imageUrlElement.textContent;

	const textarea = document.createElement('textarea');
	textarea.value = imageUrl;
	document.body.appendChild(textarea);
	textarea.select();
	document.execCommand('copy');
	document.body.removeChild(textarea);

	alert('Image URL copied to clipboard!');
}
