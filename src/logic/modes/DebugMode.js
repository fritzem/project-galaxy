import TetrisMode from "./TetrisMode";
import Viewport from "../Viewport";


export default class DebugMode extends TetrisMode {


    getPlayfield = () => 
        this.fillPlayfield(this.generatePlayfield(10, 40), 0, 25, 9, 15, 3);

    getViewport = () => new Viewport(0, 15, 10, 25, 0.75)

    //another util for testing, these should really move out
    fillPlayfield(data, x, y, w, h, i) {
        for (let yi = y; yi < y + h; yi++) {
            for (let xi = x; xi < x + w; xi++) {
                data[yi][xi] = i;
            }
        }
        return data;
    }
}