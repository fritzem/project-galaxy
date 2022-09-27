import './Block'
import Block from './Block';

export const MinoType = {
    Tetrimino : 0,
    Pentimino : 1,
    Babyimino : 2,
    Alphamino : 3,
    Debugmino : 4
};

const minoSets = (mino) => {
    switch(mino) {
        case MinoType.Tetrimino:
            return [...Array(7).keys()];
        case MinoType.Pentimino:
        case MinoType.Babyimino:
            return [
                blockType.OBlock,
                blockType.Domino,
                blockType.LTromino,
                blockType.ITromino,
                blockType.TBlock,
                blockType.IBlock,
            ];
        case MinoType.Alphamino:
            return [blockType.EBlock]
        case MinoType.Debugmino:
            return [blockType.Monomino];
        default:
            return [0];
    }
}

const blockType = {
    OBlock : 0,
    IBlock : 1,
    JBlock : 2,
    LBlock : 3,
    SBlock : 4,
    ZBlock : 5,
    TBlock : 6,
    EBlock : 7,
    Monomino : 8,
    Domino : 9,
    LTromino : 10,
    ITromino : 11,
}

/*
 * Only implement static block types here.
 * Make an extension for semi-random block factory (if you want a more complex bag)
 */
export default class BlockFactory {
    constructor(minoType) {
        this.minoType = minoType;
    }

    getCount() {
        return minoSets(this.minoType).length;
    }

    getBlock(index) {
        // positioning: [[Base coordinates of the block], [Array of cell offsets]]
        let positioning = [[],[]]; 
        switch (minoSets(this.minoType)[index]) {
            case blockType.OBlock:
                // Block shape can be generated through offsets
                positioning[0] = [0.5, 0.5];
                positioning[1] = [[-0.5,-0.5],[0.5,0.5],[-0.5,0.5],[0.5,-0.5]];
                break;
            case blockType.IBlock:
                // Or lazily with a drawn array
                positioning = this.generateOffsets([	
                    [0,0,0,0],
                    [1,1,1,1]
                ]);
                break;
            case blockType.JBlock:
                positioning = this.generateOffsets([
                    [1,0,0],
                    [1,1,1]
                ]); 
                break;
            case blockType.LBlock:
                positioning = this.generateOffsets([
                    [0,0,1],
                    [1,1,1]
                ]);
                break;
            case blockType.SBlock:
                positioning = this.generateOffsets([
                    [0,1,1],
                    [1,1,0]
                ]);
                break;
            case blockType.ZBlock:
                positioning = this.generateOffsets([
                    [1,1,0],
                    [0,1,1]
                ]);
                break;
            case blockType.TBlock:
                positioning = this.generateOffsets([
                    [0,1,0],
                    [1,1,1]
                ]);
                break;
            case blockType.EBlock:
                positioning = this.generateOffsets([
                    [1,1,1],
                    [1,0,0],
                    [1,1,1],
                    [1,0,0],
                    [1,1,1]
                ]);
                break;
            case blockType.Domino:
                positioning = this.generateOffsets([
                    [1,1]
                ]);
                break;
            case blockType.LTromino:
                positioning = this.generateOffsets([
                    [1,0],
                    [1,1]
                ]);
                break;
            case blockType.ITromino:
                positioning = this.generateOffsets([
                    [0,0,0],
                    [1,1,1]
                ]);
                break;
            case blockType.Monomino:
            default:
                positioning = this.generateOffsets([
                    [1]
                ]);
        }
        return new Block(positioning, minoSets(this.minoType)[index]);
    }

    /*
     * Takes a double array and generates the cell offsets
     * cell offset + base block coordinates = its actual position on the grid
     */
    generateOffsets(arr) {
        let cells = [];
        
        let offset = 0.5;
        let size = Math.max(arr.length, arr[0].length);

        let positioning = [];

        // If a block is of even size, the origin exists between blocks
        if (size % 2 == 0) {
            positioning[0] = [0.5, 0.5];
        }
        else {
            positioning[0] = [0, 0];
        }
        
        for (let row = 0; row < arr.length; row++) {
            for (let col = 0; col < arr[row].length; col++) {
                if (arr[row][col] != 0) {
                    cells.push(
                        [col - size / 2 + offset, -(size / 2) + row + offset]
                    )
                }
            }
        }
        positioning[1] = cells;

        /* Width, height
        positioning[2][0] = arr.length;
        positioning[2][1] = arr[0].length; */

        return positioning;
    }
}
