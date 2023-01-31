import { useState } from "react";
import Counter from "../Counter/Counter";
import "./InputField.css";

const InputField = ({ text, maxLength, onChange, empty_name_error }) => {
    //shows counter on input when input is in focus
    const [show, setShow] = useState(false);
    return (
        <div className="inputField">
            <Counter count={text.length} maxCount={maxLength} show={show} />
            <input type="text" className={`inputField__input ${empty_name_error && "inputField__input--error"}`}
                maxLength={maxLength} value={text} onChange={(e) => onChange(e.target.value)}
                onFocus={() => setShow(true)} onBlur={() => setShow(false)} />
        </div>
    )
}

export default InputField;