import MenuItem from './MenuItem';

export default class MenuButton extends MenuItem {
    constructor(label, onConfirm) {
        super();
        this.label = label;
        this.onConfirm = onConfirm;
    }

    onConfirm(options, setMode) {
        this.onConfirm(options, setMode);
    }
}
