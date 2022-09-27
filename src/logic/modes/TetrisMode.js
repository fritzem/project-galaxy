import Mode from './Mode';
import Bag from '../bags/Bag';
import {default as BlockFactory, MinoType} from './../BlockFactory';

export default class TetrisMode extends Mode {

    constructor() {
        super();
        this.gravityUnits = 0.05;

        this.heldBlock = null;
        this.recalled = false;
    }

    getBag = () => new Bag(new BlockFactory(MinoType.Tetrimino))

    attemptHold() {
        if (!this.recalled) {
            let activeBlock = this.activeBlock;
            this.pull(this.heldBlock);
            this.heldBlock = activeBlock;
            this.recalled = true;
        }
    }

    update(delta, menuState, setMenuState) {
        super.update(delta, menuState, setMenuState);

        if (this.activeBlock.locked) {
            this.recalled = false;

            //Leverage an animation in the future, rather than back-to-back
            let lineClears = 0
            let lines = this.getLineClears();
            while (lines.length > 0) {
                this.shiftForClears(lines)
                lineClears += lines.length;
                lines = this.getLineClears();
            }

            this.score += 100 * lineClears;

            //Enforce lockout loss condition
            let oob = this.oobBlock(this.activeBlock);

            if ((lineClears == 0 && oob) || !this.pull()) {
                setMenuState(menuState.withGameOver().clone());
            }
        }
    }

    //getViewport = () => new Viewport(0, 15, 10, 25, 0.75)

    getLineClears() {
        let linesCleared = [];
        for (let y = 0; y < this.playfield.length; y++) {
            if (this.playfield[y].every((cell) => cell != 0)) {
                linesCleared.push(y);
                this.playfield[y].fill(0, 0);
            }
        }
        return linesCleared;
    }

    shiftForClears(rows) {
        for (const row of rows) {
            this.playfield.splice(row, 1);
            this.playfield.unshift(Array(this.playfield[0].length).fill(0));
        }
    }

    oobBlock(block) {
        let set = block.getSet();
        return set.every(
            (cell) => cell[1] < (this.playfield.length / 2));
    }

}

