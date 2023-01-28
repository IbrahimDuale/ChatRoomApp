import { useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import ClipBoard from "../ClipBoard/ClipBoard";
import "./CreateForm.css";

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

/**
 * Ui for creating a room in the login page
 */
const CreateForm = ({ room_name, update_room_name, create_room, creating_room,
    created_room_id, error_flags }) => {
    let [color,] = useState("#000");
    const maxLength = 25;
    return (
        <div className="createForm">
            <div className="createForm__formContainer">
                <div className="createForm__roomContainer">
                    <p className="createForm__roomName">
                        Room Name:
                    </p>
                    <div className="createForm__roomInputContainer">
                        <input type="text" className="createForm__roomInput" maxLength={maxLength} value={room_name} onChange={(e) => update_room_name(e.target.value)} />
                    </div>
                </div>
                <div className="createForm__createRoomButtonContainer">
                    <button className="createForm__createRoomButtom" onClick={() => create_room(room_name)}>Create Room</button>
                </div>
            </div>
            <div className="createForm_clipBoardContainer">
                <p className="createForm__clipBoardText">
                    Click Copy:
                </p>
                <div className="createForm__clipBoardCopy">
                    {creating_room ?
                        (
                            <BeatLoader
                                color={color}
                                loading={creating_room}
                                cssOverride={override}
                                size={10}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                        ) :
                        (<ClipBoard copyText={created_room_id} />)
                    }
                </div>
            </div>
        </div>
    )
}

export default CreateForm;