const EMPTY_SPACE = -10;
const UP = 1, DOWN = 2, LEFT = 3, RIGHT = 4;

const defaultState = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, EMPTY_SPACE]
];

const gridSize = 4;

var fifteenBoard = defaultState.map(x => [...x]);
var fifteenBoardEmptyPosition = [3, 3];
const stats = {
    moves: 0,
    hasWon: false,
    tickStart: null,
    tickEnd: null
};

function isSolved(board) {
    const a = defaultState.flat();
    const b = board.flat();
    return a.every((val, idx) => val === b[idx]);
}

function checkWin() {
    if (stats.tickEnd !== null) {
        return;
    }

    if (isSolved(fifteenBoard)) {
        stats.tickEnd = Date.now();
        stats.hasWon = true;
    }
}

function updateStatsAfterMove(moveCount = 1) {
    if (stats.tickStart == null && stats.tickEnd == null) {
        stats.tickStart = Date.now();
    }

    if (stats.tickEnd == null) {
        stats.moves += moveCount;
    }

    checkWin();
};

function moveTile(r, c) {
    if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) {
        return;
    }

    let [rEmpty, cEmpty] = fifteenBoardEmptyPosition;

    // The cell is empty
    if (rEmpty === r && cEmpty === c) {
        return;
    }

    // The cell is off the x/y axis
    if (r !== rEmpty && c !== cEmpty) {
        return;
    }

    // We take the vector from empty space to the tile selected.
    const dir = [r - rEmpty, c - cEmpty].map(x => Math.sign(x));
    
    // Starting from empty space, we set the value of cur cell to next cell until we reach the end.
    // For example, if we move tile 0,0 and 0,3 is empty, then we set 0,3 to 0,2
    // followed by 0,2 to 0,1; then 0,1 to 0,0; and we finally set 0,0 to empty.
    
    let cur = [rEmpty, cEmpty];
    let moveCount = 0;

    while (cur[0] !== r || cur[1] !== c) {
        const next = [cur[0] + dir[0], cur[1] + dir[1]]
        const nextCell = fifteenBoard[next[0]][next[1]];
        fifteenBoard[cur[0]].splice(cur[1], 1, nextCell);
        cur = next;
        moveCount++;
    }

    fifteenBoard[r].splice(c, 1, EMPTY_SPACE);
    fifteenBoardEmptyPosition = [r, c];
    updateStatsAfterMove(moveCount);
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

        updateStatsAfterMove();

        return;
    }
}

function scramble() {
    resetBoard();
    
    const moves = [UP, DOWN, LEFT, RIGHT];
    for (let i = 0; i < 1000; i++) {
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        moveDirection(randomMove);
    }

    resetStats();
}

function resetStats() {
    stats.moves = 0;
    stats.timerStart = false;
    stats.tickStart = null;
    stats.tickEnd = null;
    stats.hasWon = false;
}

function resetBoard() {
    for (let i = 0; i < gridSize; i++) {
        // Vue is an amazing tool
        fifteenBoard.splice(i, 1, [...defaultState[i]]);
        console.log([...defaultState[i]])
    }
    fifteenBoardEmptyPosition = [3, 3];

    resetStats();
}

// scramble();

const app = new Vue({
    el: "#app",
    data: {
        fifteenBoard,
        EMPTY_SPACE,
        stats,
        lastTick: Date.now()
    },
    computed: {
        time() {
            if (this.stats.tickStart == null) {
                return 0;
            }
            if (this.stats.tickEnd != null) {
                return (this.stats.tickEnd - this.stats.tickStart) / 1000;
            }
            return (this.lastTick - this.stats.tickStart) / 1000;
        }
    },
    methods: {
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

        setInterval(() => {
            this.lastTick = Date.now()
        }, 25);
    }
 });