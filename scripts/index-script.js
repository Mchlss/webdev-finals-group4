document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('promoPopup');
    const closeBtn = document.getElementById('closePopup');

    // 1. Show popup
    setTimeout(() => {
        popup.showModal();
    }, 1500);

    // 2. Close when clicking the 'X' button
    closeBtn.addEventListener('click', () => {
        popup.close();
    });

    // 3. Close when clicking the backdrop (outside the banner)
    popup.addEventListener('click', (e) => {
        // If the user clicks the dialog element itself (the backdrop area)
        // and NOT the link or the image, close it.
        if (e.target === popup) {
            popup.close();
        }
    });
});

const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        let currentIdx = 0;

        function showSlide(index) {
            if (index >= slides.length) {
                currentIdx = 0;
            } else if (index < 0) {
                currentIdx = slides.length - 1;
            } else {
                currentIdx = index;
            }

            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            slides[currentIdx].classList.add('active');
            dots[currentIdx].classList.add('active');
        }

        nextBtn.addEventListener('click', () => showSlide(currentIdx + 1));
        prevBtn.addEventListener('click', () => showSlide(currentIdx - 1));

        function currentSlide(index) {
            showSlide(index);
        }