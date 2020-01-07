import * as actionTypes from "./ActionTypes";
import { combineReducers } from "redux";

const INITIAL_STATE = {
  user: null,
  loading: true
};

const userReducuer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
        loading: false
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user: userReducuer
});

export default rootReducer;
