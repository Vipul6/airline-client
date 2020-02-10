import { combineReducers } from "redux";
import flightDetails from "./flight-details.reducer";
import userDetails from "./user-details.reducer";

const rootReducer = combineReducers({ flightDetails, userDetails });

export default rootReducer;
