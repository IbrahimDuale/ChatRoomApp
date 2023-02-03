import "./Members.css";

const Members = ({ members }) => {
    return (
        <div className={"members"}>
            <div className="members__scrollableContainer">
                {members.map((member, i) => <p className="member__text" key={member.id}>{member.name}</p>)}
            </div>
        </div>
    )
}

export default Members;