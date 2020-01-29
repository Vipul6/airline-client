import React, { useEffect } from "react";
import "../styles/snackbar.scss";

const Snackbar = props => {
  const { hideSnackbar } = props;
  let timerId;

  const timer = () =>
    (timerId = setTimeout(() => {
      hideSnackbar();
    }, 4000));

  // It will act as componentDidMount
  useEffect(() => {
    timer();
    return;
  });

  // It will act as componentWillUnmount
  useEffect(() => {
    return () => {
      clearTimeout(timerId);
    };
  });

  return (
    <React.Fragment>
      <div className="snackbar-container">
        <div
          className={
            props.alertType === "success"
              ? "message-container type-success"
              : "message-container type-failure"
          }
        >
          <span className="message">{props.message}</span>
          <span className="cross" onClick={() => hideSnackbar()}>
            X
          </span>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Snackbar;
