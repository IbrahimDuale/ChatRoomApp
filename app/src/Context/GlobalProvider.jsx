import { createContext } from "react"
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
    /**
     * Returns true if there is a room with ${room_id}.
     * @param {string} room_id Id of the room
     * @returns {Boolean} 
     */
    const room_exists = async (room_id) => {
        const docRef = doc(db, "room_names", room_id);
        const docSnap = await getDoc(docRef);

        return docSnap.exists();
    }

    return (
        <GlobalContext.Provider value={{ room_exists }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;
export { GlobalContext };