import "./Button.css";

const Button = ({ onClick, text }) => {

    return (
        <button className="buttom" onClick={() => onClick()}>{text}</button>
    )
}

export default Button;