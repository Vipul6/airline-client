import React, { Component } from "react";
import Axios from "axios";
class Home extends Component {
  componentDidMount() {
    Axios.get(`${process.env.REACT_APP_BASE_URL}flights/details`)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }
  render() {
    return <div>Yos</div>;
  }
}

export default Home;
