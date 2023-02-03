import Button from "../Button/Button";
import InputField from "../InputField/InputField";
import Status from "../Status/Status";
import "./ChatRoom.css";
import MessagesWrapper from "../MessagesWrapper/MessagesWrapper";
import MembersWrapper from "../MembersWrapper/MembersWrapper";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { BiArrowBack } from "react-icons/bi";
import { AiOutlineMenu } from "react-icons/ai";

const ChatRoom = ({ error_flags, leave, connecting, connected, room_name, username,
    user_id, messages, members, message, update_message, send_message, input_field_ref }) => {
    const message_max_length = 125;

    const messagesRef = useRef(null);
    const [showMenu, setShowMenu] = useState(false);
    useEffect(() => {
        messagesRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        console.log(messagesRef.current.scrollIntoView);
    }, [messages])
    return (
        <div className="chatRoom">
            <div className="chatRoom__header">
                <div className="chatRoom__header__left">
                    <div className="chatRoom__iconContainer" onClick={() => leave(user_id)}>
                        <BiArrowBack className="chatRoom__icon" />
                    </div>
                    <h1 className="chatRoom__roomName">{room_name}</h1>
                </div>
                <div className="chatRoom__header__right">
                    <div className="chatRoom__iconContainer" onClick={() => setShowMenu(!showMenu)}>
                        <AiOutlineMenu className="chatRoom__icon" />
                    </div>
                    <div className="chatRoom__connectionStatus">
                        <Status online={connected} />
                    </div>
                </div>
            </div>
            <div className="chatRoom__contentContainer">
                <div className="chatRoom__chatAndMessageContainer">
                    <div className="chatRoom__chatContainer">
                        <div ref={messagesRef} className="chatRoom__innerContainer">
                            <MessagesWrapper messages={messages} user_id={user_id} />
                        </div>
                    </div>
                    <div className="chatRoom__messageContainer">
                        <div className="chatRoom_inputFieldContainer">
                            <InputField input_field_ref={input_field_ref} text={message} maxLength={message_max_length} onChange={(new_val) => update_message(new_val)}
                                empty_name_error={error_flags.EMPTY_MESSAGE_ERROR} onEnter={() => send_message(message)} />
                        </div>
                        <div className="chatRoom__sendMessageContainer">
                            <Button onClick={() => send_message(message)} text={"Send"} />
                        </div>
                    </div>

                </div>
                <div className={`chatRoom__membersContainer ${!showMenu && "chatRoom__members--hide"}`}>
                    <h2 className="chatRoom__membersTitle">Members</h2>
                    <div className="chatRoom__membersContentContainer">
                        <MembersWrapper members={members} user_id={user_id} showMenu={showMenu} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatRoom;