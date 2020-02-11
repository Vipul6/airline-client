import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Slide,
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  Select,
  MenuItem
} from "@material-ui/core";
import Axios from "axios";
import { setFlightDetails } from "../redux/actions";
import { useDispatch } from "react-redux";
import "../styles/add-passenger-dialog.scss";

const transition = React.forwardRef((props, ref) => {
  return <Slide direction="right" ref={ref} {...props} />;
});

const AddPassengerDialog = props => {
  const dispatch = useDispatch();

  const [user, setUser] = useState({
    _id: props.flightDetail.passengersDetail.length + 1,
    ancilliaryServices: [],
    meals: [],
    shoppingItems: [],
    name: "",
    dateOfBirth: "",
    seatNumber: "",
    isCheckedIn: false,
    hasInfant: false,
    isWheelChairRequired: false,
    passportNumber: "",
    address: ""
  });

  const handleChange = event => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleRadioChange = event => {
    setUser({ ...user, [event.target.name]: JSON.parse(event.target.value) });
  };

  const handleCheckboxChange = (name, service, event) => {
    if (event.target.checked) {
      const services = JSON.parse(JSON.stringify(user[name]));
      services.push(service);
      setUser({ ...user, [name]: services });
    } else {
      const services = JSON.parse(JSON.stringify(user[name]));
      const index = services.findIndex(item => item === service);
      services.splice(index, 1);
      setUser({ ...user, [name]: services });
    }
  };

  const handleSubmit = () => {
    Axios.post(
      `${process.env.REACT_APP_BASE_URL}flights/${props.flightDetail._id}/passengers`,
      user
    )
      .then(res => {
        dispatch(setFlightDetails(res.data.data));
        props.hideAddDialog();
        props.successCloseDialog("New passenger added.");
      })
      .catch(err => {
        props.hideAddDialog();
        props.errorCloseDialog();
      });
  };

  const getCheckboxes = key => {
    return props.flightDetail[key].map(service => {
      return (
        <FormControlLabel
          key={service}
          control={
            <Checkbox
              color="primary"
              onChange={event => handleCheckboxChange(key, service, event)}
            />
          }
          label={service}
        />
      );
    });
  };

  const getDropdownList = () => {
    const seats = props.flightDetail.seatsDetail.filter(
      seatList => !seatList.isOccupied
    );
    return seats.map(seatList => {
      return (
        <MenuItem key={seatList.number} value={seatList.number}>
          {seatList.number}
        </MenuItem>
      );
    });
  };

  const getSeatStatus = () => {
    return props.flightDetail.seatsDetail.filter(
      seatList => !seatList.isOccupied
    ).length
      ? false
      : true;
  };

  const getView = () => {
    return (
      <div className="add-passenger-container">
        <div className="detail-input-field">
          <TextField
            variant="outlined"
            size="small"
            name="name"
            label="Name"
            onChange={handleChange}
          />
        </div>

        <div className="detail-input-field">
          <TextField
            variant="outlined"
            size="small"
            name="address"
            label="Address"
            onChange={handleChange}
          />
        </div>

        <div className="detail-input-field">
          <TextField
            variant="outlined"
            size="small"
            name="dateOfBirth"
            label="Date of birth"
            helperText="DD/MM/YYYY"
            onChange={handleChange}
          />
        </div>

        <div className="detail-input-field">
          <TextField
            variant="outlined"
            size="small"
            name="passportNumber"
            label="Passport number"
            onChange={handleChange}
          />
        </div>

        <div className="select-input-field">
          Select seat:
          <div>
            <FormControl>
              <Select
                variant="outlined"
                onChange={handleChange}
                className="material-select"
                name="seatNumber"
                value={user.seatNumber}
                disabled={getSeatStatus()}
              >
                {getDropdownList()}
              </Select>
              {getSeatStatus() ? (
                <span className="seat-error">No seats are available.</span>
              ) : null}
            </FormControl>
          </div>
        </div>

        <div className="check-in-radio-button">
          <FormControl>
            <FormLabel>Check-in status</FormLabel>
            <RadioGroup
              onChange={handleRadioChange}
              name="isCheckedIn"
              value={user.isCheckedIn}
              row
            >
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
        </div>

        <div className="infant-radio-button">
          <FormControl>
            <FormLabel>Infant status</FormLabel>
            <RadioGroup
              onChange={handleRadioChange}
              name="hasInfant"
              value={user.hasInfant}
              row
            >
              <FormControlLabel value={true} control={<Radio />} label="Yes" />
              <FormControlLabel value={false} control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </div>

        <div className="wheel-radio-button">
          <FormControl>
            <FormLabel>Wheel chair status</FormLabel>
            <RadioGroup
              onChange={handleRadioChange}
              name="isWheelChairRequired"
              value={user.isWheelChairRequired}
              row
            >
              <FormControlLabel value={true} control={<Radio />} label="Yes" />
              <FormControlLabel value={false} control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </div>

        <div className="checkbox-group">
          Ancilliary services: {getCheckboxes("ancilliaryServices")}
        </div>

        <div className="checkbox-group">Meals: {getCheckboxes("meals")}</div>

        <div className="checkbox-group">
          Shopping items: {getCheckboxes("shoppingItems")}
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      <Dialog open={true} keepMounted TransitionComponent={transition}>
        <DialogTitle>Add passenger</DialogTitle>
        <DialogContent className="dialog-content">{getView()}</DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={props.hideAddDialog}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button color="secondary" onClick={handleSubmit} variant="outlined">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AddPassengerDialog;
