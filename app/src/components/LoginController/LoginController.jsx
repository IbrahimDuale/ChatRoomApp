import { useContext, useState } from "react";
import { GlobalContext } from "../../Context/GlobalProvider";
import Login from "../Login/Login";
import "./LoginController.css";
import { collection, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db, admin_id, ROOM_NAMES_COLLECTION, MESSAGES_COLLECTION, MEMBERS_COLLECTION } from "../../firebase";
import { useNavigate } from "react-router-dom";

/**
 * Contains state for the Login page.
 */
const LoginController = () => {

    const { room_exists } = useContext(GlobalContext);

    //name of the room the user wishes to create.
    const [room_name, set_room_name] = useState("");
    //True when user tries to create a room with no room name.
    const [EMPTY_ROOM_NAME, set_EMPTY_ROOM_NAME] = useState(false);
    //True when a room id could not be created
    const [ID_GENERATION_FAIL, set_ID_GENERATION_FAIL] = useState(false);
    //True when room could not be created due to a database error.
    const [DATABASE_WRITE_FAIL, set_DATABASE_WRITE_FAIL] = useState(false);

    /**
     * Updates the room name the user wishes to create.
     * @param {string} new_name new room name
     */
    const update_room_name = async (new_name) => {
        //updates room name
        set_room_name(new_name);
        //resets EMPTY_ROOM_NAME flag
        set_EMPTY_ROOM_NAME(false);
    }

    //true when a room is currently being created.
    //Ideally create room should not be called when this is true.
    const [creating_room, set_creating_room] = useState(false);

    /**
     * Create a room name called ${room_name}.
     * @param {string} room_name name of room the room
     * 
     * @exception EMPTY_ROOM_NAME : attempted to create a room with an empty room name.
     * @exception ID_GENERATION_FAIL : could not create a room id
     * @exception DATABASE_WRITE_FAIL : couldnt not create a new room entry to the database
     */
    const create_room = async (room_name = "") => {
        //reseting of flags
        set_ID_GENERATION_FAIL(false);
        set_DATABASE_WRITE_FAIL(false);
        //prevents additional calls to create room.
        set_creating_room(true);
        //creates room
        await create_room_helper(room_name);
        //finished creating room.
        set_creating_room(false);

    }

    /**
     * Create a room name called ${room_name}.
     * @param {string} room_name name of room the room
     * 
     * @exception EMPTY_ROOM_NAME : attempted to create a room with an empty room name.
     * @exception ID_GENERATION_FAIL : could not create a room id
     * @exception DATABASE_WRITE_FAIL : couldnt not create a new room entry to the database
     */
    const create_room_helper = async (room_name) => {
        //raise EMPTY_ROOM_NAME flag if there is no room name.
        if (room_name.length === 0) {
            set_EMPTY_ROOM_NAME(true);
            return;
        }

        //id for the new room
        const new_id = (doc(collection(db, ROOM_NAMES_COLLECTION))).id;
        //if an id could not be generated throw an error
        if (!new_id) {
            set_ID_GENERATION_FAIL(true);
            return;
        }
        //created required database entries for the new room
        const batch = writeBatch(db);

        //creating entry for database that maps room_id -> the room's name.
        batch.set(doc(db, ROOM_NAMES_COLLECTION, new_id), { name: room_name });

        //creating entry for database that maps room_id -> room's messages.
        batch.set(doc(db, MESSAGES_COLLECTION, new_id), {});
        //creating entry for database that maps room_id -> members in the room.
        batch.set(doc(db, MEMBERS_COLLECTION, new_id), {});
        //creating welcome message
        batch.set(doc(db, MESSAGES_COLLECTION, new_id, MESSAGES_COLLECTION, new_id), { member_id: admin_id, content: `Welcome to ${room_name}!`, timeStamp: serverTimestamp() })

        await batch.commit().then(() => {
            //on successful write, the room's id is saved.
            set_created_room_id(new_id);
        }).catch((error) => {
            set_DATABASE_WRITE_FAIL(true);
        });
    }

    //id of most recently and successfully created room from create_room() routine. Empty if no room has been successfully created or created at all.
    const [created_room_id, set_created_room_id] = useState("");

    //id of the room the user wishes to join.
    const [room_id, set_room_id] = useState("");

    /**
     * Changes the id of the room the user wishes to join to ${new_room_id}
     * @param {string} new_room_id id of the room the user wanted to join.
     */
    const update_room_id = async (new_room_id) => {
        //updates room id
        set_room_id(new_room_id);
        //resets flags
        set_EMPTY_ROOM_ID(false);
        set_ROOM_ID_DNE(false);
    }

    //name the user wants to be reffered to in the room they wish to join.
    const [display_name, set_display_name] = useState("");

    /**
     * Changes to the the user wants to be reffered to as.
     * @param {string} new_name name the user wants to be reffered to in room.
     */
    const update_display_name = async (new_name) => {
        //updates display name
        set_display_name(new_name);
        //resets EMPTY_DISPLAY_NAME flag
        set_EMPTY_DISPLAY_NAME(false);
    }

    //true when the user is attempting to join a room.
    //ideally join_room() should not be called when this is true.
    const [joining_room, set_joining_room] = useState(false);

    //true when user attempts to join a room with no room id.
    const [EMPTY_ROOM_ID, set_EMPTY_ROOM_ID] = useState(false);
    //true when user attempts to join a room that does not exist.
    const [ROOM_ID_DNE, set_ROOM_ID_DNE] = useState(false);
    //true when user attempts to join a room without a display name.
    const [EMPTY_DISPLAY_NAME, set_EMPTY_DISPLAY_NAME] = useState(false);

    /**
     * Checks if user can join room. On success, the user is navigated to the room page
     * and the ${room_id} and ${display_name} are passed to the chat room page in the link.
     * @param {string} room_id room the user wants to join.
     * @param {string} display_name name the user wants to be reffered to as.
     */
    const join_room = async (room_id = "", display_name = "") => {
        //reseting flags
        set_ROOM_ID_DNE(false);
        set_EMPTY_DISPLAY_NAME(false);
        //notifies components that joining room is now in progress.
        set_joining_room(true);
        await join_room_helper(room_id, display_name);
        //notifies components that joining room is no longer in progress.
        set_joining_room(false);
    }

    //if join_room() is successful user is navigated to the chat room page with the room_id
    //and their display name passed as parameters
    const navigate = useNavigate();

    /**
     * Checks if user can join room. On success, the user is navigated to the room page
     * and the ${room_id} and ${display_name} are passed to the chat room page in the link.
     * @param {string} room_id room the user wants to join.
     * @param {string} display_name name the user wants to be reffered to as.
     */
    const join_room_helper = async (room_id, display_name) => {
        //raise a flag if user did not enter a room id.
        if (!room_id) {
            set_EMPTY_ROOM_ID(true);
            return;
        }

        //raise a flag if user did not enter a display name.
        if (!display_name) {
            set_EMPTY_DISPLAY_NAME(true);
            return;
        }

        const is_exists = await room_exists(room_id);

        //raise an error if user is trying to join a room that doesn't exist.
        if (!is_exists) {
            set_ROOM_ID_DNE(true)
            return;
        }

        navigate(`/chatroom?display_name=${display_name}&room_id=${room_id}`);
    }

    return (
        <div className="loginController">
            {/*Ui for the login page*/}
            <Login room_name={room_name} update_room_name={update_room_name} creating_room={creating_room} create_room={create_room} created_room_id={created_room_id}
                room_id={room_id} update_room_id={update_room_id} display_name={display_name} update_display_name={update_display_name}
                joining_room={joining_room} join_room={join_room} error_flags={{ EMPTY_ROOM_NAME, ID_GENERATION_FAIL, DATABASE_WRITE_FAIL, EMPTY_ROOM_ID, ROOM_ID_DNE, EMPTY_DISPLAY_NAME }} />
        </div>
    )
}

export default LoginController;