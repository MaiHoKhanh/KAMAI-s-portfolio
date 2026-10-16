
//star sec 1
const starsContainer = document.querySelector(".hero .stars");

const STAR_COUNT = 70;

for (let i = 0; i < STAR_COUNT; i++) {

    const star = document.createElement("div");
    star.classList.add("star");

    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";

    const size = Math.random() < 0.75
        ? 3
        : Math.random() * 5 + 3;

    star.style.width = size + "px";
    star.style.height = size + "px";

    star.style.setProperty(
        "--moveX",
        (Math.random() * 30 - 15) + "px"
    );

    star.style.setProperty(
        "--moveY",
        (Math.random() * 30 - 15) + "px"
    );

    star.style.setProperty(
        "--duration",
        (4 + Math.random() * 3) + "s"
    );

    star.style.setProperty(
        "--blink",
        (2 + Math.random() * 4) + "s"
    );

    star.style.animationDelay =
        Math.random() * 3 + "s";

    starsContainer.appendChild(star);
}
// stars sec 2
const section2Stars =
    document.querySelector(".section2-stars");

const SECTION2_STAR_COUNT = 50;

for (let i = 0; i < SECTION2_STAR_COUNT; i++) {

    const star = document.createElement("div");

    star.classList.add("section2-star");

    /* Vị trí random */

    star.style.left =
        Math.random() * 100 + "%";

    star.style.top =
        Math.random() * 100 + "%";


    /* Kích thước pixel */

    const size =
        Math.random() < 0.8
            ? 3
            : Math.random() * 4 + 3;

    star.style.width = size + "px";
    star.style.height = size + "px";


    /* Hướng di chuyển */

    star.style.setProperty(
        "--moveX",
        (Math.random() * 24 - 12) + "px"
    );

    star.style.setProperty(
        "--moveY",
        (Math.random() * 24 - 12) + "px"
    );


    /* Tốc độ */

    star.style.setProperty(
        "--duration",
        (3 + Math.random() * 4) + "s"
    );

    star.style.setProperty(
        "--blink",
        (1.5 + Math.random() * 3) + "s"
    );


    /* Random thời điểm bắt đầu */

    star.style.animationDelay =
        Math.random() * 4 + "s";


    section2Stars.appendChild(star);
}
//fall animation sec 2
/* =====================================================
   SECTION 2 PHYSICS
===================================================== */

const subhero = document.querySelector(".subhero");

const blockSelectors = [
    ".block1",
    ".block2",
    ".block3",
    ".block4",
    ".block5",
    ".block6",
    ".block7"
];

const physicsBlocks = [];

let physicsStarted = false;


/* =====================================================
   SETTINGS
===================================================== */

const GRAVITY = 0.65;

const BOUNCE = 0.38;

const AIR_RESISTANCE = 0.985;

const ROTATION_FRICTION = 0.96;

const MAX_ROTATION = 12;


/* =====================================================
   INTERSECTION OBSERVER
===================================================== */

const sectionObserver =
    new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting &&
                    !physicsStarted
                ) {

                    physicsStarted = true;

                    startPhysics();
                }

            });

        },

        {
            threshold: 0.15
        }
    );


if (blockSelectors.some(selector => subhero.querySelector(selector))) {
    sectionObserver.observe(subhero);
}


/* =====================================================
   START PHYSICS
===================================================== */

function startPhysics() {

    physicsBlocks.length = 0;

    blockSelectors.forEach(
        (selector, index) => {

            const element =
                subhero.querySelector(selector);

            if (!element) return;

            const rect =
                element.getBoundingClientRect();

            const sectionWidth =
                subhero.clientWidth;


            const width =
                rect.width;


            const computed =
                getComputedStyle(element);


            let x =
                parseFloat(computed.left);


            /*
             * Nếu left là %
             */

            if (
                computed.left.includes("%")
            ) {

                x =
                    sectionWidth *
                    parseFloat(computed.left) /
                    100;
            }


            /*
             * Không cho x vượt section
             */

            x = Math.max(
                0,
                Math.min(
                    x,
                    sectionWidth - width
                )
            );


            const floor =
                subhero.clientHeight -
                rect.height;


            const block = {

                element: element,

                width: rect.width,

                height: rect.height,


                /* vị trí */

                x: x,

                y: -rect.height - 100,


                /* vị trí đáy */

                floor: floor,


                /* vận tốc */

                velocityX: 0,

                velocityY:
                    2 + index * 0.4,


                /* rotation */

                rotation:
                    (Math.random() * 10) - 5,

                velocityRotation:
                    (Math.random() * 2) - 1,


                /* state */

                dragging: false,

                landed: false,

                released: false,


                /* delay */

                startTime:
                    performance.now() +
                    index * 180
            };


            physicsBlocks.push(block);


   

            element.style.animation =
                "none";



            element.style.opacity =
                "1";


     

            renderBlock(block);


            setupDrag(block);
        }
    );


    requestAnimationFrame(
        updatePhysics
    );
}


