import './VideoPlayer.css';

const ALLOW = null; //'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';

export default function VideoPlayer(props) {
    let src = props.src;
    if (src == null) {
        return <></>;
    }
    return (
        <iframe
            className='VideoPlayer'
            width='256'
            height='144'
            src={props.src}
            title='YouTube video player'
            frameBorder='0'
            allow={ALLOW}
            allowFullScreen
        >
        </iframe>
    );
}