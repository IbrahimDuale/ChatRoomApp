import { useRef, useState } from "react";
import "./ClipBoard.css";

const ClipBoard = ({ copyText }) => {
    const [copied, setCopied] = useState(false);
    const timerIdRef = useRef(null);
    /**
     * Copies text to clipboard and changes clipboard to a copy state for 3 seconds.
     * @param {string} copyText text to copy to clip board
     */
    const copyClick = (copyText, timerIdRef) => {
        navigator.clipboard.writeText(copyText);
        const time = 1500;

        if (timerIdRef.current === null) {
            setCopy(timerIdRef, setCopied, time);
        }
        else {
            //reset previous timer to prevent state change
            clearInterval(timerIdRef.current);
            setCopy(timerIdRef, setCopied, time);

        }
    }

    /**
     * sets the component's state to copied for ${time} milliseconds.
     * @param {object} timerIdRef stores timer id
     * @param {fn} setCopied sets copied status
     * @param {int} time interval length in milliseconds
     */
    const setCopy = (timerIdRef, setCopied, time) => {
        setCopied(true);
        timerIdRef.current = setInterval(() => {
            setCopied(false);
        }, time)
    }

    return (
        <div className="clipBoard">
            {
                copyText &&
                <p className={`clipBoard__copy ${copied && "clipBoard__copy--success"}`}
                    onClick={() => copyClick(copyText, timerIdRef)}>
                    <span className="clipBoard__copiedText">{copied && "Copied!"}</span>
                    <span className={copied ? "clipBoard__copy--hide" : ""}>{copyText}</span>
                </p>
            }
        </div>
    )
}

export default ClipBoard;