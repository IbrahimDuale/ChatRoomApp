import { useNavigate, useSearchParams } from "react-router-dom";
import ChatRoom from "../ChatRoom/ChatRoom";
import "./ChatRoomController.css";
import { realtimeDb, auth, db, ROOM_NAMES_COLLECTION, MEMBERS_COLLECTION, MESSAGES_COLLECTION } from "../../firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
import { ref, onValue, onDisconnect, set, } from "firebase/database";
import { useRef } from "react";

/**
 * controls state of the chat room page.
 * 
 */
const ChatRoomController = () => {
    //true when the user is in the process of connecting to the chat room.
    const [connecting, setConnecting] = useState(true);

    //true when the user is connected to the chat room.
    const [connected, setConnected] = useState(false);

    //allows navigation without reloading the page.
    const navigate = useNavigate();

    /**
     * redirects the user to the home page without reloading.
     */
    const leave = () => {
        navigate("/");
    }

    //used to query the room_id and user's name from the url.
    let [searchParams,] = useSearchParams();

    //name of the user. Contains in url parameter display_name.
    const [display_name, set_display_name] = useState("");
    //true when display_name is missing in the url parameter
    const [NO_NAME_ERROR, SET_NO_NAME_ERROR] = useState(false);

    const [room_id, set_room_id] = useState("");
    //true when room id is missing in the url parameter
    const [NO_ROOM_ID_ERROR, SET_NO_ROOM_ID_ERROR] = useState(false);

    //true when the url params have been successfully parsed.
    const [USER_PARAMS_PARSED, SET_USER_PARAMS_PARSED] = useState(false);

    //parses user's name and the room name from the url and sets their variables.
    useEffect(() => {
        const room_id = searchParams.get("room_id")
        set_room_id(room_id);
        const display_name = searchParams.get("display_name");
        set_display_name(display_name);

        //if room_id was missing as a parameter throw NO_ROOM_ID_ERROR
        if (!room_id) {
            SET_NO_ROOM_ID_ERROR(true);
        }

        //if display name is not a parameter throw a NO_NAME_ERROR
        if (!display_name) {
            SET_NO_NAME_ERROR(true);
        }

        if (room_id && display_name) {
            SET_USER_PARAMS_PARSED(true);
        }

    }, [searchParams])


    //id of the user.
    const [user_id, set_user_id] = useState(auth?.currentUser?.uid || "");
    //true when user signs out.
    const [USER_SIGN_OUT_ERROR, SET_USER_SIGNED_OUT_ERROR] = useState(false);

    //Gets the user's id from the anonymous auth and stores it in ${user_id}.
    useEffect(() => {
        //Allows the user to skip the login page and still recieve an id.
        onAuthStateChanged(auth, (user) => {
            if (user) {
                //Unique id of the user.
                const uid = user.uid;
                set_user_id(uid);
            } else {
                // User is signed out, this should never happen since the id is neccessary to access the chat room.
                SET_USER_SIGNED_OUT_ERROR(true);
            }
        });
    }, [])

    //name of the room that is established when the client successfully connects.
    const [room_name, set_room_name] = useState("");
    //true when the db failed to store the room's name.
    const [NO_ROOM_NAME_ERROR, SET_NO_ROOM_NAME_ERROR] = useState(false);
    //true when the db with room's names cannot be accessed.
    const [ROOM_NAME_DB_ERROR, SET_ROOM_NAME_DB_ERROR] = useState(false);

    //flag for determing when the user is connected
    const [ROOM_NAME_RECIEVED, SET_ROOM_NAME_RECIEVED] = useState(false);

    //Gets the room's name from the db and stores it.
    useEffect(() => {
        /**
         * Get's the room's name corresponding to ${room_id}
         * @param {object} db reference to database
         * @param {string} room_name name of room's name collection
         * @param {string} room_id key of the room of interest.
         * Exceptions:
         * ROOM_NAME_DB_ERROR : could not access database.
         * NO_ROOM_NAME_ERROR : room's name was not stored in the db.
         */
        const get_room_name = async (db, room_name, room_id) => {
            const docRef = doc(db, room_name, room_id);
            const docSnap = await getDoc(docRef).catch(() => {
                //failed to read database
                SET_ROOM_NAME_DB_ERROR(true);
            });

            if (docSnap.exists()) {
                set_room_name(docSnap.data().name);
                SET_ROOM_NAME_RECIEVED(true);
            } else {
                //entry not in database.
                SET_NO_ROOM_NAME_ERROR(true);
            }
        }

        if (USER_PARAMS_PARSED) {
            get_room_name(db, ROOM_NAMES_COLLECTION, room_id);
        }
    }, [USER_PARAMS_PARSED, room_id])

    //TODO: cache old messages in case user visits the same room a second time.
    const [messages, setMessages] = useState({});
    //true when the listener fails to recieve a message.
    const [MESSAGE_LISTENER_ERROR, SET_MESSAGE_LISTENER_ERROR] = useState(false);

    //Gets the room's messages from the db and stores it.
    //Connects to the websocket server to listen for NEW_MESSAGE events.
    useEffect(() => {
        let unsubscribe = null;
        const get_and_listen_messages = async (db, messages, room_id) => {
            //TODO: ADD CACHING BEHAVIOUR BY ADDING A WHERE CLAUSE.
            const collection_ref = collection(db, messages, room_id, messages);
            //first call on onSnapshot gets all messages in the room
            //subsequence call is equivalent to a NEW_MESSAGE event
            unsubscribe = onSnapshot(collection_ref, (snapshot) => {
                const messages = {};
                snapshot.docChanges().forEach((change) => {

                    if (change.type === "added") {
                        messages[change.doc.id] = change.doc.data();
                        //if user sent the message the timeStamp will be null since it's generated on the server
                        //and the message event will be triggered before it's sent to the server to increase responsiveness.
                        if (!messages[change.doc.id].timeStamp) {
                            messages[change.doc.id].timeStamp = Timestamp.now();
                        }
                    }
                })
                setMessages((prev) => {
                    let new_messages = { ...prev, ...messages };
                    return new_messages;
                });
            }, (error) => {
                SET_MESSAGE_LISTENER_ERROR(true);
                console.log(error);
            })
        }

        if (USER_PARAMS_PARSED) {
            get_and_listen_messages(db, MESSAGES_COLLECTION, room_id);
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        }
    }, [USER_PARAMS_PARSED, room_id]);



    //members connected to the room
    const [members, setMembers] = useState([]);
    //true when cannot listen to MEMBER_CHANGE events.
    const [MEMBERS_LISTEN_ERROR, SET_MEMBERS_LISTEN_ERROR] = useState(false);

    //Gets the room's members from the db and stores it.
    //Connects to the websocket server to listen for USER_LEFT and NEW_USER events.
    useEffect(() => {
        let unsubscribe = null;
        const get_and_listen_members = (db, members_collection, room_id) => {
            const collection_ref = collection(db, members_collection, room_id, members_collection);
            //first call on onSnapshot gets all members in the room
            //subsequence call is equivalent to a UPDATED_MEMBERS event.
            unsubscribe = onSnapshot(collection_ref, (snapshot) => {
                const members = {};
                snapshot.forEach((doc) => {
                    members[doc.id] = doc.data();
                })
                setMembers(members);

            }, (error) => {
                SET_MEMBERS_LISTEN_ERROR(true);
                console.log(error);
            })

        }

        if (USER_PARAMS_PARSED) {
            get_and_listen_members(db, MEMBERS_COLLECTION, room_id);
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        }
    }, [USER_PARAMS_PARSED, room_id]);

    //true when the onLeave handler is set up to emit a USER_LEFT event.
    const [ONDISCONNECT_SETUP, SET_ONDISCONNECT_SETUP] = useState(false);

    //USER_LEFT event setup.
    useEffect(() => {

        const on_disconnect = (db, room_id, member_id, member_name) => {
            // Since I can connect from multiple devices or browser tabs, we store each connection instance separately
            // any time that connectionsRef's value is null (i.e. has no children) I am offline

            const myConnectionsRef = ref(db, `users/${member_id}`);
            const member_data = { name: member_name, id: member_id, room_id, };

            const connectedRef = ref(db, '.info/connected');
            onValue(connectedRef, (snap) => {
                if (snap.val() === true) {
                    // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)

                    // When I disconnect, remove this device
                    onDisconnect(myConnectionsRef).remove().catch((err) => {
                        if (err) {
                            console.error("could not establish onDisconnect event", err);
                        }
                    });

                    // Add this device to my connections list
                    // this value could contain info about the device or a timestamp too
                    set(myConnectionsRef, member_data);
                    SET_ONDISCONNECT_SETUP(true);
                }
            });
        }

        if (USER_PARAMS_PARSED && user_id && display_name) {
            on_disconnect(realtimeDb, room_id, user_id, display_name)
        }

    }, [USER_PARAMS_PARSED, room_id, user_id, display_name]);

    //true when messages have been retrieved and listener for NEW_MESSAGE events have been set up.
    const [MESSAGES_SETUP, SET_MESSAGES_SETUP] = useState(false);
    //true when members connected to the chatroom have been retrieved and listeners for
    //NEW_USER and USER_LEFT events have been set up
    const [MEMBERS_SETUP, SET_MEMBERS_SETUP] = useState(false);

    //checks if the NEW_MESSAGE event listener is set up
    useEffect(() => {
        //when the NEW_MESSAGE listener is set up the messages object will contains atleast the room's welcome message.
        if (Object.keys(messages).length > 0) {
            SET_MESSAGES_SETUP(true);
        }
    }, [messages])

    //checks if the USER_LEFT and NEW_USER listener is set up
    useEffect(() => {
        //when the listeners are installed the members array will have atleast the user's name stored.
        if (Object.keys(members).length > 0) {
            SET_MEMBERS_SETUP(true);
        }
    }, [members])

    //sets connection status to connected when pre-reqs have been met.
    useEffect(() => {
        if (USER_PARAMS_PARSED && ROOM_NAME_RECIEVED && MESSAGES_SETUP &&
            MEMBERS_SETUP && ONDISCONNECT_SETUP) {
            setConnecting(false);
            setConnected(true);
        }
    }, [USER_PARAMS_PARSED, ROOM_NAME_RECIEVED, MESSAGES_SETUP, MEMBERS_SETUP, ONDISCONNECT_SETUP])

    //message the user is thinking of sending to the room.
    const [message, setMessage] = useState("");
    //true when user tried to send an empty message
    const [EMPTY_MESSAGE_ERROR, SET_EMPTY_MESSAGE_ERROR] = useState(false);


    /**
     * Updates the message the user is thinking of sending to ${new_message}
     * @param {string} new_message new message
     */
    const update_message = (new_message) => {
        setMessage(new_message);
        SET_EMPTY_MESSAGE_ERROR(false);
    }

    //reference for the message input field; used for refocusing after sending a message.
    const message_ref = useRef(null);

    /**
     * Sends a message to the room.
     * @param {string} message message the user is sending
     */
    const send_message = async (message, member_id, room_id, name, ref) => {
        if (!message) {
            SET_EMPTY_MESSAGE_ERROR(true);
            return;
        }
        const newDoc = doc(collection(db, MESSAGES_COLLECTION, room_id, MESSAGES_COLLECTION));
        if (ref.current) {
            ref.current.focus();
        }
        update_message("");
        return setDoc(newDoc, { content: message, member_id: member_id, timeStamp: serverTimestamp(), name })
    }





    return (
        <div className="chatRoomController">
            <ChatRoom input_field_ref={message_ref} error_flags={{ EMPTY_MESSAGE_ERROR, NO_ROOM_ID_ERROR, NO_NAME_ERROR, USER_SIGN_OUT_ERROR, NO_ROOM_NAME_ERROR, ROOM_NAME_DB_ERROR, MESSAGE_LISTENER_ERROR, MEMBERS_LISTEN_ERROR }}
                leave={leave} connecting={connecting} connected={connected} room_name={room_name} username={display_name} user_id={user_id}
                messages={messages} members={members} message={message} update_message={(new_val) => update_message(new_val)} send_message={(msg) => send_message(msg, user_id, room_id, display_name, message_ref)} />
        </div>
    )
}

export default ChatRoomController;