/* =====================================================
   PHYSICS LOOP
===================================================== */

let previousTime =
    performance.now();


function updatePhysics(time) {

    const delta =
        Math.min(
            (time - previousTime) / 16.67,
            2
        );


    previousTime = time;


    const sectionWidth =
        subhero.clientWidth;


    const sectionHeight =
        subhero.clientHeight;


    physicsBlocks.forEach(block => {


        /*
         * Delay lúc bắt đầu rơi
         */

        if (
            time <
            block.startTime
        ) {

            return;
        }


        /*
         * Nếu đang drag
         */

        if (block.dragging) {

            renderBlock(block);

            return;
        }


        /*
         * Nếu đã nằm yên
         */

        if (block.landed) {

            renderBlock(block);

            return;
        }


        /* =================================================
           GRAVITY
        ================================================= */

        block.velocityY +=
            GRAVITY * delta;


        /*
         * Air resistance
         */

        block.velocityX *=
            Math.pow(
                AIR_RESISTANCE,
                delta
            );


        /*
         * Move
         */

        block.x +=
            block.velocityX * delta;


        block.y +=
            block.velocityY * delta;


        /*
         * Rotation
         */

        block.rotation +=
            block.velocityRotation * delta;


        block.velocityRotation *=
            Math.pow(
                ROTATION_FRICTION,
                delta
            );


        /* =================================================
           LEFT WALL
        ================================================= */

        if (block.x < 0) {

            block.x = 0;

            block.velocityX *= -0.45;

            block.velocityRotation *= -0.5;
        }


        /* =================================================
           RIGHT WALL
        ================================================= */

        const maxX =
            sectionWidth -
            block.width;


        if (block.x > maxX) {

            block.x = maxX;

            block.velocityX *= -0.45;

            block.velocityRotation *= -0.5;
        }


        /* =================================================
           FLOOR
        ================================================= */

        /*
         * đảm bảo block
         * ko rơi xuống footer.
         */

        const floor =
            sectionHeight -
            block.height;


        if (
            block.y >= floor
        ) {

            /*
             * Ép block về đúng đáy
             */

            block.y = floor;


            /*
             * Bounce
             */

            block.velocityY *=
                -BOUNCE;


            /*
             * Giảm horizontal velocity
             */

            block.velocityX *=
                0.72;


            /*
             * Giảm rotation
             */

            block.velocityRotation *=
                0.45;


            /*
             * Nếu bounce quá nhỏ
             * → đứng yên
             */

            if (
                Math.abs(
                    block.velocityY
                ) < 2
            ) {

                block.velocityY = 0;

                block.velocityX = 0;

                block.velocityRotation = 0;

                block.rotation = 0;

                block.landed = true;
            }
        }


        /* =================================================
           SAFETY LIMIT
        ================================================= */


        if (
            block.y >
            floor
        ) {

            block.y = floor;

            block.velocityY = 0;
        }


        if (
            block.y < 0 &&
            block.velocityY < 0
        ) {

            block.y = 0;

            block.velocityY *= -0.2;
        }


        renderBlock(block);
    });


    requestAnimationFrame(
        updatePhysics
    );
}


/* =====================================================
   RENDER
===================================================== */

function renderBlock(block) {

    block.element.style.transform =

        `translate3d(
            ${block.x}px,
            ${block.y}px,
            0
        )
        rotate(
            ${block.rotation}deg
        )`;
}


