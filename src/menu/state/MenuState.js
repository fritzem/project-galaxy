import BabyMode from '../../logic/modes/BabyMode';
import GalaxyMode from '../../logic/modes/GalaxyMode';
import TetrisMode from '../../logic/modes/TetrisMode';
import { BABY_MODE_LEVEL, GALAXY_MODE_LEVEL, TETRIS_MODE_LEVEL, VIDEO_PLAYER_SRC } from '../../Options';
import MenuButton from './MenuButton';
import MenuPicker from './MenuPicker';
import MenuScreen from './MenuScreen';

const LEVEL_VALUES = () => {
    let values = [];
    for (let i = 0; i < 15; i++) {
        values.push([`Level ${i}`, i]);
    }
    return values;
};

export default class MenuState {
    constructor(mainMenu, optionsMenu, stack) {
        if (mainMenu == undefined) {
            this.mainMenu = this.getMainMenu();
            this.optionsMenu = this.getOptionsMenu();
            this.stack = [this.mainMenu];
        } else {
            this.mainMenu = mainMenu;
            this.optionsMenu = optionsMenu;
            this.stack = stack;
        }
    }

    clone() {
        return new MenuState(this.mainMenu, this.optionsMenu, this.stack);
    }

    getMainMenu() {
        return new MenuScreen(
            'Project Galaxy',
            [
                new MenuPicker(
                    {
                        label: 'Play Galaxy',
                        values: LEVEL_VALUES(),
                        //currentValue: ...,
                        optionKey: GALAXY_MODE_LEVEL,
                        onConfirm: (options, setMode) => {
                            // TODO: set mode options here
                            const mode = new GalaxyMode();
                            mode.init();
                            setMode(mode);
                            this.pop();
                        }
                    }
                ),
                new MenuPicker(
                    {
                        label: 'Play Classic',
                        values: LEVEL_VALUES(),
                        //currentValue: ...,
                        optionKey: TETRIS_MODE_LEVEL,
                        onConfirm: (options, setMode) => {
                            // TODO: set mode options here
                            const mode = new TetrisMode();
                            mode.init();
                            setMode(mode);
                            this.pop();
                        }
                    }
                ),
                new MenuPicker(
                    {
                        label: 'Play Baby',
                        values: LEVEL_VALUES(),
                        //currentValue: ...,
                        optionKey: BABY_MODE_LEVEL,
                        onConfirm: (options, setMode) => {
                            // TODO: set mode options here
                            const mode = new BabyMode();
                            mode.init();
                            setMode(mode);
                            this.pop();
                        }
                    }
                ),
                new MenuButton(
                    'Options',
                    (options, setMode) => this.push(this.optionsMenu)
                ),
                new MenuButton(
                    'Credits',
                    (options, setMode) => this.push(new MenuScreen(
                        'Credits',
                        [
                            new MenuButton(
                                'Ethan Fritz | Matthew Swanson | 2022',
                                (options, setMode) => {}
                            ),
                        ]
                    ))
                ),
            ]
        )
    }

    getOptionsMenu() {
        return new MenuScreen(
            'Options',
            [
                new MenuPicker(
                    {
                        label: 'Video',
                        values: [
                            ['None', ''],
                            ['Type 3', 'https://www.youtube-nocookie.com/embed/APkKjoQVNbk'],
                            ['Kalinka', 'https://www.youtube.com/embed/OvuWK_JQCV8'],
                            ['1984', 'https://www.youtube.com/embed/suj5OM3kg0U'],
                            ['99', 'https://www.youtube.com/embed/63hoSNvS6Z4'],
                        ],
                        //currentValue: ...,
                        optionKey: VIDEO_PLAYER_SRC,
                    }
                )
            ]
        );
    }

    withGameOver() {
        this.push(this.mainMenu);
        this.push(
            new MenuScreen(
                'You Died',
                [
                    new MenuButton(
                        'Return',
                        (options, setMode) => {
                            const mode = new TetrisMode();
                            mode.init();
                            setMode(mode);
                            this.pop();
                        }
                    )
                ]
            )
        );
        return this;
    }

    isVisible() {
        return this.peek() != null;
    }

    push(screen) {
        this.stack.push(screen);
    }

    pop() {
        this.stack.pop();
    }

    peek() {
        return this.stack.length <= 0
            ? null
            : this.stack[this.stack.length - 1];
    }


    /* Event handlers */

    onConfirm(options, setMode) {
        if (this.peek() != null) {
            this.peek().onConfirm(options, setMode);
        }
    }

    onBack() {
        if (this.peek() != null) {
            this.pop();
        } else {
            this.push(new MenuScreen(
                'Paused',
                [
                    new MenuButton('Resume', (options, setMode) => this.pop()),
                    new MenuButton(
                        'Exit',
                        (options, setMode) => {
                            const mode = new TetrisMode();
                            mode.init();
                            setMode(mode);
                            this.pop();
                            this.push(this.mainMenu);
                        }
                    )
                ]
            ));
        }
    }

    onUp() {
        if (this.peek() != null) {
            this.peek().onUp();
        }
    }

    onDown() {
        if (this.peek() != null) {
            this.peek().onDown();
        }
    }

    onLeft(options, setOptions) {
        if (this.peek() != null) {
            this.peek().onLeft(options, setOptions);
        }
    }

    onRight(options, setOptions) {
        if (this.peek() != null) {
            this.peek().onRight(options, setOptions);
        }
    }
}
