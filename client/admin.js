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
			errordiv.textContent = responseData.message;
			errordiv.style.color = 'green';
			// console.log('Product added successfully:', responseData);
			// You can update the UI or perform other actions here
		} else {
			const errorData = await response.json();
			console.error('Error adding product:', errorData);
			errordiv.textContent = errorData.message;
			errordiv.style.color = 'red';
			// Handle the error and display a message to the user
		}
	} catch (error) {
		console.error('Error:', error);
		errordiv.textContent = error.message;
		errordiv.style.color = 'red';
		// Ha	ndle any network or other errors
	}
	clearFormFields();

	setTimeout(() => {
		errordiv.textContent = '';
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

// Update your admin.js code as follows:

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
                <td class="product-image">${product.product_image}</td>
                <td>
                    <button class="delete-button" onclick="deleteProduct('${product.product_id}')">Delete</button>
                    <button class="update-button" data-product-id=${product.product_id}>Update</button>
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
		} else {
			const responseData = await response.json();
			console.error('Error deleting product:', responseData.message);
		}
	} catch (error) {
		console.error('Error deleting product:', error);
	}
}

// Call this function to populate the product table on page load
refreshProductTable();

/**
 * 
 */

// Add an event listener to the document to handle dynamic update buttons
document.addEventListener('click', event => {
    if (event.target.classList.contains('update-button')) {
        const productRow = event.target.closest('tr');
        const productName = productRow.querySelector('.product-name').textContent;
        const productDescription = productRow.querySelector('.product-description').textContent;
        const productPrice = productRow.querySelector('.product-price').textContent;
        const productQuantity = productRow.querySelector('.product-quantity').textContent;
        const productCategory = productRow.querySelector('.product-category').textContent;
        const productImage = productRow.querySelector('.product-image')

        // Populate the update form with extracted values
        document.getElementById('update-product-name').value = productName;
        document.getElementById('update-product-description').value = productDescription;
        document.getElementById('update-product-price').value = productPrice;
        document.getElementById('update-product-quantity').value = productQuantity;
        document.getElementById('update-product-category').value = productCategory;
        document.getElementById('update-product-image').value = productImage;
    }
});

// Update product details form submit event listener
document.getElementById('update-product-form').addEventListener('submit', async event => {
    event.preventDefault();

    // Get the updated product details from the form
    const updatedProductName = document.getElementById('update-product-name').value;
    const updatedProductDescription = document.getElementById('update-product-description').value;
    const updatedProductPrice = document.getElementById('update-product-price').value;
    const updatedProductQuantity = document.getElementById('update-product-quantity').value;
    const updatedProductCategory = document.getElementById('update-product-category').value;
    const updatedProductImage = document.getElementById('update-product-image').value;

    // Perform the update process (send updated data to the server)
    // ...

    // Clear the update form fields
    document.getElementById('update-product-form').reset();
});



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
