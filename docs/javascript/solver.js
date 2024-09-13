const Lib = {};

{
    const top = 0;
    const parent = i => ((i + 1) >>> 1) - 1;
    const left = i => (i << 1) + 1;
    const right = i => (i + 1) << 1;

    class PriorityQueue {
        constructor(comparator = (a, b) => a > b) {
            this._heap = [];
            this._comparator = comparator;
        }
        size() {
            return this._heap.length;
        }
        isEmpty() {
            return this.size() == 0;
        }
        peek() {
            return this._heap[top];
        }
        push(...values) {
            values.forEach(value => {
            this._heap.push(value);
            this._siftUp();
            });
            return this.size();
        }
        pop() {
            const poppedValue = this.peek();
            const bottom = this.size() - 1;
            if (bottom > top) {
            this._swap(top, bottom);
            }
            this._heap.pop();
            this._siftDown();
            return poppedValue;
        }
        replace(value) {
            const replacedValue = this.peek();
            this._heap[top] = value;
            this._siftDown();
            return replacedValue;
        }
        _greater(i, j) {
            return this._comparator(this._heap[i], this._heap[j]);
        }
        _swap(i, j) {
            [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
        }
        _siftUp() {
            let node = this.size() - 1;
            while (node > top && this._greater(node, parent(node))) {
            this._swap(node, parent(node));
            node = parent(node);
            }
        }
        _siftDown() {
            let node = top;
            while (
            (left(node) < this.size() && this._greater(left(node), node)) ||
            (right(node) < this.size() && this._greater(right(node), node))
            ) {
            let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
            this._swap(node, maxChild);
            node = maxChild;
            }
        }
    }
    Lib.PriorityQueue = PriorityQueue;
}

function solve(board) {
    const state = boardToState(board);
    const solution = solveState(state);
    return solution; 
}

function boardToState(board) {
    return board.flat();
}

function getSolvedPosition(tile) {
    if (tile === EMPTY_SPACE) {
        return [3, 3];
    }
    return [tile % 4, Math.floor(tile / 4)];
}

function solveState(initState) {

    function hash(state) {
        return state.join(",");
    }

    function h(state) {
        let dst = 0;
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const tile = state[c * 4 + r];
                const [tileR, tileC] = getSolvedPosition(tile);
                dst += Math.abs(tileR - r) + Math.abs(tileC - c);
            }
        }        
        return dst;
    }
    
    let frontier = new Lib.PriorityQueue((a, b) => {
        if (a[0] + a[1] > b[0] + b[1]) return false;
        if (a[0] + a[1] < b[0] + b[1]) return true;
        return a[2].join("") < b[2].join("");
    })

    // cost, heuristic, state, path
    frontier.push([0, h(initState), initState, hash(initState)])

    explored = new Set();

    let iter = 0;
    let lowest_heu = 100;
    while (!frontier.isEmpty()) {
        const [cost, heu, curState, path] = frontier.pop();
        if (isSolved(curState)) {
            return path;
        }
        const childrens = generateChildren(curState);
        if (explored.has(hash(curState))) {continue}
        explored.add(hash(curState));
        for (let children of childrens) {
            if (!explored.has(hash(children))) {
                frontier.push([cost + 1, h(children), children, path + " -> " + hash(curState)]);
            }
        }

        if (heu < lowest_heu) {
            lowest_heu = heu;
            console.log(frontier.size());
            console.log(path,cost,heu);
        }
        iter++;
        if (iter % 1000 == 0) {
            //console.log(frontier.size());
            //console.log(path, cost, heu);
        }
    }

    return [];
    
}

function generateChildren(state) {
    const emptySpace = state.indexOf(EMPTY_SPACE);
    const [r, c] = [Math.floor(emptySpace / 4), emptySpace % 4];
    const children = [];
    const vectors = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    for (let vector of vectors) {
        const [rv, cv] = vector;
        const [nR, nC] = [r + rv, c + cv]
        if (nR >= 0 && nR <= 3 && nC >= 0 && nC <= 3) {
            const newState = [...state];
            newState[emptySpace] = newState[nR * 4 + nC];
            newState[nR*4 + nC] = EMPTY_SPACE;
            children.push(newState);
        }
    }
    return children;
}
