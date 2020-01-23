const flightDetails = (state = [], action) => {
  switch (action.type) {
    case "GETFLIGHTDETAILS":
      return action.payload;
    default:
      return state;
  }
};

export default flightDetails;
