import Bag from "../bags/Bag"
import BlockFactory, { MinoType } from "../BlockFactory"
import Viewport from "../Viewport"
import TetrisMode from "./TetrisMode"


export default class BabyMode extends TetrisMode {

    getBag = () => new Bag(new BlockFactory(MinoType.Babyimino))
    getPlayfield = () => this.generatePlayfield(5, 20)
    getViewport = () => new Viewport(0, 10, 5, 10, 0.75)
}