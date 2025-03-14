/*
    GLORY BE TO GOD,
    TIKETI TAMASHA,
    DISCOVER CARD,

    BY ISRAEL MAFABI EMMANUEL
*/

import "../styles/DiscoverCard.css";

export default function DiscoverCard({cardImage, cardTitle, cardCount, onClick}) {
    return (
        <div className="tiketi-tamasha-discover-card" onClick={onClick}>
            <img className="card-image" src={cardImage} alt="TiketiTamashaCard" />
            <div className="card-info">
                <div className="title">{cardTitle}</div>
                <div className="count">{cardCount}</div>
            </div>
        </div>
    );
};