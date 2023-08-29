// const productsArray = [];
const addProductForm = document.getElementById('add-product-form');
const productList = document.getElementById('product-list');
const uploadButton = document.getElementById('upload-button');
const imageUrlContainer = document.getElementById('image-url-container');
const imageUrlElement = document.getElementById('image-url');
const imageUploadInput = document.getElementById('image-upload');
const addProductButton = document.getElementById('add-product-btn');
const errorp = document.querySelector('.errorupdate');


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
	// const errordiv = document.getElementById('error-div');

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
			// const responseData = await response.json();
			errorp.style.display = 'block';
			errorp.textContent = 'Product added successfully';
			errorp.style.color = 'green';
			// console.log('Product added successfully:', responseData);
			// You can update the UI or perform other actions here
		} else {
			const errorData = await response.json();
			console.error('Error adding product:', errorData);
			errorp.style.display = 'block';
			errorp.textContent = 'Error adding product';
			errorp.style.color = 'red';
			// Handle the error and display a message to the user
		}
	} catch (error) {
		console.error('Error:', error);
		errorp.style.display = 'block';
		errorp.textContent = 'Error adding product';
		errorp.style.color = 'red';
		// Ha	ndle any network or other errors
	}
	clearFormFields();

	refreshProductTable();
	setTimeout(() => {
		errorp.textContent = '';
		errorp.style.display = 'none';
	}, 3000);
});

const clearFormFields = () => {
	document.getElementById('product-name').value = '';
	document.getElementById('product-description').value = '';
	document.getElementById('product-price').value = '';
	document.getElementById('product-quantity').value = '';
	document.getElementById('product-image').value = '';
	document.getElementById('product-category').value = '';
};

/**
 * Create products table
 */

// Function to fetch all products from the backend
async function fetchProducts() {
	try {
		const response = await fetch('http://localhost:3000/api/product/');
		const data = await response.json();

		if (data.status === 'success') {
			return data.products;
		} else {
			console.error('Error fetching products:', data.message);
			return [];
		}
	} catch (error) {
		console.error('Error fetching products:', error);
		return [];
	}
}

// Function to replace the product rows with fetched products
async function refreshProductTable() {
	const products = await fetchProducts();
	const tableBody = document.querySelector('#product-table tbody');
	tableBody.innerHTML = ''; // Clear existing rows

	products.forEach(product => {
		const rowHtml = `
            <tr>
                <td class='product-name'>${product.product_name}</td>
                <td class="product-description">${product.product_description}</td>
                <td class="product-price">$${product.price}</td>
                <td class ="product-quantity">${product.product_quantity}</td>
                <td class= "product-category">${product.product_category}</td>
                <td class="product-image"><img style='width: 100px;' src="${product.product_image}" alt="Product 1 Image"></td>
                <td>
                    <button class="delete-button" onclick="deleteProduct('${product.product_id}')">Delete</button>
                    <button class="update-button" onclick = "showUpdateModal('${product.product_id}','${product.product_name}', '${product.product_description}', ${product.price}, ${product.product_quantity}, '${product.product_category}', '${product.product_image}')" >Update</button>
                </td>
            </tr>
        `;
		tableBody.insertAdjacentHTML('beforeend', rowHtml);
	});
}

