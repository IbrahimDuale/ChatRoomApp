import "./ErrorText.css";

const ErrorText = ({ flag, text }) => {

    return (
        <div className={`error__text ${!flag && "error__text--hide"}`}>
            <p>{text}</p>
        </div>
    )
}

export default ErrorText;