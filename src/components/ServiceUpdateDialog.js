import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Slide,
  Checkbox,
  FormGroup,
  FormControlLabel
} from "@material-ui/core";
import Axios from "axios";
import "../styles/service-update-dialog.scss";
import { setFlightDetails } from "../redux/actions";
import { useDispatch } from "react-redux";

const transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ServiceUpdateDialog = props => {
  const dispatch = useDispatch();

  const [content, setContent] = useState({
    title: `${props.passenger.name}'s services`,
    editView: false,
    key: null
  });

  const [services, setServices] = useState([]);
  const [initialServices, setInitialServices] = useState([]);

  const normalView = () => {
    return (
      <React.Fragment>
        <div className="service-container">
          <div className="service-content">
            <span className="services service-name">Ancilliary services:</span>
            <span className="services">
              {props.passenger.ancilliaryServices.join(", ")}
            </span>
          </div>
          <div className="action-button">
            <Button
              color="secondary"
              onClick={() => {
                setServices(props.passenger.ancilliaryServices);
                setInitialServices(props.passenger.ancilliaryServices);
                setContent({
                  title: "Add / update ancilliary services",
                  editView: true,
                  key: "ancilliaryServices"
                });
              }}
            >
              Add / Update
            </Button>
          </div>
        </div>

        <div className="service-container">
          <div className="service-content">
            <span className="services service-name">Shopping items:</span>
            <span className="services">
              {props.passenger.shoppingItems.join(", ")}
            </span>
          </div>
          <div className="action-button">
            <Button
              color="secondary"
              onClick={() => {
                setServices(props.passenger.shoppingItems);
                setInitialServices(props.passenger.shoppingItems);
                setContent({
                  title: "Add / update  shopping items",
                  editView: true,
                  key: "shoppingItems"
                });
              }}
            >
              Add / Update
            </Button>
          </div>
        </div>

        <div className="service-container">
          <div className="service-content">
            <span className="services service-name">Meals:</span>
            <span className="services">{props.passenger.meals.join(", ")}</span>
          </div>
          <div className="action-button">
            <Button
              color="secondary"
              onClick={() => {
                setServices(props.passenger.meals);
                setInitialServices(props.passenger.meals);
                setContent({
                  title: "Add / update meals preference",
                  editView: true,
                  key: "meals"
                });
              }}
            >
              Add / Update
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  };

  const getCheckboxes = () => {
    return props.flightDetail[content.key].map(service => {
      return (
        <FormControlLabel
          key={service}
          control={
            <Checkbox
              color="primary"
              checked={services.includes(service)}
              onChange={event => updateService(service, event)}
            />
          }
          label={service}
        />
      );
    });
  };

  const updateService = (name, event) => {
    if (event.target.checked) {
      const values = JSON.parse(JSON.stringify(services));
      values.push(name);
      setServices(values);
    } else {
      const values = JSON.parse(JSON.stringify(services));
      const index = values.findIndex(service => service === name);
      if (index > -1) {
        values.splice(index, 1);
        setServices(values);
      }
    }
  };

  const editView = () => {
    return (
      <React.Fragment>
        <FormGroup>{getCheckboxes()}</FormGroup>
      </React.Fragment>
    );
  };

  const hasServiceChanged = () => {
    return (
      JSON.stringify(initialServices.sort()) === JSON.stringify(services.sort())
    );
  };

  const handleSubmit = () => {
    const passengerData = JSON.parse(JSON.stringify(props.passenger));
    passengerData[content.key] = services;
    Axios.put(
      `${process.env.REACT_APP_BASE_URL}flights/${props.flightDetail._id}/passengers/${props.passenger._id}`,
      passengerData
    )
      .then(res => {
        dispatch(setFlightDetails(res.data.data));
        props.hideServiceDialog();
        props.successCloseDialog("Services updated successfully.");
      })
      .catch(err => {
        props.hideServiceDialog();
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
                    setServices([]);
                    setInitialServices([]);
                    setContent({
                      editView: false,
                      title: `${props.passenger.name}'s services`,
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
                onClick={props.hideServiceDialog}
                variant="outlined"
              >
                Cancel
              </Button>
              {content.editView ? (
                <Button
                  color="secondary"
                  variant="outlined"
                  className="submit-action-button"
                  disabled={hasServiceChanged()}
                  onClick={() => handleSubmit()}
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

export default ServiceUpdateDialog;
