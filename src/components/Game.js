import './Game.css';
import React from 'react';
import { memo } from 'react';
import FrameCounter from './FrameCounter';
import Playfield from './Playfield';
import Input from '../Input';
import Dir from './../logic/spawns/Dir';
import GameLabel from './GameLabel';

//Instance of a playable game
//Most of the mechanics are deferred to the mode
class Game extends React.Component {    
    constructor(props) {
        super(props);
        this.lastUpdate = Date.now();
        this.state = {
            frames: 0,
        };
    }

    update(delta, menuState, setMenuState) {
        // Process inputs
        let activeKeys = Input.Poll();
        let movements = [];
        //It would be nice to define some keycodes
        if (activeKeys.includes(37)) {
            movements.push(Dir.Left);
        }
        if (activeKeys.includes(39)) {
            movements.push(Dir.Right);
        }
        if (activeKeys.includes(40)) {
            movements.push(Dir.Down);
        }
        if (activeKeys.includes(38)) {
            movements.push(Dir.Up);
        }
        if (activeKeys.includes(90)) {
            movements.push(Dir.SpinLeft);
        }
        if (activeKeys.includes(88)) {
            movements.push(Dir.SpinRight);
        }
        if (activeKeys.includes(32)) {
            movements.push(Dir.HardDrop);
        }
        if (activeKeys.includes(16)) {
            this.props.mode.attemptHold();
        }
        
        this.props.mode.receiveInput(movements);

        this.props.mode.update(delta, menuState, setMenuState);
    }

    render() {
        return (
            <>
                <FrameCounter frames={this.state.frames}/>
                {this.renderMode()}
            </>
        )
    }

    renderMode() {
        const playfield = (
            <Playfield 
                data={this.props.mode.playfield}
                activeBlock={this.props.mode.activeBlock}
                viewport={this.props.mode.viewport}
                screenWidth={window.innerWidth}
                screenHeight={window.innerHeight}
            />
        );
        return (
            <div
                className='Game'
                style={{
                    filter: this.props.menuState.isVisible() ? 'blur(10px)' : null
                }}
            >
                {/* Header */}
                <div
                    className='Game-section'
                >
                    <GameLabel title='Hi-Score' value='0'/>
                    <GameLabel title='Score' value={this.props.mode.score}/>
                </div>
                {/* Body */}
                <div className='Game-section'>
                    {playfield}
                </div>
                {/* Footer */}
                <></>
            </div>
        );
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => {
                // Poll
                let previousUpdate = this.lastUpdate;
                this.lastUpdate = Date.now();
                if (!this.props.menuState.isVisible()) {
                    this.update(this.lastUpdate - previousUpdate, this.props.menuState, this.props.setMenuState);
                }
                this.setState({
                    frames: this.state.frames + 1
                });
            },
            1000 / 60
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }
}

export default memo(Game);
