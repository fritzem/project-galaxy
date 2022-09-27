import TetrisMode from './TetrisMode';
import Viewport from '../Viewport';
import GalaxySpawn from '../spawns/GalaxySpawn';
import Dir from '../spawns/Dir';

const anchorX = 40;
const anchorY = 40;

export default class GalaxyMode extends TetrisMode {

    constructor() {
        super();
    }

    getPlayfield = () => {
        let data = this.generatePlayfield(81, 81);
        data[anchorX][anchorY] = 10;
        return data;
    }
    getSpawner = () => new GalaxySpawn(this.playfield)
    getViewport = () => new Viewport(20, 20, 41, 41, 0.75)


    getLineClears() {
        let clearedRows = [];
        for (let row = 1; row < this.playfield.length / 2; row++) {
            let indices = this.getRingIndices(row);
            if (indices.every(
                (index) => this.playfield[index[1]][index[0]] != 0)
            ) {
                clearedRows.push(row);
                for (let index of indices) {
                    this.playfield[index[1]][index[0]] = 0;
                }
            }
        }

        return clearedRows;
    }

    shiftForClears(rows) {
        rows.sort(function(a, b){return a - b});
        let clumps = [];
        for (let i = 0; i < rows.length; i++) {
            clumps.push([rows[i]]);
            for (let k = i + 1; k < rows.length && (rows[k] - rows[i] == 1); k++) {
                clumps[clumps.length - 1].push(rows[k]);
                i++; 
            }
        }
        for (const clump of clumps) {
            for (const row of clump) {
                for (let shiftRow = clump[0] + 1; shiftRow < (this.playfield.length / 2); shiftRow++) {
                    for (let dir = 0; dir < 4; dir++) {
                        let indices = this.getRingSideIndices(shiftRow, dir);
                        for (let i = 1; i < indices.length - 1; i++) {
                            this.tryShift(indices[i], Dir.MoveAugments[Dir.MoveOpposite[dir]]);
                        }
                        this.forceShift(indices[0], Dir.CornerRingCrunch[dir][0]);
                        this.forceShift(indices[1], Dir.CornerRingCrunch[dir][1]);
                    }
                }
            }
        }
    }

    tryShift(index, offset) {
        let nOffset = Array(index[1] + offset[1], index[0] + offset[0]);
        if (this.playfield[nOffset[0]][nOffset[1]] == 0) {
            this.playfield[nOffset[0]][nOffset[1]] = this.playfield[index[1]][index[0]];
            this.playfield[index[1]][index[0]] = 0;
        }
    }

    forceShift(index, offset) {
        let nOffset = Array(index[1] + offset[1], index[0] + offset[0]);
        this.playfield[nOffset[0]][nOffset[1]] = this.playfield[index[1]][index[0]];
        this.playfield[index[1]][index[0]] = 0;
    }

    /*
     * Row = 1 returns
     * [-1,-1], [0,-1], [1,-1]
     * [-1, 0], x, [1, 0]
     * [-1, 1], [0, 1], [1, 1]
     */
    getRingIndices(row) {
        let indices = [];
        for (let i = 0; i < 4; i++) {
            for (let data of this.getRingSideIndices(row, i)) {
                indices.push(data);
            }
        }

        indices = indices.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t[0] === value[0] && t[1] === value[1]
            ))
        )
        return indices;
    }

    getRingSideIndices(row, dir) {
        let circ = 3 + (row-1) * 2;
        let indices = [];

        for (let i = 0; i < circ; i++) {
            indices.push([
                Dir.RingBase[dir][0] * row + anchorX
                + Dir.RingTraversal[dir][0] * i,
                Dir.RingBase[dir][1] * row + anchorY
                + Dir.RingTraversal[dir][1] * i,
            ])
        }
        return indices;
    }

    oobBlock(block) {
        let set = block.getSet();
        return set.every(
            (cell) => ((cell[0] < this.playfield[0].length / 4)
                || (cell[1] < this.playfield.length / 4)
                || (cell[0] >= this.playfield[0].length / 4 * 3)
                || (cell[1] >= this.playfield.lenth / 4 * 3))
        );
    }
}