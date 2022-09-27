import './Menu.css';
import MenuButton from './state/MenuButton';
import MenuPicker from './state/MenuPicker';

export default function MenuComponent(props) {
    const screen = props.state.peek();
    if (screen == null) {
        return <></>;
    } else {
        return (
            <div className='Menu-background'>
                <div className='Menu-content'>
                    <h1
                        className='Menu-heading'
                        key={screen.title}
                    >{screen.title}</h1>
                    {renderItems(screen)}
                </div>
            </div>
        );
    }
}

function renderItems(screen) {
    const renderItems = [];
    for (let i = 0; i < screen.items.length; i++) {
        renderItems.push(
            <div
                className={i == screen.index ? 'selected' : null}
                key={`menu-${i}`}
            >
                {renderItem(screen.items[i])}
            </div>
            
        );
    }
    return renderItems;
}

function renderItem(item) {
    if (item instanceof MenuButton) {
        return (
            <p className='MenuLabel'>{item.label}</p>
        );
    } else if (item instanceof MenuPicker) {
        const label = `${item.label} < ${item.getValueText()} >`;
        return (
            <p className='MenuLabel'>{label}</p>
        );
    } else {
        throw `Unknown MenuItem type: ${typeof item}`;
    }
}
