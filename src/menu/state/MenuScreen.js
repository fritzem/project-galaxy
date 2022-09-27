export default class MenuScreen {
    constructor(title, items) {
        this.title = title;
        this.items = items;
        this.index = 0;
    }

    onConfirm(options, setMode) {
        this.items[this.index].onConfirm(options, setMode);
    }

    onUp() {
        this.index -= 1;
        if (this.index < 0) {
            this.index = this.items.length - 1;
        }
    }

    onDown() {
        this.index += 1;
        if (this.index >= this.items.length) {
            this.index = 0;  
        }
    }

    onLeft(options, setOptions) {
        this.items[this.index].onLeft(options, setOptions);
    }

    onRight(options, setOptions) {
        this.items[this.index].onRight(options, setOptions);
    }
}
