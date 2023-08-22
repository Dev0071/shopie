
/**
 * show and hide the search input when the search icon is clicked on the navbar
 */
const searchIcon = document.querySelector('.search-icon');
const searchInput = document.getElementById('searchInput');

searchIcon.addEventListener('click', () => {
	searchInput.parentElement.classList.toggle('show-search');
	searchInput.focus()
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
const productNames = ['gadgets', 'cosmetics' , 'books', 'furnitures','accessories', 'clothing'];
const changingText = document.getElementById("changing-text");
let index = 0;

const changeText =() =>{
    changingText.textContent = productNames[index];
    index = (index + 1) % productNames.length;
}

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

			// Add 'active-btn' class to the clicked category button
			btn.classList.add('active-btn');

			productsContainer.innerHTML = '';

			const productDiv = document.createElement('div');
			productDiv.className = 'product';
			productDiv.innerHTML = `
                <div class="product-image">
                    <img src="./images/watch-bg.png" alt="">
                </div>
                <div class="product-info">
                    <div class="product-info-text">
                        <p>Watch</p>
                        <div class="rating">
                            <span class="material-icons-outlined" style="color: rgb(241, 180, 67);">
                                star_outline
                            </span>
                            <span class="material-icons-outlined" style="color: rgb(241, 180, 67);">
                                star_outline
                            </div>
                        <p>$ 100</p>
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
	});
/**
 * cart logic
 */

const cartIcon = document.getElementById("cart");
const cartContainer = document.querySelector(".cart-container");
const mainDiv = document.getElementById("main");

cartIcon.addEventListener("click",  () =>{
    cartContainer.style.display = "block"; 
    mainDiv.style.display = "none"; 
});
closeCartBtn.addEventListener('click',  ()=> {
	cartContainer.style.display = 'none'; 
	mainDiv.style.display = 'block'; 
});

