export const VIDEO_PLAYER_SRC = 'videoPlayerSrc';
export const GALAXY_MODE_LEVEL = 'galaxyModeLevel';
export const TETRIS_MODE_LEVEL = 'tetrisModeLevel';
export const BABY_MODE_LEVEL = 'babyModeLevel';

export default class Options {
    constructor(options) {
        if (options != undefined) {
            this.options = options;
        } else {
            this.options = {};
            // Default options
            this.options[VIDEO_PLAYER_SRC] = '';
            this.options[GALAXY_MODE_LEVEL] = 0;
            this.options[TETRIS_MODE_LEVEL] = 0;
            this.options[BABY_MODE_LEVEL] = 0;
        }
    }

    clone() {
        return new Options(this.options);
    }

    get(key) {
        return this.options[key];
    }

    withOption(key, value) {
        this.options[key] = value;
        return this.clone();
    }
}
