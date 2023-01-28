import NavLink from "../NavLink/NavLink";
import "./Navigation.css";

/**
 * Navigation UI for the login page
 * allows users to choose between showing a join-a-room and create-a-room forms.
 */
const Navigation = ({ links, active_index, set_active_index }) => {

    return (
        <div className="navigation">
            {links.map((text, i) => <NavLink key={i} text={text} active={i === active_index} set_active_index={() => set_active_index(i)} />)}
        </div>
    )
}

export default Navigation;