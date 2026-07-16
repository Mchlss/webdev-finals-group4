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
        })
        .catch(error => console.error('Error rendering system global navigation:', error));
});