import './FrameCounter.css';

export default function FrameCounter(props) {
    return (
        <div className='FrameCounter'>
            Frames: {props.frames}
        </div>
    );
}
