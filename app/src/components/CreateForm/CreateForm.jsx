import Button from "../Button/Button";
import ClipBoard from "../ClipBoard/ClipBoard";
import ErrorText from "../ErrorText/ErrorText";
import Loader from "../Loader/Loader";
import TextInputField from "../TextInputField/TextInputField";
import "./CreateForm.css";


/**
 * Ui for creating a room in the login page
 */
const CreateForm = ({ room_name, update_room_name, create_room, creating_room,
    created_room_id, error_flags }) => {
    const maxLength = 25;
    //shows counter on input when input is in focus
    return (
        <div className="createForm">
            <div className="createForm__formContainer">
                <ErrorText text={"*Cannot create a room with no room name."} flag={error_flags.EMPTY_ROOM_NAME} />
                <TextInputField name={"Room Name:"} text={room_name} maxLength={maxLength} onChange={(new_val) => update_room_name(new_val)}
                    empty_name_error={error_flags.EMPTY_ROOM_NAME} />
                <div className="createForm__createRoomButtonContainer">
                    <Loader isLoading={creating_room} component={<Button onClick={() => create_room(room_name)} text={"Create Room"} />} />
                </div>
            </div>
            <div className="createForm_clipBoardContainer">
                <p className="createForm__clipBoardText">
                    Click Copy:
                </p>
                <div className="createForm__clipBoardCopy">
                    <Loader isLoading={creating_room} component={<ClipBoard copyText={created_room_id} />} />
                </div>
                {
                    error_flags.ID_GENERATION_FAIL ?
                        (<ErrorText text={"*Could not create room."} flag={error_flags.ID_GENERATION_FAIL} />) :
                        (<ErrorText text={"*Failed to contact database."} flag={error_flags.DATABASE_WRITE_FAIL} />)
                }
            </div>
        </div>
    )
}

export default CreateForm;