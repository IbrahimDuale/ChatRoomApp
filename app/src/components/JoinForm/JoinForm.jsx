import Button from "../Button/Button";
import ErrorText from "../ErrorText/ErrorText";
import Loader from "../Loader/Loader";
import TextInputField from "../TextInputField/TextInputField";
import "./JoinForm.css";

const JoinForm = ({ username, update_username, room_id, update_room_id,
    join_room, joining_room, error_flags }) => {
    //max length for a username
    const username_maxLength = 10;
    return (
        <div className="joinForm">
            <ErrorText text={"*Cannot join a room with no user name."} flag={error_flags.EMPTY_DISPLAY_NAME} />
            <TextInputField name={"Name:"} text={username} maxLength={username_maxLength} onChange={(new_val) => update_username(new_val)}
                empty_name_error={error_flags.EMPTY_DISPLAY_NAME} onEnter={() => join_room(room_id, username)} />
            {error_flags.EMPTY_ROOM_ID ?
                (<ErrorText text={"*Cannot join a room with no room id."} flag={error_flags.EMPTY_ROOM_ID} />) :
                (<ErrorText text={"*room does not exist."} flag={error_flags.ROOM_ID_DNE} />)
            }
            <TextInputField name={"Room Id:"} text={room_id} maxLength={100} onChange={(new_val) => update_room_id(new_val)}
                empty_name_error={error_flags.EMPTY_ROOM_ID || error_flags.ROOM_ID_DNE} onEnter={() => join_room(room_id, username)} />
            <div className="joinForm__buttonContainer">
                <Loader isLoading={joining_room} component={<Button onClick={() => join_room(room_id, username)} text={"Join Room"} />} />
            </div>

        </div>
    )
}

export default JoinForm;