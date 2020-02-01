import React, { Component } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import Spinner from "./Spinner";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";
import Snackbar from "./Snackbar";
import "../styles/flight.scss";

class Flight extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      flightsDetail: [],
      showSnackbar: false,
      expandedId: null
    };
  }
  componentDidMount() {
    const routeParams = this.props.match.path;

    if (routeParams === "/flight") {
      this.props.updateActiveLink("flight");
    }
    if (!this.props.flightDetails.length) {
      Axios.get(`${process.env.REACT_APP_BASE_URL}flights/details`)
        .then(res => {
          this.props.getFlightDetails(res.data.data);
          this.setState({
            flightsDetail: res.data.data,
            isLoaded: true
          });
        })
        .catch(err => {
          this.setState({
            isLoaded: true,
            showSnackbar: true,
            snackbar: (
              <Snackbar
                message="Server is down, Please try again after sometime."
                hideSnackbar={this.hideSnackbar}
              />
            )
          });
        });
    } else {
      this.setState({
        flightsDetail: this.props.flightDetails,
        isLoaded: true
      });
    }
  }

  checkAuthorization = () => {
    const id = sessionStorage.getItem("id");
    if (!id) {
      this.setState({
        showSnackbar: true,
        snackbar: (
          <Snackbar
            message="Please login first."
            hideSnackbar={this.hideSnackbar}
          />
        )
      });
    }
  };

  updateExpansion = id => {
    if (this.state.expandedId && this.state.expandedId === id) {
      this.setState({
        expandedId: null
      });
    } else {
      this.setState({
        expandedId: id
      });
    }
  };

  getCardsData() {
    return this.state.flightsDetail.map(data => {
      return (
        <Card key={data.id} className="card-view">
          <CardContent
            className="material-card-content"
            onClick={() => this.updateExpansion(data.id)}
          >
            <div className="card-content-container">
              <div className="card-content">
                <p>Source: {data.source} </p>
                <p>Destination: {data.destination}</p>
              </div>

              <div className="svg-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className={
                    this.state.expandedId === data.id
                      ? "expanded"
                      : "expand-more"
                  }
                  width="25"
                  height="25"
                >
                  <path d="M 16.59 8.59 L 12 13.17 L 7.41 8.59 L 6 10 l 6 6 l 6 -6 Z" />
                </svg>
              </div>
            </div>
          </CardContent>

          <Collapse
            in={this.state.expandedId === data.id}
            timeout="auto"
            unmountOnExit
          >
            <CardContent>
              <div className="accordion-container">
                <div className="accordion-action-btn">
                  <Button
                    onClick={() => this.checkAuthorization()}
                    variant="outlined"
                    color="primary"
                  >
                    Check in
                  </Button>
                  <Button
                    onClick={() => this.checkAuthorization()}
                    variant="outlined"
                    color="secondary"
                  >
                    In flight
                  </Button>
                </div>
              </div>
            </CardContent>
          </Collapse>
        </Card>
      );
    });
  }

  hideSnackbar = () => {
    this.setState({
      showSnackbar: false
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
        ) : (
          <div className="flight-details">{this.getCardsData()} </div>
        )}
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
    getFlightDetails: details =>
      dispatch({ type: "GETFLIGHTDETAILS", payload: details })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Flight);
