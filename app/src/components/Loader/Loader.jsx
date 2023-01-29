import { useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import "./Loader.css";

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

const Loader = ({ isLoading, component }) => {
    let [color,] = useState("#000");

    return (
        <>
            {isLoading ?
                (
                    <BeatLoader
                        color={color}
                        loading={isLoading}
                        cssOverride={override}
                        size={10}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                ) :
                (component)
            }
        </>
    )
}

export default Loader;