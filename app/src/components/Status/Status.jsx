import "./Status.css";
import { HiOutlineStatusOnline, HiOutlineStatusOffline } from "react-icons/hi";

const Status = ({ online }) => {

    return (
        <div className="status">
            {online ?
                (<div className="status--online"><HiOutlineStatusOnline className="status__icon" /></div>) :
                (<div className="status--offline"><HiOutlineStatusOffline className="status__icon" /></div>)}
        </div>
    )
}

export default Status;