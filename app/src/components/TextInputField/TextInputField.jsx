import InputField from "../InputField/InputField";
import "./TextInputField.css";

const TextInputField = ({ name, text, maxLength, onChange, empty_name_error }) => {

    return (
        <div className="textInputField">
            <p className="textInputField__name">
                {name}
            </p>
            <InputField text={text} maxLength={maxLength} onChange={(new_val) => onChange(new_val)}
                empty_name_error={empty_name_error} />
        </div>
    )
}

export default TextInputField;