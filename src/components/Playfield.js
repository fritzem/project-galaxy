import Viewport from '../logic/Viewport';
import './Playfield.css';

export default function Playfield(props) {
    const allData = props.data;
    const screenWidth = props.screenWidth;
    const screenHeight = props.screenHeight;
    const activeBlock = props.activeBlock;
    const viewport = props.viewport;

    // Crop data to viewport
    const data = allData.slice(viewport.originY, viewport.originY + viewport.height);
    for (let i = 0; i < data.length; i++) {
        data[i] = data[i].slice(viewport.originX, viewport.originX + viewport.width);
    }
    // Computed parameters
    const width = viewport.width;
    const height = viewport.height;
    const blockSize = Math.floor(getBlockSize(width, height, screenWidth, screenHeight) * viewport.zoom);

    // Get active block and flatten its coordinates to viewport space
    const flatActiveSet =
        (activeBlock != null ? activeBlock.getSet() : [])
            .filter(cs => {
                let viewportX = cs[0] - viewport.originX;
                let viewportY = cs[1] - viewport.originY;
                return viewportX >= 0
                        && viewportX < width
                        && viewportY >= 0
                        && viewportY < height;
            })
            .map(cs => {
                let viewportX = cs[0] - viewport.originX;
                let viewportY = cs[1] - viewport.originY;
                return viewportY * width + viewportX
            });
    
    // Flatten highlighted viewport coordinates to viewport space
    const highlightedViewport = new Viewport(0, 0, 0, 0, 1);
    const highlightColor = 'red';
    const flatHighlightedViewport = [];
    for (let x = highlightedViewport.originX; x < highlightedViewport.originX + highlightedViewport.width; x++) {
        for (let y = highlightedViewport.originY; y < highlightedViewport.originY + highlightedViewport.height; y++) {                const viewportX = x - viewport.originX;
            const highlightedViewportX = x - viewport.originX;
            const highlightedViewportY = y - viewport.originY;
            flatHighlightedViewport.push(highlightedViewportY * width + highlightedViewportX);
        }
    }
        
    // Render blocks
    const flatData = data.flat();
    flatActiveSet.forEach(index => flatData[index] = activeBlock.type);
    const renderBlocks = [];
    for (let i = 0; i < flatData.length; i++) {
        const type = flatData[i];

        const imageUrl = getImageUrl(type);
        const color = null; //getColor(type);
        const borderSize = 1;
        const highlighted = flatHighlightedViewport.find(e => e == i) != undefined;
        const border = `${borderSize}px solid ${highlighted ? highlightColor : '#202020'}`;
        renderBlocks.push(renderBlock(i, blockSize, imageUrl, color, border, borderSize));
    }

    return (
        <div className='Playfield'>
            <div className='Playfield-grid-container'
                style={{
                    gridTemplateColumns: `repeat(${width}, 1fr)`,
                    gridTemplateRows: `repeat(${height}, ${blockSize}px`,
                }}
            >
                {renderBlocks}
            </div>
        </div>
    );
}

// key : Number        - The block index, used as a unique child id for react
// blockSize : Number  - Block size in pixels
// imageUrl : String   - URL for image background, null for no image (Need not include 'url(...)' wrapper)
// color : String      - CSS color for background, null for transparent
// border : String     - CSS border style
// borderSize : Number - Border size in pixels
function renderBlock(key, blockSize, imageUrl, color, border, borderSize) {
    const innerSize = `${blockSize - borderSize}px`;

    const imagePart = imageUrl != null
        ? (
            <div className='Playfield-block-inner'
                style={{
                    width: innerSize,
                    height: innerSize,
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: innerSize,
                    zIndex: 0,
                }}
            ></div>
        ) : null;

    const colorPart = color != null
        ? (
            <div className='Playfield-block-inner'
                style={{
                    width: innerSize,
                    height: innerSize,
                    backgroundColor: color,
                    zIndex: 1,
                }}
            ></div>
        ) : null;
    return (
        <div className='Playfield-block' key={key}
            style={{
                width: innerSize,
                height: innerSize,
                border: border,
            }}
        >
            {imagePart}
            {colorPart}
        </div>
    );
}

function getBlockSize(width, height, screenWidth, screenHeight) {
    let blockWidth = screenWidth / width;
    let blockHeight = screenHeight / height;
    return Math.min(blockWidth, blockHeight);
}

// Returns null for no image
function getImageUrl(type) {
    if (type == 0) {
        return null;
    } else if (type > 0 && type <= 7) {
        return `./images/solid-${type}.png`;
    } else {
        return './images/default.png';
    }
}

// Returns null for no color (complete transparency)
function getColor(type) {
    switch (type) {
        case 0: return null;
        case 1: return '#e0e020';
        case 2: return '#20e0e0';
        case 3: return '#2020e0';
        case 4: return '#e0a520';
        case 5: return '#20e020';
        case 6: return '#e02020';
        case 7: return '#e020e0';
        default: return '#e200e0';
    }
}
