import '../Block'

export default class NoBag {
    constructor(blockFactory) {
        this.blockFactory = blockFactory;
    }

    /*
     * There's no bag? Always has been 🔫
     */
    pull() {
        return this.blockFactory.getBlock(Math.floor(Math.random() * (this.blockFactory.getCount())));
    }

    peek() {
        return "lmao";
    }
}