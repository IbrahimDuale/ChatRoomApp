import InputField from "../InputField/InputField";
import "./JoinForm.css";

const JoinForm = ({ username, update_username, room_id, update_room_id,
    join_room, joining_room, error_flags }) => {
    const textMaxLength = 25;
    return (
        <div className="joinForm">
            <div className="joinForm__innerContainer">
                <div className="joinForm__inputContainer">
                    <p className="joinForm__text">
                        Display Name:
                    </p>
                    <InputField text={username} maxLength={textMaxLength} onChange={(new_val) => update_username(new_val)}
                        empty_name_error={error_flags.EMPTY_DISPLAY_NAME} />
                </div>
                <div className="joinForm__inputContainer">
                    <p className="joinForm__text">
                        Display Name:
                    </p>
                </div>
            </div>
        </div>
    )
}

export default JoinForm;