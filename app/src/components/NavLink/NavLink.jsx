import "./NavLink.css";

/**
 * 
 * Navigation link for the login page
 * 
 */
const NavLink = ({ text, active, set_active_index }) => {

    return (
        <div className={`navLink ${active ? 'navLink--active' : 'navLink--default'}`} onClick={() => set_active_index()}>
            <h2 className='navLink__text'>{text}</h2>
        </div>
    )
}

export default NavLink;