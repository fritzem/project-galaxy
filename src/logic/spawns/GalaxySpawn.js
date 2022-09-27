import './../Block';
import Dir from './Dir';
import FlexSpawn from './FlexSpawn';

export default class GalaxySpawn extends FlexSpawn {

    constructor(playfield) {
        let posX = (Math.round(playfield[0].length / 2) - 1);
        let posY = (Math.round(playfield.length / 2) - 1);
        let oobX = (Math.round(playfield[0].length / 4));
        let oobY = (Math.round(playfield.length / 4)); 
        super(playfield, 
            Array([posX, oobY - 2],[oobX * 3 + 2, posY],[posX, oobY * 3 + 2], [oobX - 2, posY]),
            Array(Dir.Down, Dir.Left, Dir.Up, Dir.Right));
    }
}