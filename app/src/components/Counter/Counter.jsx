import "./Counter.css";

const Counter = ({ count, maxCount, show }) => {

    return (
        <div className={`counter ${!show && "counter--hidden"}`}>
            <p className="counter__count">{count}</p>
            <p className="counter__maxCount">{maxCount}</p>
        </div>
    )
}

export default Counter;