import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Slide,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@material-ui/core";
import "../styles/seat-dialog.scss";
import Axios from "axios";
import { setFlightDetails } from "../redux/actions";
import { useDispatch } from "react-redux";

const transition = React.forwardRef((props, ref) => {
  return <Slide direction="right" ref={ref} {...props} />;
});

const ChangeSeatDialog = props => {
  const [seat, setSeat] = useState("");

  const dispatch = useDispatch();

  const handleChange = event => {
    setSeat(event.target.value);
  };

  const getDropdownList = () => {
    const seats = props.seatsDetail.filter(seatList => !seatList.isOccupied);
    return seats.map(seatList => {
      return (
        <MenuItem key={seatList.number} value={seatList.number}>
          {seatList.number}
        </MenuItem>
      );
    });
  };

  const handleSeatSubmit = () => {
    Axios.get(
      `${process.env.REACT_APP_BASE_URL}flights/${props.flightDetail._id}/change-seat/${props.passenger._id}/${seat}`
    )
      .then(res => {
        dispatch(setFlightDetails(res.data.data));
        props.hideFilters();
        props.hideDialog();
        props.successCloseDialog("Seat changed successfully.");
      })
      .catch(err => {
        props.hideFilters();
        props.hideDialog();
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
        <DialogTitle>
          {props.passenger.seatNumber ? "Change seat" : "Allocate seat"}
        </DialogTitle>
        <DialogContent className="dialog-content">
          <InputLabel>Select seat</InputLabel>
          <FormControl>
            <Select
              variant="outlined"
              value={seat}
              onChange={handleChange}
              className="material-select"
            >
              <MenuItem value="" disabled>
                <em>None</em>
              </MenuItem>
              {getDropdownList()}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={props.hideDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            color="secondary"
            onClick={handleSeatSubmit}
            disabled={!seat}
            variant="outlined"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default ChangeSeatDialog;
