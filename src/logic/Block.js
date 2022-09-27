import './spawns/Dir';
import Dir from './spawns/Dir';

const State = {
    O : 0,
    R : 1, //Rotated right
    U : 2, //Two rotations
    L : 3  //Rotated left
}

function spinState(state, spin) {
    state += ((spin == Dir.SpinRight) - (spin == Dir.SpinLeft));
    return state & 3;
}

const KickOffsets = {
    0 : [[0,0], [0,0], [0,0], [0,0], [0,0]], 
    1 : [[0,0], [1,0], [1,1], [0,-2], [1,-2]],
    2 : [[0,0], [0,0], [0,0], [0,0], [0,0]],
    3 : [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]]
}

/*
 * A set of cells, the complete block
 */
export default class Block {

    constructor(positioning, type) {
        this.deepest = 0;
        this.delayResets = 0;
        this.lockDelay = 0;
        this.locked = false;

        this.state = State.O;

        this.dumpFunc = null;
        this.checkPlayfieldFunc = null;

        this.x = positioning[0][0];
        this.y = positioning[0][1];

        let minX = 0;
        let maxX = 0;
        let minY = 0;
        let maxY = 0;

        this.cells = [];
        for (let i = 0; i < positioning[1].length; i++)	{
            this.cells.push(new Cell(positioning[1][i]));
            minX = Math.min(minX, positioning[1][i][0]);
            maxX = Math.max(maxX, positioning[1][i][0]);
            minY = Math.min(minY, positioning[1][i][1]);
            maxY = Math.max(maxY, positioning[1][i][1]);
        }

        this.width = (maxX - minX);
        this.height = (maxY - minY) + 1;

        this.gravityDir = null;
        this.gravityUnits = null;
        this.gravityTimer = 0;

        //Temporary color thingy
        this.type = type + 1;
    }

    calculateDepth() {
        return (Dir.MoveAugments[this.gravityDir][0] * this.x)
            + (Dir.MoveAugments[this.gravityDir][1] * this.y); 
    }

    update(delta) {
        if (this.calculateDepth() > this.deepest) {
            this.deepest = this.calculateDepth();
            this.lockDelay = 0;
            this.delayResets = 0;
        }

        if (this.blockedTransf(this.gravityDir)) {
            this.lockDelay += delta;
            //Hardcoded to half a second, most games use this
            //Only the most intense tetris games scale up lock delay
            if (this.lockDelay >= 500) {
                this.dump();
            }
        }

        let frameTime = (1000 / 60);
        this.gravityTimer += (delta) * this.gravityUnits;
        if (this.gravityTimer > frameTime) {
            this.gravityTimer -= frameTime;
            this.advance();
        }
    }

    /* 
     * Moves the block in the direction of gravity dir
     * Returns true if the piece advanced
     */
    advance() {
        return this.move(this.gravityDir);
    }

    /*
     * Moves all the cells of the block in a direction
     * Rotation, while having its own function, is wrapped here
     * for simplified enumeration access
     *
     * Returns true if the operation was successful.
     * Rotations return because gravity might go CRAZY!
     */
    move(dir) {
        if (this.locked) return false;
        if (Dir.MoveOpposite[this.gravityDir] == dir) return false;
        if (dir == Dir.HardDrop) {
            while (this.advance()) {}
            this.dump();
            return true;
        }

        let successful = false;

        if (dir == Dir.SpinLeft || dir == Dir.SpinRight)
            successful = this.rotate(dir);
        else if (!this.blockedTransf(dir))
        {
            this.x += Dir.MoveAugments[dir][0];
            this.y += Dir.MoveAugments[dir][1];
            successful = true;
        }

        if (successful && (this.delayResets++ < 15)) {
            this.lockDelay = 0;
        }

        return successful;
    }

    setPos(x, y) {
        this.x = (this.x % 1) + Math.floor(x / 1);
        this.y = (this.y % 1) + Math.floor(y / 1);
    }

    /*
     * rotate depending on the move specified
     */
    rotate(dir) {
        if (this.blockedTransf(dir))
            return false;
        this.state = spinState(this.state, dir);
        for (let i = 0; i < this.cells.length; i++) {
            this.cells[i].move(dir);
        }
        return true;
    }

    /* 
     * Returns coordinates of all cells in the block for use in drawing
     */
    getSet() {
        let set = [];

        this.cells.forEach(cell => {
            set.push([cell.x + this.x, cell.y + this.y])	
        });
        return set;
    }

    /*
     * Check Transformation
     * Ensures that the block can enter a certain space without a collision
     * Takes direction enum
     * Return TRUE if blocked
     */
    blockedTransf(dir) {
        for (let cell of this.cells) {
            let x = this.x + cell.transfCoords(dir)[0];
            let y = this.y + cell.transfCoords(dir)[1];
            if (this.checkPlayfieldFunc(x, y)) {
                return true;
            }
        }

        return false;
    }

    /*
     * The pieces of the block are added to the solidified grid.
     * The block is no longer considered active.
     */
    dump() {
        for (let cell of this.cells) {
            this.dumpFunc(cell.x + this.x, cell.y + this.y, this.type);
        }
        this.locked = true;
    }

}

/*
 * Individual squares of a block
 */
class Cell {

    /*
     * Cells use local coordinates that are offsets from the base block coordinate
     */
    constructor(localCoords) {
        this.x = localCoords[0];
        this.y = localCoords[1];
    }

    /*
     * Transformed Coordinates
     * Generates a two length array, containing the local
     * coordinates after a given transformation
     */
    transfCoords(dir) {
        if (dir != Dir.SpinRight && dir != Dir.SpinLeft)
            return [Dir.MoveAugments[dir][0] + this.x, 
                    Dir.MoveAugments[dir][1] + this.y];
        else
            return this.rotationMatrix(dir);
    }

    /*
     * Moves the cell in a direction
     */
    move(dir) {
        let tc = this.transfCoords(dir);
        this.x = tc[0];
        this.y = tc[1];
    }

    /*
     * Returns a 2 length array of the coordinates after the rotation specified.
     */
    rotationMatrix(dir) {
        return [Math.round((this.x * Math.cos(dir) - this.y * Math.sin(dir)) * 10) / 10,
                Math.round((this.x * Math.sin(dir) + this.y * Math.cos(dir)) * 10) / 10 ];
    }
}