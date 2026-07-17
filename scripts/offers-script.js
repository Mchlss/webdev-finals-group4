document.addEventListener('DOMContentLoaded', () => {
    // 1. Add to Storage System
    function handleAddToCart(event) {
        const button = event.target;
        const targetCard = button.closest('.card');
        
        if (!targetCard) return;

        // Pull unique layout parameters
        const productInfo = {
            id: targetCard.getAttribute('data-id'),
            title: targetCard.getAttribute('data-title'),
            price: parseFloat(targetCard.getAttribute('data-price')),
            description: targetCard.getAttribute('data-desc'),
            quantity: 1
        };

        let currentCart = JSON.parse(localStorage.getItem('userShoppingArr')) || [];

        // Check if item already exists
        const internalIndex = currentCart.findIndex(item => item.id === productInfo.id);

        if (internalIndex > -1) {
            currentCart[internalIndex].quantity += 1;
        } else {
            currentCart.push(productInfo);
        }

        // Save to storage
        localStorage.setItem('userShoppingArr', JSON.stringify(currentCart));
        
        // Update the header count using the function defined in global-script.js
        if (typeof updateHeaderCartCount === 'function') {
            updateHeaderCartCount();
        }

        // Soft button response micro-animation
        const originalText = button.textContent;
        button.textContent = "Added! ✔️";
        button.style.backgroundColor = "#27ae60"; 
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = ""; 
        }, 1200);
    }

    // 2. Event Listener Setup
    const purchaseButtons = document.querySelectorAll('.add-to-cart-btn');
    purchaseButtons.forEach(btn => {
        btn.addEventListener('click', handleAddToCart);
    });

    // Run startup interface counter (from global-script.js)
    if (typeof updateHeaderCartCount === 'function') {
        updateHeaderCartCount();
    }
});