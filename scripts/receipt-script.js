window.addEventListener('DOMContentLoaded', () => {
    const savedCart = localStorage.getItem('checkoutItems');
    if (!savedCart) return;

    const cartItems = JSON.parse(savedCart);
    const tbody = document.getElementById('receipt-body');
    
    // 1. Get the last used discount percentage
    const usedVouchers = JSON.parse(localStorage.getItem('usedVouchers')) || [];
    const lastUsedCode = usedVouchers[usedVouchers.length - 1]; 
    
    const voucherMap = {
        "WELCOME-2026": 50,
        "BEACH-TRIP-4410": 35,
        "PALAWAN-TRIP-9982": 30
    };
    
    const discountPercent = lastUsedCode ? (voucherMap[lastUsedCode] || 0) : 0;
    let subtotal = 0;

    // 2. Render items
    cartItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.title}</td> 
            <td>${item.quantity}</td>
            <td>₱${(item.price * item.quantity).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
        `;
        tbody.appendChild(row);
        subtotal += (item.price * item.quantity);
    });

    // 3. Calculate Totals
    const discountVal = subtotal * (discountPercent / 100);
    const taxableAmount = subtotal - discountVal;
    const vat = taxableAmount * 0.12;
    const finalTotal = taxableAmount + vat;

    // 4. Display Values
    document.getElementById('receipt-subtotal').innerText = '₱' + subtotal.toLocaleString(undefined, {minimumFractionDigits: 2});
    
    const discountEl = document.getElementById('receipt-discount');
    if (discountVal > 0) {
        discountEl.innerText = '-₱' + discountVal.toLocaleString(undefined, {minimumFractionDigits: 2});
    } else {
        if (discountEl.parentElement) discountEl.parentElement.style.display = 'none';
    }
    
    document.getElementById('receipt-vat').innerText = '₱' + vat.toLocaleString(undefined, {minimumFractionDigits: 2});
    document.getElementById('receipt-total').innerText = '₱' + finalTotal.toLocaleString(undefined, {minimumFractionDigits: 2});
    
    // 5. Update Header
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.innerText = '0';
        cartCountElement.style.display = 'none';
    }

    // 6. Cleanup & Reward Logic (Linked to "Return Home" button)
    const returnHomeBtn = document.getElementById('returnHomeBtn');
    if (returnHomeBtn) {
        returnHomeBtn.addEventListener('click', () => {
            const bookedTrips = JSON.parse(localStorage.getItem('bookedTrips')) || [];
            const itemsToBook = JSON.parse(localStorage.getItem('checkoutItems')) || [];

            // Add new items to the booked history
            bookedTrips.push(...itemsToBook); 
            localStorage.setItem('bookedTrips', JSON.stringify(bookedTrips));

            // AWARD REWARD POINTS
            if (!localStorage.getItem('pointsAwarded')) {
                let userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
                    rewardPoints: 0,
                    tripsBooked: 0
                };

                // Add 100 points and increment trip count
                userProfile.rewardPoints = (userProfile.rewardPoints || 0) + 100;
                userProfile.tripsBooked = (userProfile.tripsBooked || 0) + 1;

                localStorage.setItem('userProfile', JSON.stringify(userProfile));
                localStorage.setItem('pointsAwarded', 'true'); // Prevent double-dipping
            }
            
            // Final Cleanup
            localStorage.removeItem('userShoppingArr');
            localStorage.removeItem('checkoutItems');
            window.location.href = 'index.html'; 
        });
    }
});