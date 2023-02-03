import { Timestamp } from "firebase/firestore";
import "./MessagesWrapper.css";
import date from 'date-and-time';
import Messages from "../Messages/Messages";
/*
Changes the messages and user_id to the format the Messages component expects
*/
const MessagesWrapper = ({ messages, user_id }) => {

    /**
     * converts the messages object to an array of messages sorted by timestamp
     * with format [{message : string, username : string, date : string}, ...]
     * @param {obj} messages contains all messages in the chat room
     * @param {string} user_id id of the user
     * @returns {Array} array of messages
     */
    const convert = (messages, user_id) => {
        let new_messages = Object.keys(messages).map((key) => messages[key]);
        new_messages.sort((a, b) => {
            if (a.timeStamp.seconds < b.timeStamp.seconds) {
                return -1;
            }
            else if (a.timeStamp.seconds === b.timeStamp.seconds) {
                return 0;
            }
            return 1;
        })

        new_messages = new_messages.map((obj) => convert_message(obj, user_id))

        return new_messages;
    }

    /**
     * converts a message object to the format the message component expects
     * @param {obj} message a message object {content, member_id, name}
     * @param {string} user_id name of the user
     */
    const convert_message = (message, user_id) => {
        return { text: message.content, username: message.name, isUser: message.member_id === user_id, time: convert_time(new Timestamp(message.timeStamp?.seconds, message.timeStamp?.nanoseconds)) };
    }

    /**
     * converts firebase timestamp to timestamp message bubbles expect
     * @param {timeStamp} timeStamp firebase timestamp
     */
    const convert_time = (timeStamp) => {
        const time = timeStamp.toDate();
        // Hours part from the timestamp
        var hours = time.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + time.getMinutes();
        // Seconds part from the timestamp
        var seconds = "0" + time.getSeconds();

        // Will display time in 10:30:23 format
        var formattedTime = hours + ':' + minutes.substring(minutes.length - 2) + ':' + seconds.substring(seconds.length - 2);
        return `${date.format(time, 'ddd, MMM DD YYYY')}, ${formattedTime}`;
    }

    console.log(convert(messages, user_id));
    return (
        <div className="messagesWrapper">
            <Messages messages={convert(messages, user_id)} />
        </div>
    )
}

export default MessagesWrapper;