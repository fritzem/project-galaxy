import './../Block';
import Dir from './Dir';

export default class ClassicSpawn {

    constructor(playfield) {
        this.playfield = playfield;
    }

    /*
     * Always from the top. Gravity down;
     * Returns false when there is no available spawn.
     * 
     * Enforces block out loss condition.
     * https://tetris.wiki/Top_out
     */
    spawnBlock(block) {
        let posX = ((this.playfield[0].length / 2) - 1);
        let posY = (Math.round(this.playfield.length / 2) - 2);
        block.setPos(posX, posY);
        if (block.blockedTransf(Dir.Identity))
            return false;
        block.gravityDir = Dir.Down;
        return true;
    }


}