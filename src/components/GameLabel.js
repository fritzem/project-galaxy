import './Game.css';

export default function GameLabel(props) {
    const title = props.title;
    const value = props.value;

    return (
        <div className='GameLabel'>
            <div
                className='GameLabel-inner'
                style={{
                    width: '8em',
                }}
            >
                <p>{title}</p>
                <p>{value}</p>
            </div>
        </div>
    );
}
