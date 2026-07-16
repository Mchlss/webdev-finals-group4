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