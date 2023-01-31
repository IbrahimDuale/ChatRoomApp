import { useState } from "react";
import CreateForm from "../CreateForm/CreateForm";
import JoinForm from "../JoinForm/JoinForm";
import Navigation from "../Navigation/Navigation";
import "./Login.css";

/**
 * UI for the login page API at readme.md
 * 
 * 
 */
const Login = ({ room_name, update_room_name, creating_room, create_room,
    created_room_id, room_id, update_room_id, display_name, update_display_name,
    joining_room, join_room, error_flags }) => {

    //navigation links text
    const links = ["Join A Room", "Create A Room"];
    //index of form user wants. zero shows the join room form, one shows the create a room form.
    const [active_index, set_active_index] = useState(0);

    return (
        <div className="login">
            {/*User chooses which form to show with the Navigation component*/}
            <div className="login__navigationContainer">
                <Navigation links={links} active_index={active_index} set_active_index={(e) => set_active_index(e)} />
            </div>
            {/*The join-a-room form and create-a-room form.*/}
            <div className="login__formContainer">
                {active_index === 0 ?
                    (<JoinForm username={display_name} update_username={update_display_name} room_id={room_id} update_room_id={update_room_id}
                        join_room={join_room} joining_room={joining_room} error_flags={error_flags} />) :
                    (<CreateForm room_name={room_name} update_room_name={update_room_name} create_room={create_room} creating_room={creating_room}
                        created_room_id={created_room_id} error_flags={error_flags} />)
                }
            </div>
        </div>
    )
}

export default Login;