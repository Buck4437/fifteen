const EMPTY_SPACE = -10;
const UP = 1, DOWN = 2, LEFT = 3, RIGHT = 4;

const defaultState = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, EMPTY_SPACE]
];

var gridSize = 4;
var fifteenBoard = defaultState.map(x => [...x]);
var fifteenBoardEmptyPosition = [3, 3];

function moveTile(r, c) {
    let [rEmpty, cEmpty] = fifteenBoardEmptyPosition;

    const neighbours = [[0, -1], [0, 1], [1, 0], [-1, 0]];

    for (const neighbour of neighbours) {
        const rNew = r + neighbour[0];
        const cNew = c + neighbour[1];

        if ((rNew == rEmpty) && (cNew == cEmpty)) {
            console.log("yes");
            // Vue is an amazing tool
            fifteenBoard[rNew].splice(cNew, 1, fifteenBoard[r][c]);
            fifteenBoard[r].splice(c, 1, EMPTY_SPACE);
            fifteenBoardEmptyPosition = [r, c];
            break;
        }
    }
}

function moveDirection(dir) {
    const vectors = {
        // When we press an arrow key, we are actually swapping with the tile in opposite direction
        [UP]: [1, 0],
        [DOWN]: [-1, 0],
        [LEFT]: [0, 1],
        [RIGHT]: [0, -1]
    }
    
    let [rEmpty, cEmpty] = fifteenBoardEmptyPosition;
    const rNew = rEmpty + vectors[dir][0];
    const cNew = cEmpty + vectors[dir][1];
        
    if (0 <= rNew && rNew < gridSize && 0 <= cNew && cNew < gridSize) {
        // Vue is an amazing tool
        fifteenBoard[rEmpty].splice(cEmpty, 1, fifteenBoard[rNew][cNew]);
        fifteenBoard[rNew].splice(cNew, 1, EMPTY_SPACE);
        fifteenBoardEmptyPosition = [rNew, cNew];
    }
}

function scramble() {
    const moves = [UP, DOWN, LEFT, RIGHT];
    for (let i = 0; i < 1000; i++) {
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        moveDirection(randomMove);
    }
}


function resetBoard() {
    for (let i = 0; i < gridSize; i++) {
        // Vue is an amazing tool
        fifteenBoard.splice(i, 1, [...defaultState[i]]);
        console.log([...defaultState[i]])
    }
    fifteenBoardEmptyPosition = [3, 3];
}

const app = new Vue({
    el: "#app",
    data: {
        fifteenBoard,
        EMPTY_SPACE
    },
    methods: {
        resetBoard,
        scramble,
        moveTile
    },
    mounted() {
        document.addEventListener("keydown", e => {
            switch (e.code) {
                case "ArrowUp":
                    moveDirection(UP)
                    break;
                case "ArrowDown":
                    moveDirection(DOWN)
                    break;
                case "ArrowLeft":
                    moveDirection(LEFT)
                    break;
                case "ArrowRight":
                    moveDirection(RIGHT)
                    break;
            }
        })
    }
 });