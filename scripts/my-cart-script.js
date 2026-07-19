document.addEventListener('DOMContentLoaded', () => {
    // 1. Element Selectors
    const cartItemsList = document.getElementById('cartItemsList');
    const cartSummary = document.getElementById('cartSummary');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const voucherSelect = document.getElementById('voucherSelect');
    const voucherSummaryRow = document.getElementById('voucherSummaryRow');
    const checkoutButton = document.getElementById('checkoutButton');
    const subtotalEl = document.getElementById('summarySubtotal');
    const discountEl = document.getElementById('summaryDiscount');
    const taxesEl = document.getElementById('summaryTaxes');
    const totalEl = document.getElementById('summaryTotal');

    // 2. Utility Functions
    function formatPHP(amount) {
        return `₱${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    // 3. Render Logic
    function renderCartItems() {
        let currentCart = JSON.parse(localStorage.getItem('userShoppingArr')) || [];

        if (currentCart.length === 0) {
            cartItemsList.innerHTML = '';
            cartSummary.style.display = 'none';
            emptyCartMessage.style.display = 'block';
            return;
        }

        emptyCartMessage.style.display = 'none';
        cartSummary.style.display = 'block';
        cartItemsList.innerHTML = '';

        currentCart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.setAttribute('data-price', item.price);
            itemDiv.innerHTML = `
                <div class="item-details">
                    <h3>${item.title}</h3>
                    <p class="item-description">${item.description}</p>
                    <div style="margin-top: 10px;">
                        <label style="font-size: 0.85rem;">Booking Date:</label>
                        <input type="date" class="date-input" data-index="${index}" value="${item.bookingDate || ''}" required>
                    </div>
                </div>
                <div class="item-pricing">
                    <span class="item-price">₱0.00</span>
                    <div class="quantity-control">
                        <button type="button" class="qty-btn minus-btn" data-index="${index}">-</button>
                        <input type="number" value="${item.quantity}" min="1" class="qty-input" data-index="${index}">
                        <button type="button" class="qty-btn plus-btn" data-index="${index}">+</button>
                    </div>
                    <button type="button" class="remove-btn" data-index="${index}">Remove</button>
                </div>
            `;
            cartItemsList.appendChild(itemDiv);
        });
        updateCartCalculations();
    }

    // 4. Calculation Logic
    function updateCartCalculations() {
        let totalSubtotal = 0;
        const items = document.querySelectorAll('.cart-item');
        let currentCart = JSON.parse(localStorage.getItem('userShoppingArr')) || [];

        items.forEach((item, index) => {
            const basePrice = parseFloat(item.getAttribute('data-price'));
            const qtyInput = item.querySelector('.qty-input');
            let qty = parseInt(qtyInput.value) || 1;
            if (currentCart[index]) currentCart[index].quantity = qty;
            
            const itemTotalPrice = basePrice * qty;
            totalSubtotal += itemTotalPrice;
            item.querySelector('.item-price').textContent = formatPHP(itemTotalPrice);
        });

        localStorage.setItem('userShoppingArr', JSON.stringify(currentCart));
        
        const selectedDiscountPercent = parseFloat(voucherSelect.value) || 0;
        const discountVal = totalSubtotal * (selectedDiscountPercent / 100); 

        if (discountVal > 0) {
            voucherSummaryRow.style.display = 'flex';
            const activeCodeName = voucherSelect.options[voucherSelect.selectedIndex].text.split(' ')[0];
            document.getElementById('appliedVoucherLabel').textContent = `Promo Code (${activeCodeName})`;
            discountEl.textContent = `-${formatPHP(discountVal)}`;
        } else {
            voucherSummaryRow.style.display = 'none';
        }

        const taxableAmount = totalSubtotal - discountVal;
        const computedTaxes = taxableAmount * 0.12;
        const completeFinalTotal = taxableAmount + computedTaxes;

        subtotalEl.textContent = formatPHP(totalSubtotal);
        taxesEl.textContent = formatPHP(computedTaxes);
        totalEl.textContent = formatPHP(completeFinalTotal);
        
        if (typeof window.updateHeaderCartCount === 'function') window.updateHeaderCartCount();
    }

    // 5. Consolidated Event Listeners
    cartItemsList.addEventListener('change', (e) => {
        if (e.target.classList.contains('date-input')) {
            const index = e.target.dataset.index;
            let cart = JSON.parse(localStorage.getItem('userShoppingArr')) || [];
            cart[index].bookingDate = e.target.value;
            localStorage.setItem('userShoppingArr', JSON.stringify(cart));
        }
    });

    cartItemsList.addEventListener('click', (e) => {
        let cart = JSON.parse(localStorage.getItem('userShoppingArr')) || [];
        const index = e.target.getAttribute('data-index');
        if (index === null) return;

        if (e.target.classList.contains('plus-btn')) cart[index].quantity += 1;
        else if (e.target.classList.contains('minus-btn') && cart[index].quantity > 1) cart[index].quantity -= 1;
        else if (e.target.classList.contains('remove-btn')) cart.splice(index, 1);
        else return;

        localStorage.setItem('userShoppingArr', JSON.stringify(cart));
        renderCartItems();
    });

    cartItemsList.addEventListener('input', (e) => {
        if (e.target.classList.contains('qty-input')) updateCartCalculations();
    });

    voucherSelect.addEventListener('change', updateCartCalculations);

    // 6. Checkout & Initialization
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            const cart = JSON.parse(localStorage.getItem('userShoppingArr')) || [];
            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }
            
            // Required Date Validation
            const hasMissingDate = cart.some(item => !item.bookingDate || item.bookingDate === "");
            if (hasMissingDate) {
                alert("Please select a booking date for all items!");
                return;
            }

            // RESET POINTS FLAG: Enable points earning for this new transaction
            localStorage.removeItem('pointsAwarded');

            if (voucherSelect.value && voucherSelect.selectedIndex > 0) {
                const voucherText = voucherSelect.options[voucherSelect.selectedIndex].text;
                const code = voucherText.split(' ')[0];
                let usedVouchers = JSON.parse(localStorage.getItem('usedVouchers')) || [];
                if (!usedVouchers.includes(code)) {
                    usedVouchers.push(code);
                    localStorage.setItem('usedVouchers', JSON.stringify(usedVouchers));
                }
            }
            localStorage.setItem('checkoutItems', JSON.stringify(cart));
            window.location.href = 'receipt.html';
        });
    }

    function loadRedeemedVouchers() {
        const availableVouchers = [
            { code: "WELCOME-2026", discountPercent: 50 },
            { code: "BEACH-TRIP-4410", discountPercent: 35 },
            { code: "PALAWAN-TRIP-9982", discountPercent: 30 }
        ];
        const redeemedCodes = JSON.parse(localStorage.getItem('redeemedVouchers')) || [];
        const usedCodes = JSON.parse(localStorage.getItem('usedVouchers')) || [];
        voucherSelect.innerHTML = '<option value="">-- Select an active voucher --</option>';
        availableVouchers.forEach(voucher => {
            if (redeemedCodes.includes(voucher.code) && !usedCodes.includes(voucher.code)) {
                const option = document.createElement('option');
                option.value = voucher.discountPercent;
                option.textContent = `${voucher.code} (${voucher.discountPercent}% Off)`;
                voucherSelect.appendChild(option);
            }
        });
    }

    loadRedeemedVouchers();
    renderCartItems();
});