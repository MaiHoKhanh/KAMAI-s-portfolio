//avatar
const avatarBox = document.querySelector(".avatar-box");

avatarBox.addEventListener("click", () => {
    avatarBox.classList.toggle("active");
});
//back
const section1 = document.querySelector(".section1");
const clickContinue = document.querySelector(".click");
const backButton = document.querySelector(".back");


/* STATE 1 → STATE 2 */

clickContinue.addEventListener("click", () => {

    section1.classList.add("show-state-2");

});


/* STATE 2 → STATE 1 */

backButton.addEventListener("click", () => {

    section1.classList.remove("show-state-2");

});


//INVENTORY
const inventory = document.querySelector(".inventory-2");

const items = inventory.querySelectorAll(
    ".game, .file, .tag, .shuttlecock"
);

items.forEach(item => {

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;


    /* =========================
       HOVER
    ========================= */

    item.addEventListener("mouseenter", () => {

        if (!isDragging) {
            item.style.zIndex = "1000";
        }

    });


    item.addEventListener("mouseleave", () => {

        if (!isDragging) {
            item.style.zIndex = "20";
        }

    });


    /* =========================
       PRESS + HOLD
    ========================= */

    item.addEventListener("mousedown", (e) => {

        if (e.button !== 0) return;

        isDragging = true;

        const itemRect =
            item.getBoundingClientRect();

        offsetX =
            e.clientX - itemRect.left;

        offsetY =
            e.clientY - itemRect.top;


        /* QUAN TRỌNG */
        item.style.zIndex = "9999";

        e.preventDefault();

    });


    /* =========================
       DRAG
    ========================= */

    document.addEventListener("mousemove", (e) => {

        if (!isDragging) return;

        const inventoryRect =
            inventory.getBoundingClientRect();

        const itemRect =
            item.getBoundingClientRect();


        let x =
            e.clientX -
            inventoryRect.left -
            offsetX;

        let y =
            e.clientY -
            inventoryRect.top -
            offsetY;


        /* LIMIT */

        const maxX =
            inventoryRect.width -
            itemRect.width;

        const maxY =
            inventoryRect.height -
            itemRect.height;


        x = Math.max(
            0,
            Math.min(x, maxX)
        );

        y = Math.max(
            0,
            Math.min(y, maxY)
        );


        item.style.left = `${x}px`;
        item.style.top = `${y}px`;

        item.style.right = "auto";
        item.style.bottom = "auto";

    });


    /* =========================
       RELEASE
    ========================= */

    document.addEventListener("mouseup", () => {

        if (!isDragging) return;

        isDragging = false;

        /*
         * GIỮ ITEM TRÊN CÙNG
         * SAU KHI THẢ
         */
        item.style.zIndex = "1000";

    });

});

// ==================================================
// SPARKS
// ==================================================

const sparks = document.querySelector(".sparks");

if (sparks) {

    const sparkColors = [
        "#fef87e",
        "#6bf3c3",
        "#f07aae",
        "#6c63ff",
        "#ffffff"
    ];


    for (let i = 0; i < 90; i++) {

        const spark = document.createElement("span");

        spark.classList.add("spark");


        // random size

        if (Math.random() > 0.8) {
            spark.classList.add("big");
        }


        // random cross

        if (Math.random() > 0.88) {
            spark.classList.add("cross");
        }


        // random position

        spark.style.left =
            Math.random() * 100 + "%";

        spark.style.top =
            Math.random() * 100 + "%";


        // random color

        const color =
            sparkColors[
                Math.floor(
                    Math.random() * sparkColors.length
                )
            ];

        spark.style.color = color;


        // random animation

        spark.style.setProperty(
            "--duration",
            1.5 + Math.random() * 4 + "s"
        );

        spark.style.setProperty(
            "--delay",
            Math.random() * 4 + "s"
        );


        sparks.appendChild(spark);
    }

}


// =========================
// SECTION 2 PARALLAX
// =========================

function parallaxSection2() {

    const scrolled = window.pageYOffset;

    const top = document.querySelector(".top");
    const bottom = document.querySelector(".bottom");

    // TOP → chạy lên
    top.style.transform =
        `translateY(${scrolled * 0.105}px)`;

    // BOTTOM → chạy xuống
    bottom.style.transform =
        `translateY(${scrolled * -0.05}px)`;
}

window.addEventListener("scroll", parallaxSection2);