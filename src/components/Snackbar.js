import React, { useState, useEffect } from "react";
import "../styles/snackbar.scss";

const Snackbar = props => {
  const [show, updateShow] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      updateShow(false);
    }, 4000);
  }, []);

  return (
    <React.Fragment>
      {show ? (
        <div className="snackbar-container">
          <div
            className={
              props.alertType === "success"
                ? "message-container type-success"
                : "message-container type-failure"
            }
          >
            <span className="message">{props.message}</span>
            <span className="cross" onClick={() => updateShow(false)}>
              X
            </span>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default Snackbar;
