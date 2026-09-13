const work = document.querySelector(".work");


/* =========================
   TILT FOLLOW MOUSE
========================= */

work.addEventListener("mousemove", (e) => {

    const rect = work.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY =
        ((x - centerX) / centerX) * 3;

    const rotateX =
        ((centerY - y) / centerY) * 2;


    work.style.transform = `
        perspective(800px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-6px)
        translateX(-50%)
        scale(1.015)
    `;
});


/* =========================
   MOUSE LEAVE
========================= */

work.addEventListener("mouseleave", () => {

    work.style.transform = "";

});


/* =========================
   MOUSE DOWN
========================= */

work.addEventListener("mousedown", () => {

    work.style.transform = `
        translateX(-50%)
        translateY(3px)
        scale(0.98)
        rotateX(0deg)
        rotateY(0deg)
    `;

});


/* =========================
   MOUSE UP
========================= */

work.addEventListener("mouseup", () => {

    work.style.transform = "";

});

// PARALLAX

window.addEventListener("scroll", throttle(parallax, 13));


function throttle(fn, wait) {

    let time = Date.now();

    return function () {

        if (time + wait - Date.now() < 0) {

            fn();

            time = Date.now();
        }
    };
}


function parallax() {

    const scrolled = window.pageYOffset;

    const front = document.querySelector(".front");
    const mid = document.querySelector(".mid");
    const work = document.querySelector(".work");


    // background xa
    front.style.transform =
        `translateY(${scrolled * -0.1}px)`;


    // background giữa
    mid.style.transform =
        `translateY(${scrolled * 0.35}px)`;


    // WORK bay lên
    work.style.transform =
        `translateX(-50%) translateY(${-scrolled * -0.1}px)`;
}

/* ==================================================
   BACKGROUND EFFECTS
================================================== */

const stars = document.querySelector(".stars");
const glitchLines = document.querySelector(".glitch-lines");
const bgEffects = document.querySelector(".bg-effects");


/* ==================================================
   STAR COLORS
================================================== */

const starColors = [
    "#fef87e",
    "#6bf3c3",
    "#f07aae",
    "#6c63ff",
    "#ffffff"
];


/* ==================================================
   CREATE STARS
================================================== */

for (let i = 0; i < 80; i++) {

    const star = document.createElement("span");

    star.classList.add("star");

    /* random size */

    if (Math.random() > 0.8) {
        star.classList.add("big");
    }

    /* random cross */

    if (Math.random() > 0.88) {
        star.classList.add("cross");
    }

    star.style.left =
        Math.random() * 100 + "%";

    star.style.top =
        Math.random() * 90 + "%";

    star.style.color =
        starColors[
            Math.floor(
                Math.random() * starColors.length
            )
        ];

    star.style.background =
        star.style.color;

    star.style.setProperty(
        "--duration",
        (1.5 + Math.random() * 4) + "s"
    );

    star.style.setProperty(
        "--delay",
        (Math.random() * 1.1) + "s"
    );

    stars.appendChild(star);
}


/* ==================================================
   CREATE GLITCH LINES
================================================== */

for (let i = 0; i < 50; i++) {

    const glitch =
        document.createElement("span");

    glitch.classList.add("glitch");

    glitch.style.top =
        Math.random() * 100 + "%";

    glitch.style.left =
        Math.random() * 90 + "%";

    glitch.style.width =
        (20 + Math.random() * 120) + "px";

    glitch.style.background =
        starColors[
            Math.floor(
                Math.random() * starColors.length
            )
        ];

    glitch.style.setProperty(
        "--duration",
        (2 + Math.random() * 5) + "s"
    );

    glitch.style.setProperty(
        "--delay",
        (Math.random() * 3) + "s"
    );

    glitchLines.appendChild(glitch);
}


/* ==================================================
   CREATE FLOATING PIXELS
================================================== */

