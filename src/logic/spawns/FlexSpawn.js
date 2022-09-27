import Dir from "./Dir";



export default class FlexSpawn {

    /*
     * Set of valid dirs for for assigning block gravity
     * Might want to extract this functionality somewhere else
     */
    constructor(playfield, positions, dirs, strategy) {
        this.playfield = playfield;
        this.positions = positions;
        this.dirs = dirs;
        this.cursor = 0;
    }

    spawnBlock(block) {
        block.setPos(this.positions[this.cursor][0], this.positions[this.cursor][1]);
        if (block.blockedTransf(Dir.Identity))
            return false;

        block.gravityDir = this.dirs[this.cursor++];
        this.cursor %= this.dirs.length;
        
        return true;
    }

}