// Function to delete a product
async function deleteProduct(productId) {
	try {
		const token = localStorage.getItem('token');
		const response = await fetch(`http://localhost:3000/api/product/${productId}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (response.ok) {
			// Refresh the product table after successful deletion
			refreshProductTable();
			errorp.style.display = 'block';
			errorp.textContent = 'Product deleted successfully';
			errorp.style.color = 'green';
		} else {
			const responseData = await response.json();
			console.error('Error deleting product:', responseData.message);
			errorp.style.display = 'block';
			errorp.textContent = 'Error deleting product';
			errorp.style.color = 'red';
		}
	} catch (error) {
		console.error('Error deleting product:', error);
	}
	setTimeout(() => {
		errorp.textContent = '';
		errorp.style.display = 'none';
	}, 3000);
}

// Call this function to populate the product table on page load

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

async function copyImageUrl() {
	const imageUrlElement = document.getElementById('image-url');
	const imageUrl = imageUrlElement.textContent;

	try {
		await navigator.clipboard.writeText(imageUrl);
		errorp.style.display = 'block';
		errorp.textContent = 'Image URL copied to clipboard!';
		errorp.style.color = 'green';
	} catch (error) {
		console.error('Error copying image URL:', error);
	}
	setTimeout(() => {
		errorp.textContent = '';
		// errorp.style.display = 'none';
	}, 3000);
}

/**
 * update a product
 */

// Get the update product modal and its content
const updateProductModal = document.getElementById('update-product-modal');
const updateProductForm = document.getElementById('update-product-form');
const closeModalSpan = updateProductModal.querySelector('.close');

// Function to show the update product modal

function showUpdateModal(
	product_id,
	productName,
	productDescription,
	productPrice,
	productQuantity,
	productCategory,
	productImage,
) {
	// Populate the form fields with the provided product data
	document.getElementById('update-product-id').value = product_id;
	document.getElementById('update-product-name').value = productName;
	document.getElementById('update-product-description').value = productDescription;
	document.getElementById('update-product-price').value = productPrice;
	document.getElementById('update-product-quantity').value = productQuantity;
	document.getElementById('update-product-category').value = productCategory;
	document.getElementById('update-product-image').value = productImage;

	// Show the modal
	updateProductModal.style.display = 'block';
}

// Add event listener to close modal button
closeModalSpan.addEventListener('click', () => {
	updateProductModal.style.display = 'none';
});

// Close the modal when clicking outside the modal content
window.addEventListener('click', event => {
	if (event.target === updateProductModal) {
		updateProductModal.style.display = 'none';
	}
});

// Handle form submission for updating the product
updateProductForm.addEventListener('submit', event => {
	event.preventDefault();

	// Get the updated product data from the form fields
	const productId = document.getElementById('update-product-id').value;
	const updatedProductName = document.getElementById('update-product-name').value;
	const updatedProductDescription = document.getElementById('update-product-description').value;
	const updatedProductPrice = parseFloat(document.getElementById('update-product-price').value);
	const updatedProductQuantity = parseInt(document.getElementById('update-product-quantity').value);
	const updatedProductCategory = document.getElementById('update-product-category').value;
	const updatedProductImage = document.getElementById('update-product-image').value;

	const updatedProductData = {
		product_name: updatedProductName,
		product_description: updatedProductDescription,
		price: updatedProductPrice,
		product_quantity: updatedProductQuantity,
		product_category: updatedProductCategory,
		product_image: updatedProductImage,
	};
	console.log(updatedProductData);
	console.log(productId);
	updateProduct(productId, updatedProductData);
	// Close the modal after updating
	updateProductModal.style.display = 'none';
});

/**
 * function to update product
 */

async function updateProduct(productId, updatedProductData) {
	const token = localStorage.getItem('token');

	try {
		const response = await fetch(`http://localhost:3000/api/product/${productId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(updatedProductData),
		});

		if (response.ok) {
			// Refresh the product table after successful update
			refreshProductTable();
			errorp.style.display = 'block';
			errorp.textContent = 'Product updated successfully';
			errorp.style.color = 'green';
		} else {
			const errorData = await response.json();
			console.error('Error updating product:', errorData);
			errorp.style.display = 'block';
			errorp.textContent = 'Error updating product';
			errorp.style.color = 'red';
			// Handle the error and display a message to the user
		}
		setTimeout(() => {
			errorp.textContent = '';
			errorp.style.display = 'none';
		}, 3000);
	} catch (error) {
		console.error('Error:', error);
		// Handle any network or other errors
	}
}

// Get references to the button and the add product form
const toggleAddProductFormButton = document.getElementById('toggle-add-product-form-btn');
// const addProductForm = document.getElementById('add-product-form');

// Add click event listener to the button
toggleAddProductFormButton.addEventListener('click', () => {
    // Toggle the display property of the add product form
    if (addProductForm.style.display === 'none') {
        addProductForm.style.display = 'block';
    } else {
        addProductForm.style.display = 'none';
    }
});

refreshProductTable();


