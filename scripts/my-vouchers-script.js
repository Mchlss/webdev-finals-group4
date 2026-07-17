document.addEventListener('DOMContentLoaded', () => {
    const redeemButtons = document.querySelectorAll('.redeem-btn');
    let redeemedVouchers = JSON.parse(localStorage.getItem('redeemedVouchers')) || [];

    function updateUI() {
        document.querySelectorAll('.voucher-card').forEach(card => {
            const code = card.querySelector('.voucher-code-box').textContent.trim();
            if (redeemedVouchers.includes(code)) {
                const btn = card.querySelector('.redeem-btn');
                btn.textContent = 'Redeemed';
                btn.disabled = true;
                card.classList.remove('status-valid');
                card.classList.add('status-redeemed');
            }
        });
    }

    redeemButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.voucher-card');
            const code = card.querySelector('.voucher-code-box').textContent.trim();

            if (!redeemedVouchers.includes(code)) {
                redeemedVouchers.push(code);
                localStorage.setItem('redeemedVouchers', JSON.stringify(redeemedVouchers));
                
                updateUI();
            }
        });
    });

    updateUI();
});