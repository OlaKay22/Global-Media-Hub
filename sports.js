document.addEventListener('DOMContentLoaded', () => {
    // Video Carousel Logic
    const carousel = document.getElementById('videoCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (carousel && prevBtn && nextBtn) {
        // Calculate scroll amount based on one video card width + gap
        const getScrollAmount = () => {
            const card = carousel.querySelector('.video-card');
            return card ? card.offsetWidth + 30 : 330;
        };

        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });
    }
});
