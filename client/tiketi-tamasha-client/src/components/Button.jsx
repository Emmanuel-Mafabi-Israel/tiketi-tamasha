/*
    GLORY BE TO GOD,
    TIKETI TAMASHA,

    BUTTON,
    BY ISRAEL MAFABI EMMANUEL
*/

import "../styles/Button.css";

export default function Button({className = 'tiketi-tamasha-btn', onClick, buttonText, image, alt, type}) {
    return (
        <button type={type} className={className} onClick={onClick}>
            <div className="text">
                {buttonText}
            </div>
            {image && <img className="image" src={image} alt={alt}></img>}
        </button>
    );
};