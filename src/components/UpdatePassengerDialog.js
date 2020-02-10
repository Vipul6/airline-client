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
import "../styles/service-update-dialog.scss";
import { setFlightDetails } from "../redux/actions";
import { useDispatch } from "react-redux";

const transition = React.forwardRef((props, ref) => {
  return <Slide direction="down" ref={ref} {...props} />;
});

const UpdatePassengerDialog = props => {
  const dispatch = useDispatch();

  const [detail, setDetail] = useState("");
  const [initialDetail, setInitialDetail] = useState("");

  const [content, setContent] = useState({
    title: `Update ${props.passenger.name}'s details`,
    editView: false,
    key: null
  });

  const normalView = () => {
    return (
      <React.Fragment>
        <div className="service-container">
          <div className="service-content">
            <span className="services service-name">Name:</span>
            <span className="services">{props.passenger.name}</span>
          </div>
          <div className="action-button">
            <Button
              color="secondary"
              onClick={() => {
                setDetail(props.passenger.name);
                setInitialDetail(props.passenger.name);
                setContent({
                  title: "Update name",
                  editView: true,
                  key: "name"
                });
              }}
            >
              {props.passenger.name ? "Update" : "Add"}
            </Button>
          </div>
        </div>

        <div className="service-container">
          <div className="service-content">
            <span className="services service-name">Address:</span>
            <span className="services">{props.passenger.address}</span>
          </div>
          <div className="action-button">
            <Button
              color="secondary"
              onClick={() => {
                setDetail(props.passenger.address);
                setInitialDetail(props.passenger.address);
                setContent({
                  title: "Update address",
                  editView: true,
                  key: "address"
                });
              }}
            >
              {props.passenger.address ? "Update" : "Add"}
            </Button>
          </div>
        </div>

        <div className="service-container">
          <div className="service-content">
            <span className="services service-name">Passport number:</span>
            <span className="services">{props.passenger.passportNumber}</span>
          </div>
          <div className="action-button">
            <Button
              color="secondary"
              onClick={() => {
                setDetail(props.passenger.passportNumber);
                setInitialDetail(props.passenger.passportNumber);
                setContent({
                  title: "Update passport number",
                  editView: true,
                  key: "passportNumber"
                });
              }}
            >
              {props.passenger.passportNumber ? "Update" : "Add"}
            </Button>
          </div>
        </div>

        <div className="service-container">
          <div className="service-content">
            <span className="services service-name">Date of birth:</span>
            <span className="services">{props.passenger.dateOfBirth}</span>
          </div>
          <div className="action-button">
            <Button
              color="secondary"
              onClick={() => {
                setDetail(props.passenger.dateOfBirth);
                setInitialDetail(props.passenger.dateOfBirth);
                setContent({
                  title: "Update date of birth",
                  editView: true,
                  key: "dateOfBirth"
                });
              }}
            >
              {props.passenger.dateOfBirth ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  };

  const editView = () => {
    return (
      <React.Fragment>
        <TextField
          value={detail}
          variant="outlined"
          size="small"
          onChange={handleChange}
          helperText={content.key === "dateOfBirth" ? "DD/MM/YYYY" : null}
        />
      </React.Fragment>
    );
  };

  const handleChange = event => {
    setDetail(event.target.value);
  };

  const handleSubmit = () => {
    const passengerData = JSON.parse(JSON.stringify(props.passenger));
    passengerData[content.key] = detail;
    Axios.put(
      `${process.env.REACT_APP_BASE_URL}flights/${props.flightDetail._id}/passengers/${props.passenger._id}`,
      passengerData
    )
      .then(res => {
        dispatch(setFlightDetails(res.data.data));
        props.hideUpdateDialog();
        props.successCloseDialog("Passenger detail updated.");
      })
      .catch(err => {
        props.hideUpdateDialog();
        props.errorCloseDialog();
      });
  };

  return (
    <React.Fragment>
      <Dialog open={true} keepMounted TransitionComponent={transition}>
        <DialogTitle>{content.title}</DialogTitle>
        <DialogContent className="dialog-content">
          {content.editView ? editView() : normalView()}
        </DialogContent>
        <DialogActions>
          <div className="action-container">
            {content.editView ? (
              <div className="left-side-action">
                <Button
                  color="secondary"
                  onClick={() => {
                    setDetail("");
                    setInitialDetail("");
                    setContent({
                      editView: false,
                      title: `Update ${props.passenger.name}'s details`,
                      key: null
                    });
                  }}
                  variant="outlined"
                >
                  Back
                </Button>
              </div>
            ) : null}

            <div className="right-side-action">
              <Button
                color="primary"
                onClick={props.hideUpdateDialog}
                variant="outlined"
              >
                Cancel
              </Button>
              {content.editView ? (
                <Button
                  color="secondary"
                  variant="outlined"
                  className="submit-action-button"
                  disabled={detail === initialDetail}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              ) : null}
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default UpdatePassengerDialog;
