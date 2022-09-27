import React, { useState, useEffect } from 'react';
import './App.css';
import Input from './Input';
import Options, { VIDEO_PLAYER_SRC } from './Options';
import Game from './components/Game';
import VideoPlayer from './components/VideoPlayer';
import MenuState from './menu/state/MenuState';
import MenuComponent from './menu/MenuComponent';
import TetrisMode from './logic/modes/TetrisMode';

const APP = 'App';
const ENTER = 13;
const ESCAPE = 27;
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

Input.Initialize();

const INITIAL_MODE = () => {
    const mode = new TetrisMode();
    mode.init();
    return mode;
};

export default function App(props) {
    const [menuState, setMenuState] = useState(new MenuState());
    const [mode, setMode] = useState(INITIAL_MODE);
    const [options, setOptions] = useState(new Options());
    useEffect(() => document.getElementById(APP).focus());

    return (
        <div
            id={APP}
            className={APP}
            onKeyDown={e => onKeyDown(e, menuState, setMenuState, setMode, options, setOptions)}
            tabIndex={-1}
        >
            <VideoPlayer src={options.get(VIDEO_PLAYER_SRC)}/>
            <MenuComponent state={menuState}/>
            <Game
                mode={mode}
                menuState={menuState}
                setMenuState={setMenuState}
            />
        </div>
    );
}

function onKeyDown(e, menuState, setMenuState, setMode, options, setOptions) {
    const keyCode = e.keyCode;
    if (keyCode == ENTER) {
        menuState.onConfirm(options, setMode);
    } else if (keyCode == ESCAPE) {
        menuState.onBack();
    } else if (keyCode == LEFT) {
        menuState.onLeft(options, setOptions);
    } else if (keyCode == UP) {
        menuState.onUp();
    } else if (keyCode == RIGHT) {
        menuState.onRight(options, setOptions);
    } else if (keyCode == DOWN) {
        menuState.onDown();
    }
    // TODO: this can be optimized by not cloning everytime
    setMenuState(menuState.clone());
}
