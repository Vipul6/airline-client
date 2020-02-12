import React, { Component } from "react";
import Axios from "axios";
import Snackbar from "./Snackbar";
import { connect } from "react-redux";
import Spinner from "./Spinner";
import "../styles/manage-services.scss";
import { Button, Card } from "@material-ui/core";
import FlightServiceDialog from "./FlightServiceDialog";

class ManageServices extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      showSnackbar: false,
      flightsDetail: [],
      flightId: null,
      showServiceDialog: false
    };
  }

  componentDidMount() {
    const routeParams = this.props.match.path;

    if (routeParams.includes("flights")) {
      this.props.updateActiveLink("flights");
    }

    if (!this.props.flightDetails.length) {
      Axios.get(`${process.env.REACT_APP_BASE_URL}flights/details`)
        .then(res => {
          this.props.setFlightDetails(res.data.data);
          this.setState(
            {
              flightsDetail: res.data.data,
              isLoaded: true,
              flightId: this.props.match.params.flightId
            },
            () => this.checkValidFlightId()
          );
        })
        .catch(err => {
          this.setSnackbarMessage(
            "Server is down, Please try again after sometime."
          );
        });
    } else {
      this.setState(
        {
          flightsDetail: this.props.flightDetails,
          isLoaded: true,
          flightId: this.props.match.params.flightId
        },
        () => this.checkValidFlightId()
      );
    }
  }

  getFlightIndex = () => {
    return this.state.flightsDetail.findIndex(
      flight => flight._id.toString() === this.state.flightId
    );
  };

  checkValidFlightId = () => {
    const index = this.getFlightIndex();
    if (index < 0) {
      this.setSnackbarMessage("Invalid action");
      setTimeout(() => {
        this.props.history.push("/flights");
      }, 1500);
    }
  };

  setSnackbarMessage = msg => {
    this.setState({
      showSnackbar: true,
      isLoaded: true,
      snackbar: <Snackbar message={msg} hideSnackbar={this.hideSnackbar} />
    });
  };

  hideServiceDialog = () => {
    this.setState({
      showServiceDialog: false,
      flightsDetail: this.props.flightDetails
    });
  };

  hideSnackbar = () => {
    this.setState({
      showSnackbar: false
    });
  };

  errorCloseDialog = () => {
    this.setState({
      showUpdateDialog: false,
      showSnackbar: true,
      isLoaded: true,
      snackbar: (
        <Snackbar
          message={"Something went wrong. Please try again."}
          hideSnackbar={this.hideSnackbar}
        />
      )
    });
  };

  successCloseDialog = msg => {
    this.setState({
      showSnackbar: true,
      isLoaded: true,
      snackbar: (
        <Snackbar
          message={msg}
          alertType="success"
          hideSnackbar={this.hideSnackbar}
        />
      )
    });
  };

  showServiceDialog = (serviceName, action, name) => {
    this.setState({
      showServiceDialog: true,
      serviceDialogContent: (
        <FlightServiceDialog
          flightDetail={this.state.flightsDetail[this.getFlightIndex()]}
          errorCloseDialog={this.errorCloseDialog}
          successCloseDialog={this.successCloseDialog}
          hideServiceDialog={this.hideServiceDialog}
          serviceName={serviceName}
          action={action}
          name={name}
        />
      )
    });
  };

  showServices = serviceName => {
    const index = this.getFlightIndex();
    return this.state.flightsDetail[index][serviceName].map((service, idx) => {
      return (
        <div key={service} className="service-content">
          <div className="service-display">
            <span>{idx + 1}.</span>
            <span className="service-name">{service}</span>
          </div>
          <div className="service-display-action">
            <span className="service-action-btn">
              <Button
                color="primary"
                onClick={() =>
                  this.showServiceDialog(serviceName, "Update", service)
                }
              >
                Update
              </Button>
              <Button
                color="secondary"
                onClick={() =>
                  this.showServiceDialog(serviceName, "Delete", service)
                }
              >
                Delete
              </Button>
            </span>
          </div>
        </div>
      );
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="snackbar-alignment">
          {this.state.showSnackbar ? this.state.snackbar : null}
        </div>
        {!this.state.isLoaded ? (
          <Spinner />
        ) : this.state.flightsDetail.length ? (
          <div className="manage-services-container">
            <Card className="flight-card">
              <div className="ancilliary-services-wrapper">
                <span className="service-title">Ancilliary services</span>
                {this.showServices("ancilliaryServices")}
                <div>
                  <Button
                    className="add-service-btn"
                    onClick={() =>
                      this.showServiceDialog("ancilliaryServices", "Add", "")
                    }
                  >
                    Add more
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="flight-card">
              <div className="shopping-services-wrapper">
                <span className="service-title">Shopping items</span>
                {this.showServices("shoppingItems")}
                <div>
                  <Button
                    className="add-service-btn"
                    onClick={() =>
                      this.showServiceDialog("shoppingItems", "Add", "")
                    }
                  >
                    Add more
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="flight-card">
              <div className="meals-services-wrapper">
                <span className="service-title">Meals</span>
                {this.showServices("meals")}
                <div>
                  <Button
                    className="add-service-btn"
                    onClick={() => this.showServiceDialog("meals", "Add", "")}
                  >
                    Add more
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ) : null}
        <React.Fragment>
          {this.state.showServiceDialog
            ? this.state.serviceDialogContent
            : null}
        </React.Fragment>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { flightDetails } = state;
  return { flightDetails };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setFlightDetails: details =>
      dispatch({ type: "SETFLIGHTDETAILS", payload: details })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageServices);
