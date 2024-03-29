import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Slide,
  TextField
} from "@material-ui/core";
import Axios from "axios";
import { setFlightDetails } from "../redux/actions";
import { useDispatch } from "react-redux";
import "../styles/flight-service-dialog.scss";

const transition = React.forwardRef((props, ref) => {
  return <Slide direction="left" ref={ref} {...props} />;
});

const FlightServiceDialog = props => {
  const dispatch = useDispatch();
  const [data, setData] = useState(props.name);

  const handleSubmit = () => {
    if (props.action === "Add") {
      Axios.post(
        `${process.env.REACT_APP_BASE_URL}flights/${props.flightDetail._id}/services/${props.serviceName}`,
        { newValue: data }
      )
        .then(res => successfullResponse(res))
        .catch(err => errorResponse());
    } else if (props.action === "Update") {
      Axios.put(
        `${process.env.REACT_APP_BASE_URL}flights/${props.flightDetail._id}/services/${props.serviceName}`,
        { oldValue: props.name, newValue: data }
      )
        .then(res => successfullResponse(res))
        .catch(err => errorResponse());
    } else {
      Axios.delete(
        `${process.env.REACT_APP_BASE_URL}flights/${props.flightDetail._id}/services/${props.serviceName}/${props.name}`
      )
        .then(res => successfullResponse(res))
        .catch(err => errorResponse());
    }
  };

  const successfullResponse = res => {
    dispatch(setFlightDetails(res.data.data));
    props.hideServiceDialog();
    props.successCloseDialog(
      props.action === "Add"
        ? `Service ${props.action}ed.`
        : `Service ${props.action}d.`
    );
  };

  const errorResponse = () => {
    props.hideServiceDialog();
    props.errorCloseDialog();
  };

  const handleChange = event => {
    setData(event.target.value);
  };

  const addUpdateView = () => {
    return (
      <div className="flight-input-field">
        <TextField
          variant="outlined"
          size="small"
          onChange={handleChange}
          value={data}
        />
      </div>
    );
  };

  const deleteView = () => {
    return (
      <span>
        Are you sure? Deleting of item will also remove from passenger's service
        who has choosen this service.
      </span>
    );
  };

  const getTitle = () => {
    return props.serviceName === "ancilliaryServices"
      ? "ancilliary service"
      : props.serviceName === "shoppingItems"
      ? "shopping item"
      : props.serviceName === "meals"
      ? "meal service"
      : null;
  };

  return (
    <React.Fragment>
      <Dialog open={true} keepMounted TransitionComponent={transition}>
        <DialogTitle>{`${props.action} ${getTitle()} `}</DialogTitle>
        <DialogContent className="flight-service-dialog-content">
          {props.action === "Update" || props.action === "Add"
            ? addUpdateView()
            : props.action === "Delete"
            ? deleteView()
            : null}
        </DialogContent>
        <DialogActions>
          <div className="service-dialog-action-container">
            <div className="service-dialog-action-btn">
              <Button
                color="primary"
                onClick={props.hideServiceDialog}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                color="secondary"
                variant="outlined"
                className="submit-action-button"
                disabled={props.action !== "Delete" && props.name === data}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default FlightServiceDialog;
