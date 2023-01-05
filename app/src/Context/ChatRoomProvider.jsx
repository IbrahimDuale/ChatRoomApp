import { createContext } from "react"


const ChatRoomContext = createContext();

const ChatRoomProvider = ({ children }) => {

    return (
        <ChatRoomContext.Provider value={{}}>
            {children}
        </ChatRoomContext.Provider>
    )
}

export default ChatRoomProvider;
export { ChatRoomContext };