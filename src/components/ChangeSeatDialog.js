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

const transition = React.forwardRef((props, ref) => {
  return <Slide direction="right" ref={ref} {...props} />;
});

const ChangeSeatDialog = props => {
  const [seat, setSeat] = useState("");

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
          <Button color="primary" onClick={props.hideDialog}>
            Cancel
          </Button>
          <Button color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default ChangeSeatDialog;
