export default function MenuButton(props) {
    let text = props.text;
    let onClick = props.onClick == null ? () => {} : props.onClick;
    let selected = props.selected;

    return (
        <div className={selected ? 'selected' : null}>
            <button
                className='MenuButton'
                onClick={onClick}
            >
                {text}
            </button>
        </div>
    );
}
