/*
    GLORY BE TO GOD,
    TIKETI-TAMASHA,
    NOT FOUND PAGE,

    BY ISRAEL MAFABI EMMANUEL
*/

import doodle_background from '../assets/tamasha_doodle_background.svg';
import "../styles/NotFound.css";

export default function NotFound() {
    return (
        <div className="tiketi-tamasha-not-found">
            <img className='tiketi-tamasha-doodle-background' src={doodle_background} alt="tamasha-doodle" />
            Page Not Found
        </div>
    );
}