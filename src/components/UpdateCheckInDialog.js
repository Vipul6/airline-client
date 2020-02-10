import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Slide,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio
} from "@material-ui/core";
import "../styles/check-in-dialog.scss";
import Axios from "axios";
import { setFlightDetails } from "../redux/actions";
import { useDispatch } from "react-redux";

const transition = React.forwardRef((props, ref) => {
  return <Slide direction="left" ref={ref} {...props} />;
});

const UpdateCheckInDialog = props => {
  const [checkin, setCheckin] = useState(props.passenger.isCheckedIn);
  const dispatch = useDispatch();

  const handleChange = event => {
    setCheckin(JSON.parse(event.target.value));
  };

  const handleCheckInSubmit = () => {
    const passengerData = props.passenger;
    passengerData.isCheckedIn = checkin;
    Axios.put(
      `${process.env.REACT_APP_BASE_URL}flights/${props.flightDetail._id}/passengers/${props.passenger._id}`,
      passengerData
    )
      .then(res => {
        dispatch(setFlightDetails(res.data.data));
        props.hideFilters();
        props.hideCheckinDialog();
        props.successCloseDialog("Check-in status updated.");
      })
      .catch(err => {
        props.hideFilters();
        props.hideCheckinDialog();
        props.errorCloseDialog();
      });
  };

  return (
    <React.Fragment>
      <Dialog
        open={true}
        keepMounted
        TransitionComponent={transition}
        className="dialog-container"
      >
        <DialogTitle>{"Update check-in status"}</DialogTitle>
        <DialogContent className="check-in-dialog-content">
          <div className="user-container">
            <span className="name-field-label">Occupied by: </span>
            <span className="name-field">{props.passenger.name}</span>
          </div>
          <FormControl>
            <FormLabel>Check-in status</FormLabel>
            <RadioGroup value={checkin} onChange={handleChange}>
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="Check-in"
              />
              <FormControlLabel
                value={true}
                control={<Radio />}
                label="Checked-in"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={props.hideCheckinDialog}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            color="secondary"
            onClick={handleCheckInSubmit}
            variant="outlined"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default UpdateCheckInDialog;
