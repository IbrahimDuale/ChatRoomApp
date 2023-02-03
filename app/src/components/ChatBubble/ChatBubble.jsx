import React from 'react';
import './ChatBubble.css';

const ChatBubble = ({ text, username, time, isUser }) => {
    const containerClassName = isUser ? 'chatBubble chatBubble--right' : 'chatBubble chatBubble--left';
    const contentClassName = isUser ? 'chatBubble__content chatBubble__content--blue' : 'chatBubble__content chatBubble__content--green'
    return (
        <div className={containerClassName}>
            <div className={contentClassName}>
                {!isUser && <p className="chatBubble__username">{username}</p>}
                <p className="chatBubble__text">{text}</p>
                <p className="chatBubble__time">{time}</p>
            </div>
        </div>
    );
};

export default ChatBubble;