/* =====================================================
   DRAG
===================================================== */

function setupDrag(block) {

    const element =
        block.element;


    let offsetX = 0;

    let offsetY = 0;


    let lastX = 0;

    let lastY = 0;


    let lastTime = 0;


    /* =================================================
       POINTER DOWN
    ================================================= */

    element.addEventListener(
        "pointerdown",
        (event) => {

            event.preventDefault();


            const sectionRect =
                subhero.getBoundingClientRect();


            block.dragging = true;

            block.landed = false;


            element.classList.add(
                "physics-dragging"
            );


            /*
             * Mouse → block offset
             */

            offsetX =
                event.clientX -
                sectionRect.left -
                block.x;


            offsetY =
                event.clientY -
                sectionRect.top -
                block.y;


            /*
             * Reset velocity
             */

            block.velocityX = 0;

            block.velocityY = 0;

            block.velocityRotation = 0;


            lastX =
                event.clientX;

            lastY =
                event.clientY;

            lastTime =
                performance.now();


            /*
             * Đưa block lên trên
             */

            element.style.zIndex =
                "100";


            element.setPointerCapture(
                event.pointerId
            );
        }
    );


    /* =================================================
       POINTER MOVE
    ================================================= */

    element.addEventListener(
        "pointermove",
        (event) => {

            if (
                !block.dragging
            ) {

                return;
            }


            const sectionRect =
                subhero.getBoundingClientRect();


            /*
             * Mouse position
             */

            let newX =
                event.clientX -
                sectionRect.left -
                offsetX;


            let newY =
                event.clientY -
                sectionRect.top -
                offsetY;


            /*
             * SECTION BOUNDARIES
             */

            const maxX =
                subhero.clientWidth -
                block.width;


            const maxY =
                subhero.clientHeight -
                block.height;


            /*
             * Clamp X
             */

            newX =
                Math.max(
                    0,
                    Math.min(
                        newX,
                        maxX
                    )
                );


            /*
             * Clamp Y
             *
             * Đây là thứ ngăn block
             * bị kéo xuống footer.
             */

            newY =
                Math.max(
                    0,
                    Math.min(
                        newY,
                        maxY
                    )
                );


            /*
             * Tính velocity
             */

            const now =
                performance.now();


            const dt =
                Math.max(
                    now - lastTime,
                    1
                );


            block.velocityX =
                (
                    newX - block.x
                ) /
                dt *
                16;


            block.velocityY =
                (
                    newY - block.y
                ) /
                dt *
                16;


            /*
             * Update position
             */

            block.x = newX;

            block.y = newY;


            /*
             * Rotation theo hướng kéo
             */

            block.rotation =
                Math.max(
                    -MAX_ROTATION,
                    Math.min(
                        MAX_ROTATION,
                        block.velocityX * 0.7
                    )
                );


            lastX =
                event.clientX;

            lastY =
                event.clientY;

            lastTime =
                now;


            renderBlock(block);
        }
    );


    /* =================================================
       POINTER UP
    ================================================= */

    element.addEventListener(
        "pointerup",
        (event) => {

            if (
                !block.dragging
            ) {

                return;
            }


            block.dragging = false;


            element.classList.remove(
                "physics-dragging"
            );


            /*
             * Giảm momentum
             */

            block.velocityX *= 0.45;

            block.velocityY *= 0.45;


            /*
             * Bật gravity lại
             */

            block.landed = false;


            /*
             * Đảm bảo không nằm dưới đáy
             */

            const maxY =
                subhero.clientHeight -
                block.height;


            if (
                block.y >= maxY
            ) {

                block.y = maxY;

                /*
                 * Cho nó bật nhẹ lên
                 */

                block.velocityY =
                    -5;
            }


            /*
             * Reset z-index
             */

            element.style.zIndex =
                "";


            element.releasePointerCapture(
                event.pointerId
            );
        }
    );
}
//text
const nameElement = document.getElementById("name");

const targetText = "KAMAI'S";
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

const scrambleSpeed = 50;
const iterationsPerLetter = 8;

