
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
