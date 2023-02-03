import "./Messages.css";
import ChatBubble from "../ChatBubble/ChatBubble";
const Messages = ({ messages }) => {


    return (
        <div className="messages">
            {messages.map((msg, i) => <ChatBubble key={i} username={msg.username} isUser={msg.isUser} text={msg.text} time={msg.time} />)}
        </div>
    )
}

export default Messages;