function scrambleName() {

    let currentIndex = 0;
    let iteration = 0;

    function animate() {

        let result = "";

        for (let i = 0; i < targetText.length; i++) {

            if (i < currentIndex) {
                result += targetText[i];
            } else {
                result += characters[
                    Math.floor(Math.random() * characters.length)
                ];
            }
        }

        nameElement.textContent = result;

        iteration++;

        if (iteration >= iterationsPerLetter) {
            currentIndex++;
            iteration = 0;
        }

        if (currentIndex <= targetText.length) {

            setTimeout(animate, scrambleSpeed);

        } else {

            // Giữ trong 3 giây
            nameElement.textContent = targetText;

            setTimeout(() => {
                scrambleName();
            }, 3000);
        }
    }

    animate();
}

scrambleName();

/* =====================================================
   SECTION 2 TETRIS MINI GAME
===================================================== */

const section2Views = document.querySelectorAll("[id^='section2-'][id$='-view']");
const section2Board = document.getElementById("section2-board");

if (section2Board) {
    const baseRowCount = 10;
    const columnCount = window.matchMedia("(max-width: 480px)").matches ? 8 : 16;
    const totalPieces = 7;
    const aboutMeFacts = [
        "I'm a dog lover.",
        "I'm a casual gamer.",
        "I'm a part-time introvert.",
        "I'm a Ctrl+Z specialist.",
        "I love sleeping.",
        "I also enjoy building model kits."
    ];
    const starPiece = {
        color: "yellow",
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [1, 0, 1]
        ]
    };
    const pieceTypes = [
        { color: "mint", shape: [[1, 1, 1, 1]] },
        { color: "pink", shape: [[1, 1], [1, 1]] },
        { color: "coral", shape: [[1, 0, 0], [1, 1, 1]] },
        { color: "blue", shape: [[0, 0, 1], [1, 1, 1]] },
        { color: "white", shape: [[1, 1, 0], [0, 1, 1]] },
        { color: "orange", shape: [[0, 1, 1], [1, 1, 0]] }
    ];

    const boardCells = [];
    const gameAside = document.querySelector(".section2-game-aside");
    let rowCount = baseRowCount;
    let board = [];
    let currentPiece = null;
    let nextPiece = null;
    let piecesPlayed = 0;
    let factDeck = [];
    let gameTimer = null;
    let gameRunning = false;

    for (let index = 0; index < rowCount * columnCount; index++) {
        const cell = document.createElement("div");
        cell.className = "section2-cell";
        cell.setAttribute("role", "gridcell");
        section2Board.appendChild(cell);
        boardCells.push(cell);
    }

    function showSection2View(viewName) {
        section2Views.forEach(view => {
            view.hidden = view.id !== `section2-${viewName}-view`;
        });
    }

    function randomPiece(isStar = false) {
        const selected = isStar
            ? starPiece
            : pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
        const shape = selected.shape.map(row => [...row]);

        return {
            shape,
            color: selected.color,
            isStar,
            x: Math.floor((columnCount - shape[0].length) / 2),
            y: 0
        };
    }

    function drawPreview(piece) {
        const preview = document.getElementById("section2-next-piece");
        preview.replaceChildren();
        preview.classList.remove("is-done");
        preview.style.setProperty("--preview-columns", piece.shape[0].length);

        piece.shape.forEach(row => row.forEach(value => {
            const cell = document.createElement("span");
            if (value) cell.className = `is-filled tone-${piece.color}`;
            preview.appendChild(cell);
        }));
    }

    function drawDonePreview() {
        const preview = document.getElementById("section2-next-piece");
        preview.replaceChildren();
        preview.classList.add("is-done");
        preview.textContent = "DONE";
    }

    function measureFullFactsHeight() {
        const asideClone = gameAside.cloneNode(true);
        const factList = asideClone.querySelector(".section2-facts");
        const asideWidth = gameAside.getBoundingClientRect().width;

        factList.replaceChildren(...aboutMeFacts.map(fact => {
            const item = document.createElement("li");
            item.className = "section2-fact";
            item.textContent = fact;
            return item;
        }));
        asideClone.querySelectorAll("[id]").forEach(element => element.removeAttribute("id"));
        Object.assign(asideClone.style, {
            position: "fixed",
            left: "-10000px",
            top: "0",
            width: `${asideWidth}px`,
            height: "auto",
            minHeight: "0",
            visibility: "hidden",
            pointerEvents: "none"
        });

        document.body.appendChild(asideClone);
        const height = asideClone.getBoundingClientRect().height;
        asideClone.remove();
        return height;
    }

    function syncBoardRowsToFacts() {
        const compactLayout = window.matchMedia(
            "(max-width: 1100px), (hover: none) and (pointer: coarse)"
        ).matches;
        const boardWidth = section2Board.getBoundingClientRect().width;
        const asideHeight = compactLayout && boardWidth > 0
            ? measureFullFactsHeight()
            : gameAside.getBoundingClientRect().height;
        const boardFrame = section2Board.parentElement;
        const frameExtraHeight = boardFrame.getBoundingClientRect().height -
            section2Board.getBoundingClientRect().height;
        const targetBoardHeight = Math.max(0, asideHeight - frameExtraHeight);
        const targetRows = compactLayout && boardWidth > 0
            ? Math.max(baseRowCount, Math.ceil(targetBoardHeight * columnCount / boardWidth))
            : baseRowCount;

        if (targetRows <= rowCount) return;

        while (rowCount < targetRows) {
            rowCount++;
            board.push(Array(columnCount).fill(null));

            for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
                const cell = document.createElement("div");
                cell.className = "section2-cell";
                cell.setAttribute("role", "gridcell");
                section2Board.appendChild(cell);
                boardCells.push(cell);
            }
        }

        section2Board.style.setProperty("--board-visible-rows", rowCount);
    }

    function collides(shape, x, y) {
        return shape.some((row, rowIndex) => row.some((value, columnIndex) => {
            if (!value) return false;

            const nextX = x + columnIndex;
            const nextY = y + rowIndex;

            return nextX < 0 || nextX >= columnCount || nextY >= rowCount ||
                (nextY >= 0 && board[nextY][nextX] !== null);
        }));
    }

    function renderBoard() {
        const visibleCells = new Map();

        board.forEach((row, rowIndex) => row.forEach((color, columnIndex) => {
            if (color) visibleCells.set(rowIndex * columnCount + columnIndex, color);
        }));

        if (currentPiece) {
            currentPiece.shape.forEach((row, rowIndex) => row.forEach((value, columnIndex) => {
                if (!value) return;

                const x = currentPiece.x + columnIndex;
                const y = currentPiece.y + rowIndex;
                if (y >= 0 && y < rowCount && x >= 0 && x < columnCount) {
                    visibleCells.set(y * columnCount + x, currentPiece.color);
                }
            }));
        }

        boardCells.forEach((cell, index) => {
            const color = visibleCells.get(index);
            cell.className = color ? `section2-cell is-filled tone-${color}` : "section2-cell";
        });
    }

    function updatePieceCount() {
        document.getElementById("section2-piece-count").textContent = piecesPlayed;
    }

    function lockPiece() {
        currentPiece.shape.forEach((row, rowIndex) => row.forEach((value, columnIndex) => {
            if (value) {
                const y = currentPiece.y + rowIndex;
                const x = currentPiece.x + columnIndex;
                if (y >= 0) board[y][x] = currentPiece.color;
            }
        }));

        board = board.filter(row => row.some(cell => cell === null));
        while (board.length < rowCount) {
            board.unshift(Array(columnCount).fill(null));
        }

        piecesPlayed++;
        updatePieceCount();
        const landedFact = factDeck[piecesPlayed - 1];
        if (landedFact) {
            const factList = document.getElementById("section2-facts");
            const placeholder = factList.querySelector(".section2-fact-placeholder");
            if (placeholder) placeholder.remove();

            const factItem = document.createElement("li");
            factItem.className = "section2-fact";
            factItem.textContent = landedFact;
            factList.appendChild(factItem);
            syncBoardRowsToFacts();
        }

        if (piecesPlayed >= totalPieces) {
            drawDonePreview();
            showThanksOnBoard();
            return;
        }

        currentPiece = nextPiece;
        nextPiece = randomPiece(piecesPlayed === totalPieces - 2);
        if (currentPiece.isStar) {
            drawDonePreview();
        } else {
            drawPreview(nextPiece);
        }
        document.getElementById("section2-live-status").textContent = "IN PLAY";

        if (collides(currentPiece.shape, currentPiece.x, currentPiece.y)) {
            finishGame();
            return;
        }

        renderBoard();
    }

    function finishGame() {
        gameRunning = false;
        window.clearInterval(gameTimer);
        document.getElementById("section2-live-status").textContent = "FINISHED";
        showSection2View("ending");
    }

    function showThanksOnBoard() {
        gameRunning = false;
        window.clearInterval(gameTimer);
        document.getElementById("section2-live-status").textContent = "FINISHED";
        document.getElementById("section2-game-view").classList.add("is-complete");
        document.querySelector(".section2-touch-controls").hidden = true;
        document.getElementById("section2-thanks-overlay").hidden = false;
    }

    function stepPiece() {
        if (!gameRunning) return;

        if (!collides(currentPiece.shape, currentPiece.x, currentPiece.y + 1)) {
            currentPiece.y++;
            renderBoard();
        } else {
            lockPiece();
        }
    }

    function rotatePiece() {
        const rotated = currentPiece.shape[0].map((_, index) =>
            currentPiece.shape.map(row => row[index]).reverse()
        );
        const kickOffsets = [0, -1, 1, -2, 2];
        const offset = kickOffsets.find(value =>
            !collides(rotated, currentPiece.x + value, currentPiece.y)
        );

        if (offset !== undefined) {
            currentPiece.shape = rotated;
            currentPiece.x += offset;
            renderBoard();
        }
    }

    function handleGameKey(key) {
        if (!gameRunning) return;

        if (key === "ArrowLeft" && !collides(currentPiece.shape, currentPiece.x - 1, currentPiece.y)) {
            currentPiece.x--;
        } else if (key === "ArrowRight" && !collides(currentPiece.shape, currentPiece.x + 1, currentPiece.y)) {
            currentPiece.x++;
        } else if (key === "ArrowDown") {
            stepPiece();
            return;
        } else if (key === "ArrowUp") {
            rotatePiece();
            return;
        }

        renderBoard();
    }

    function startGame() {
        window.clearInterval(gameTimer);
        while (boardCells.length > baseRowCount * columnCount) {
            boardCells.pop().remove();
        }
        rowCount = baseRowCount;
        section2Board.style.setProperty("--board-visible-rows", rowCount);
        board = Array.from({ length: rowCount }, () => Array(columnCount).fill(null));
        piecesPlayed = 0;
        factDeck = [...aboutMeFacts];
        for (let index = factDeck.length - 1; index > 0; index--) {
            const swapIndex = Math.floor(Math.random() * (index + 1));
            [factDeck[index], factDeck[swapIndex]] = [factDeck[swapIndex], factDeck[index]];
        }
        const factList = document.getElementById("section2-facts");
        factList.replaceChildren();
        const placeholder = document.createElement("li");
        placeholder.className = "section2-fact-placeholder";
        placeholder.textContent = "Land a block to reveal a fact.";
        factList.appendChild(placeholder);
        document.getElementById("section2-thanks-overlay").hidden = true;
        document.getElementById("section2-game-view").classList.remove("is-complete");
        document.querySelector(".section2-touch-controls").hidden = false;
        currentPiece = randomPiece();
        nextPiece = randomPiece();
        gameRunning = true;
        updatePieceCount();
        drawPreview(nextPiece);
        document.getElementById("section2-live-status").textContent = "IN PLAY";
        showSection2View("game");
        syncBoardRowsToFacts();
        renderBoard();
        gameTimer = window.setInterval(stepPiece, 1100);
    }

    document.getElementById("section2-yes").addEventListener("click", () => {
        showSection2View("ready");
    });

    document.getElementById("section2-start").addEventListener("click", startGame);
    document.getElementById("section2-replay").addEventListener("click", startGame);
    document.getElementById("section2-proceed").addEventListener("click", finishGame);

    document.querySelectorAll("[data-section2-view]").forEach(button => {
        button.addEventListener("click", () => showSection2View(button.dataset.section2View));
    });

    document.querySelectorAll("[data-game-key]").forEach(button => {
        button.addEventListener("click", () => handleGameKey(button.dataset.gameKey));
    });

    document.addEventListener("keydown", event => {
        if (!gameRunning || event.altKey || event.ctrlKey || event.metaKey || !event.key.startsWith("Arrow")) return;
        event.preventDefault();
        handleGameKey(event.key);
    });

    window.addEventListener("resize", syncBoardRowsToFacts);
}

