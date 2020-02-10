const userDetails = (state = null, action) => {
  switch (action.type) {
    case "SETUSERDETAILS":
      return action.payload;
    default:
      return state;
  }
};

export default userDetails;