for (let i = 0; i < 150; i++) {

    const pixel =
        document.createElement("span");

    pixel.classList.add("pixel");

    pixel.style.left =
        Math.random() * 100 + "%";

    pixel.style.top =
        150 + Math.random() * 90 + "%";
        

    pixel.style.background =
        starColors[
            Math.floor(
                Math.random() * starColors.length
            )
        ];

    pixel.style.setProperty(
        "--duration",
        (3 + Math.random() * 6) + "s"
    );

    pixel.style.setProperty(
        "--delay",
        (Math.random() * 1.2) + "s"
    );

    bgEffects.appendChild(pixel);
}
//EXPLODE

work.addEventListener("click", () => {
    work.classList.remove("burst");

    void work.offsetWidth;

    work.classList.add("burst");
});
//// ================================================
// PROJECT IMAGE SLIDER
// ================================================

// ================================================
// PROJECT IMAGE SLIDER
// ================================================

const slider = document.querySelector(".project-slider");

if (slider) {

    const slides = slider.querySelectorAll(".slide");

    const prevButton = slider.querySelector(".prev");
    const nextButton = slider.querySelector(".next");

    const currentNumber = slider.querySelector(".current-slide");
    const totalNumber = slider.querySelector(".total-slide");

    let currentSlide = 0;
    let autoPlay;

    // Touch
    let touchStartX = 0;
    let touchEndX = 0;

    // ============================================
    // FORMAT NUMBER
    // ============================================

    function formatNumber(number) {
        return String(number).padStart(2, "0");
    }


    // ============================================
    // SHOW SLIDE
    // ============================================

    function showSlide(index) {

        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
        });

        currentNumber.textContent =
            formatNumber(index + 1);

        totalNumber.textContent =
            formatNumber(slides.length);
    }


    // ============================================
    // NEXT
    // ============================================

    function nextSlide() {

        currentSlide++;

        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }

        showSlide(currentSlide);
    }


    // ============================================
    // PREVIOUS
    // ============================================

    function previousSlide() {

        currentSlide--;

        if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }

        showSlide(currentSlide);
    }


    // ============================================
    // AUTOPLAY
    // ============================================

    function startAutoPlay() {

        autoPlay = setInterval(() => {
            nextSlide();
        }, 4000);
    }


    function resetAutoPlay() {

        clearInterval(autoPlay);

        startAutoPlay();
    }


    // ============================================
    // BUTTONS
    // ============================================

    nextButton.addEventListener("click", () => {

        nextSlide();
        resetAutoPlay();

    });


    prevButton.addEventListener("click", () => {

        previousSlide();
        resetAutoPlay();

    });


    // ============================================
    // TOUCH START
    // ============================================

    slider.addEventListener("touchstart", (e) => {

        touchStartX = e.changedTouches[0].screenX;

        clearInterval(autoPlay);

    }, { passive: true });


    // ============================================
    // TOUCH END
    // ============================================

    slider.addEventListener("touchend", (e) => {

        touchEndX = e.changedTouches[0].screenX;

        handleSwipe();

        startAutoPlay();

    }, { passive: true });


    // ============================================
    // HANDLE SWIPE
    // ============================================

    function handleSwipe() {

        const swipeDistance =
            touchEndX - touchStartX;

        const minSwipeDistance = 50;


        // SWIPE LEFT → NEXT

        if (swipeDistance < -minSwipeDistance) {

            nextSlide();

        }


        // SWIPE RIGHT → PREVIOUS

        if (swipeDistance > minSwipeDistance) {

            previousSlide();

        }
    }


    // ============================================
    // DESKTOP HOVER
    // ============================================

    slider.addEventListener("mouseenter", () => {

        clearInterval(autoPlay);

    });


    slider.addEventListener("mouseleave", () => {

        startAutoPlay();

    });


    // ============================================
    // INITIALIZE
    // ============================================

    showSlide(0);

    startAutoPlay();

}