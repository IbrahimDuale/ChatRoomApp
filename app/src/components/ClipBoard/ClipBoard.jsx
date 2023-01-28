import "./ClipBoard.css";

const ClipBoard = ({ copyText }) => {
    /*
    TODO:
    WHEN CLIPBOARD CLICKED TURN GREEN AND SAY COPIED FOR 3 SECONDS THEN GO BACK TO NORMAL
    WHEN INPUT FIELD IS CLICKED OUTLINE TURNS BLUE AND X/25 DISPLAYED IN TOP RIGHT CORNER
    */
    return (
        <div className="clipBoard">
            <p className="clipBoard__copy" onClick={() => { navigator.clipboard.writeText(copyText); }}>{copyText}</p>
        </div>
    )
}

export default ClipBoard;