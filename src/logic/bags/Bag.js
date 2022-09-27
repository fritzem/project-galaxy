


export default class Bag {

    constructor(blockFactory) {
        this.blockFactory = blockFactory;
        this.bag = [];
    }

    fill() {
        let count = [...Array(this.blockFactory.getCount()).keys()];
        while (count.length > 0) {
            let index = Math.floor(Math.random() * count.length);
            this.bag.push(this.blockFactory.getBlock(count[index]));
            count.splice(index, 1);
        }
    }

    pull() {
        if (this.bag.length == 0) this.fill();
        return this.bag.shift();
    }

    peek(entries) {
        while (this.bag.length < entries) {
            this.fill();
        }

    }


}