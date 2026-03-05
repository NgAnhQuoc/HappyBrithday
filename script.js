document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true
    });

    // Start Surprise Button
    const startBtn = document.getElementById('start-btn');
    startBtn.addEventListener('click', () => {
        document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
        createHearts();
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ff4fa3', '#ffecf5', '#ffffff']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ff4fa3', '#ffecf5', '#ffffff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    });

    // Carousel Logic
    const carousel = document.getElementById('image-carousel');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    let degrees = 0;
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let autoRotateInterval;

    function updateRotation() {
        carousel.style.transform = `rotateY(${degrees}deg)`;
    }

    prevBtn.addEventListener('click', () => {
        degrees += 90;
        updateRotation();
    });

    nextBtn.addEventListener('click', () => {
        degrees -= 90;
        updateRotation();
    });

    // Drag Logic
    const gallerySection = document.getElementById('gallery');

    const handleDragStart = (e) => {
        isDragging = true;
        startX = e.pageX || e.touches[0].pageX;
        carousel.style.transition = 'none'; // Disable transition during drag
        clearInterval(autoRotateInterval); // Stop auto-rotate on drag
        gallerySection.style.cursor = 'grabbing';
    };

    const handleDragMove = (e) => {
        if (!isDragging) return;
        e.preventDefault(); // Prevent accidental selection/ghosting
        currentX = e.pageX || e.touches[0].pageX;
        const diffX = currentX - startX;
        const sensitivity = 0.7; // Slightly higher sensitivity for "grab" feel
        const dragDegrees = degrees + diffX * sensitivity;
        carousel.style.transform = `rotateY(${dragDegrees}deg)`;
    };

    const handleDragEnd = (e) => {
        if (!isDragging) return;
        isDragging = false;
        gallerySection.style.cursor = 'grab';
        const diffX = currentX - startX;
        const sensitivity = 0.7;
        degrees += diffX * sensitivity;
        
        // Snap to nearest 90 degrees (optional, but keeps it neat)
        degrees = Math.round(degrees / 90) * 90;
        
        carousel.style.transition = 'transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        updateRotation();
        startAutoRotate(); // Restart auto-rotate
    };

    gallerySection.addEventListener('mousedown', handleDragStart);
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);

    gallerySection.addEventListener('touchstart', handleDragStart);
    window.addEventListener('touchmove', handleDragMove);
    window.addEventListener('touchend', handleDragEnd);

    // Auto rotate
    function startAutoRotate() {
        autoRotateInterval = setInterval(() => {
            if (!isDragging) {
                degrees -= 90;
                updateRotation();
            }
        }, 3000);
    }

    startAutoRotate();

    // Gift Button
    const giftBtn = document.getElementById('gift-btn');
    const surpriseText = document.getElementById('surprise-text');

    giftBtn.addEventListener('click', () => {
        giftBtn.classList.add('hidden');
        surpriseText.classList.remove('hidden');
        
        // Fireworks effect
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        // Heart explosion
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff4fa3', '#ff0000']
        });
    });

    // Floating Hearts Effect
    function createHearts() {
        const container = document.getElementById('hearts-container');
        setInterval(() => {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.innerHTML = '❤️';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = Math.random() * 2 + 3 + 's';
            container.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, 5000);
        }, 300);
    }
    
    // Auto-start some hearts
    createHearts();
});

// Lightbox functions
function openLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightbox.style.display = 'block';
    lightboxImg.src = src;
    document.body.style.overflow = 'hidden'; // Stop scrolling
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto'; // Resume scrolling
}