const originalMobileFontSizes = new WeakMap();

function adjustMobileTextSizes() {
    const isMobile = window.matchMedia("(max-width: 480px)").matches;

    document.querySelectorAll("body *").forEach(element => {
        const hasDirectText = Array.from(element.childNodes).some(node =>
            node.nodeType === Node.TEXT_NODE && node.textContent.trim()
        );

        if (!hasDirectText || element.closest(".section2-game")) return;

        if (!originalMobileFontSizes.has(element)) {
            originalMobileFontSizes.set(element, element.style.fontSize);
        }

        element.style.fontSize = originalMobileFontSizes.get(element);
        if (!isMobile) return;

        const currentSize = parseFloat(getComputedStyle(element).fontSize);
        if (Number.isFinite(currentSize)) {
            element.style.fontSize = `${Math.max(1, currentSize - 1)}px`;
        }
    });
}

adjustMobileTextSizes();
window.addEventListener("resize", adjustMobileTextSizes);

// descard
const cards = document.querySelectorAll(".descard, .dreamcard");

cards.forEach(card => {

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    card.addEventListener("mousedown", (e) => {

        isDragging = true;

        const rect = card.getBoundingClientRect();

        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        card.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {

        if (!isDragging) return;

        const hero = document.querySelector(".hero");
        const heroRect = hero.getBoundingClientRect();

        let x = e.clientX - heroRect.left - offsetX;
        let y = e.clientY - heroRect.top - offsetY;

        x = Math.max(0, Math.min(
            x,
            heroRect.width - card.offsetWidth
        ));

        y = Math.max(0, Math.min(
            y,
            heroRect.height - card.offsetHeight
        ));

        card.style.left = x + "px";
        card.style.top = y + "px";
    });

    document.addEventListener("mouseup", () => {

        isDragging = false;
        card.style.cursor = "grab";

    });

});
// tilt animation
const portfolio = document.querySelector(".portfolio");

portfolio.addEventListener("mousemove", (e) => {
    const rect = portfolio.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 3;
    const rotateX = ((centerY - y) / centerY) * 2;

    portfolio.style.transform = `
        perspective(800px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-6px)
        scale(1.015)
    `;
});

portfolio.addEventListener("mouseleave", () => {
    portfolio.style.transform = "";
});

portfolio.addEventListener("mousedown", () => {
    portfolio.style.transform = `
        translateY(3px)
        scale(0.98)
        rotateX(0deg)
        rotateY(0deg)
    `;
});

portfolio.addEventListener("mouseup", () => {
    portfolio.style.transform = "";
});

//DES CARD
const hero = document.querySelector(".hero");
const tiltElements = document.querySelectorAll(".hero .tilt");

hero.addEventListener("mousemove", (e) => {

    const rect = hero.getBoundingClientRect();

    const mouseX =
        ((e.clientX - rect.left) / rect.width - 0.5) * 2;

    const mouseY =
        ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    tiltElements.forEach((element) => {

        const depth =
            parseFloat(element.dataset.depth) || 10;

        const moveX = mouseX * depth;
        const moveY = mouseY * depth;

        const rotateX = -mouseY * 2;
        const rotateY = mouseX * 3;

        element.style.setProperty(
            "--moveX",
            `${moveX}px`
        );

        element.style.setProperty(
            "--moveY",
            `${moveY}px`
        );

        element.style.setProperty(
            "--tiltX",
            `${rotateX}deg`
        );

        element.style.setProperty(
            "--tiltY",
            `${rotateY}deg`
        );
    });
});


hero.addEventListener("mouseleave", () => {

    tiltElements.forEach((element) => {

        element.style.setProperty(
            "--moveX",
            "0px"
        );

        element.style.setProperty(
            "--moveY",
            "0px"
        );

        element.style.setProperty(
            "--tiltX",
            "0deg"
        );

        element.style.setProperty(
            "--tiltY",
            "0deg"
        );
    });
});
const dreamcard = document.querySelector(".dreamcard");

const DREAM_PROXIMITY = 180;

document.addEventListener("mousemove", (e) => {

    const rect = dreamcard.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    const distance = Math.sqrt(
        dx * dx + dy * dy
    );

    /* Cursor xa */
    if (distance > DREAM_PROXIMITY) {

        dreamcard.style.setProperty(
            "--nearX",
            "0px"
        );

        dreamcard.style.setProperty(
            "--nearY",
            "0px"
        );

        dreamcard.style.setProperty(
            "--tiltX",
            "0deg"
        );

        dreamcard.style.setProperty(
            "--tiltY",
            "0deg"
        );

        return;
    }

//DREAM CARD
    const strength =
        1 - distance / DREAM_PROXIMITY;

    const directionX =
        distance === 0 ? 0 : dx / distance;

    const directionY =
        distance === 0 ? 0 : dy / distance;


    /* DREAMCARD DI CHUYỂN */
    const moveX =
        directionX * strength * 10;

    const moveY =
        directionY * strength * 10;


    /* DREAMCARD TILT */
    const rotateY =
        directionX * strength * 4;

    const rotateX =
        -directionY * strength * 3;


    dreamcard.style.setProperty(
        "--nearX",
        `${moveX}px`
    );

    dreamcard.style.setProperty(
        "--nearY",
        `${moveY}px`
    );

    dreamcard.style.setProperty(
        "--tiltX",
        `${rotateX}deg`
    );

    dreamcard.style.setProperty(
        "--tiltY",
        `${rotateY}deg`
    );
});
//SPARKS
const sparks = document.querySelector(".sparks");
const glitchLines = document.querySelector(".glitch-lines");
const bgEffects = document.querySelector(".bg-effects");
const sparkColors = [
    "#fef87e",
    "#6bf3c3",
    "#f07aae",
    "#6c63ff",
    "#ffffff"
];
/* ==================================================
   CREATE SPARKS
================================================== */

for (let i = 0; i < 90; i++) {
    const spark = document.createElement("span");
    spark.classList.add("spark");
    /* random size */
    if (Math.random() > 0.8) {
        spark.classList.add("big");
    }
    /* random cross */
    if (Math.random() > 0.88) {
        spark.classList.add("cross");
    }
    spark.style.left =
        Math.random() * 100 + "%";

    spark.style.top =
        Math.random() * 100 + "%";
    spark.style.color =
        sparkColors[
            Math.floor(
                Math.random() * sparkColors.length
            )
        ];

    spark.style.background =
        spark.style.color;

    spark.style.setProperty(
        "--duration",
        (1.5 + Math.random() * 4) + "s"
    );

    spark.style.setProperty(
        "--delay",
        (Math.random() * 4) + "s"
    );

    sparks.appendChild(spark);
}


/* ==================================================
   CREATE GLITCH LINES
================================================== */

for (let i = 0; i < 40; i++) {

    const glitch =
        document.createElement("span");

    glitch.classList.add("glitch");

    glitch.style.top =
        Math.random() * 80 + "%";

    glitch.style.left =
        Math.random() * 90 + "%";

    glitch.style.width =
        (20 + Math.random() * 120) + "px";

    glitch.style.background =
        sparkColors[
            Math.floor(
                Math.random() * sparkColors.length
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

if (bgEffects) {
    for (let i = 0; i < 100; i++) {

        const pixel =
            document.createElement("span");

        pixel.classList.add("pixel");

        pixel.style.left =
            Math.random() * 100 + "%";

        pixel.style.top =
            50 + Math.random() * 55 + "%";
        pixel.style.bottom =
            50 + Math.random() * 55 + "%";

        pixel.style.background =
            sparkColors[
                Math.floor(
                    Math.random() * sparkColors.length
                )
            ];

        pixel.style.setProperty(
            "--duration",
            (3 + Math.random() * 6) + "s"
        );

        pixel.style.setProperty(
            "--delay",
            (Math.random() * 5) + "s"
        );

        bgEffects.appendChild(pixel);
    }
}