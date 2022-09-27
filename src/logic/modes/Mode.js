
import Bag from '../bags/NoBag';
import {default as BlockFactory, MinoType} from './../BlockFactory';
import ClassicSpawn from './../spawns/ClassicSpawn'
import Viewport from './../Viewport'

//Debug mode that isn't very fun
class Mode {

    constructor() {
        this.gravityUnits = 0;
        this.score = 0; 
        this.timer = 0;
    }

    //Break off appropriate bits into start()
    init() {
        this.playfield = this.getPlayfield();
        this.bag = this.getBag();
        this.spawner = this.getSpawner();
        this.viewport = this.getViewport();

        this.pull();
    }

    /*
     * FACTORY FUNCTIONS
     */

    getBag = () => new Bag(new BlockFactory(MinoType.Debugmino))

    getSpawner = () => new ClassicSpawn(this.playfield)

    getPlayfield = () => this.generatePlayfield(10, 40);

    getViewport = () => new Viewport(0, 20, 10, 20, 0.75)

    /*
     * Functions that can be passed around to objects
     */
    dumpToPlayfield = (x, y, type) => { this.playfield[y][x] = type };

    //If blocked, return true
    checkPlayfield = (x, y) => (this.playfieldOutOfRange(x,y) || this.playfield[y][x] != 0);

    /*
     * Common functions that Game will call
     */
    update(delta, menuState, setMenuState) {
        this.timer += delta;
        this.activeBlock.update(delta);
    }

    //Receive input related to block movement
    receiveInput(movements) {
        for (const dir of movements) {
            this.activeBlock.move(dir);
        }
    }

    attemptHold() { }

    //Util ~ Can be moved elsewhere
    generatePlayfield(x, y, type) {
        let width = x;
        let height = y;
        let data = []
        for (let y = 0; y < height; y++) {
            data.push([])
            for (let x = 0; x < width; x++) {
                data[y].push(0);
                //data[y].push(Math.floor(Math.random() * 5));
            }
        }
        return data;
    }

    playfieldOutOfRange(x, y) {
        return (x < 0 || y < 0
            || x >= this.playfield[0].length
            || y >= this.playfield.length)
    }

    
    /*
     * Pulls a new piece from the bag and "dresses" it
     * - Spawn position
     * - Gravity position
     * - A function used to dump the block
     * - A function to check collision data
     * 
     * Optionally, pull the hold block instead
     */
    pull(block) {
        if (block == null)
            block = this.bag.pull();

        block.gravityUnits = this.gravityUnits;
        block.dumpFunc = this.dumpToPlayfield;
        block.checkPlayfieldFunc = this.checkPlayfield;

        //Sets position with a valid position, otherwise false
        let spawned = this.spawner.spawnBlock(block);

        if (spawned)
            this.activeBlock = block;
        
        return spawned;
    }



}

export default Mode;