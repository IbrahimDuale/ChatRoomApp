import Members from "../Members/Members";
import "./MembersWrapper.css";

/**
 * converts the parameters to the one's the members component expects
 */
const MembersWrapper = ({ members }) => {

    /**
     * Converts the members object to an array
     * @param {obj} members object containing member's names and id's
     * @return {Array} array of members
     */
    const convert_members = (members) => {
        return Object.keys(members).map((key) => Object.create({ name: members[key].name, id: members[key].id }));
    }

    return (
        <div className="membersWrapper">
            <Members members={convert_members(members)} />
        </div>
    )
}

export default MembersWrapper;