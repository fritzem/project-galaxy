import MenuItem from './MenuItem';

export default class MenuPicker extends MenuItem {
    constructor(params) {
        super();

        this.label = params.label;
        this.values = params.values;
        this.index = params.index != undefined ? params.index : 0;
        /*
        if (params.currentValue != undefined) {
            const currentValueIndex = this.values.findIndex(o => o == params.currentValue);
            if (currentValueIndex != -1) {
                this.index = currentValueIndex;
            }
        }
        */
        this.optionKey = params.optionKey;
        this.onConfirm = params.onConfirm != undefined ? params.onConfirm : (options, setMode) => {};
    }

    getValueText() {
        return this.values[this.index][0];
    }

    onConfirm(options, setMode) {
        this.onConfirm(options, setMode);
    }

    onLeft(option, setOption) {
        this.index -= 1;
        if (this.index < 0) {
            this.index = this.values.length - 1;
        }
        this.set(option, setOption);
    }

    onRight(option, setOption) {
        this.index += 1;
        if (this.index >= this.values.length) {
            this.index = 0;  
        }
        this.set(option, setOption);
    }

    set(option, setOption) {
        setOption(
            option.withOption(
                this.optionKey,
                this.values[this.index][1]
            )
        );
    }
}
