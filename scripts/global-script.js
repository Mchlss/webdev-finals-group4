document.addEventListener("DOMContentLoaded", () => {
    const isGitHubPages = window.location.hostname.includes("github.io");
    
    const basePath = isGitHubPages 
        ? `${window.location.origin}/webdev-finals-group4/` 
        : `${window.location.origin}/`;

    fetch(`${basePath}pages/header.html`)
        .then(response => {
            if (!response.ok) throw new Error("Header fetch failed");
            return response.text();
        })
        .then(data => {
            const placeholder = document.getElementById('header-placeholder');
            if (!placeholder) return;
            
            //Inject the HTML structure onto the page
            placeholder.innerHTML = data;

            document.querySelector('.header-logo').src = `${basePath}images/icons/beaches-travel-inc-logo.svg`;
            document.querySelector('.header-cart-icon').src = `${basePath}images/icons/cart-icon.svg`;
            document.querySelector('.header-profile-icon').src = `${basePath}images/icons/profile-icon.svg`;

            document.getElementById('nav-home').href = `${basePath}index.html`;
            document.getElementById('nav-offers').href = `${basePath}pages/offers.html`;
            document.getElementById('nav-vouchers').href = `${basePath}pages/my-vouchers.html`;
            document.getElementById('nav-cart').href = `${basePath}pages/my-cart.html`;
            document.getElementById('nav-profile').href = `${basePath}pages/my-profile.html`;
            document.getElementById('nav-about-us').href = `${basePath}pages/about-us.html`;

            initHamburgerMenu();
        })
        .catch(error => console.error('Error rendering system global navigation:', error));
});

function initHamburgerMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            navMenu.classList.toggle('open');
            menuToggle.classList.toggle('active');
        });

        const links = navMenu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                menuToggle.classList.remove('active');
            });
        });
        
        console.log("Hamburger Navigation system successfully linked!");
    } else {
        console.error("Hamburger elements could not be found inside fetched header.html markup template.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateHeaderCartCount();
});


window.updateHeaderCartCount = function() {
    const countSpan = document.getElementById('cart-count');
    if (!countSpan) return;

    // Get the current array from storage
    const currentCart = JSON.parse(localStorage.getItem('userShoppingArr')) || [];
    
    // Calculate total quantity
    const totalItems = currentCart.reduce((acc, item) => acc + (parseInt(item.quantity) || 1), 0);
    
    // Update badge text
    countSpan.textContent = totalItems;
};

// Listen for storage changes in other tabs/windows
window.addEventListener('storage', () => {
    window.updateHeaderCartCount();
});

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    // Wait briefly for the header to render if it's dynamic
    setTimeout(window.updateHeaderCartCount, 100);
});