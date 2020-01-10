import * as actionTypes from "./ActionTypes";
import { combineReducers } from "redux";

const INITIAL_STATE = {
  user: null,
  isLoading: true
};

const userReducuer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
        isLoading: false
      };
    case actionTypes.CLEAR_USER:
      return {
        ...INITIAL_STATE,
        isLoading: false
      };
    default:
      return state;
  }
};

// channel reducer

const CHANNEL_INITIAL_STORE = {
  currentChannel: null,
  isPrivate: false
};

const channelReducer = (state = CHANNEL_INITIAL_STORE, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payLoad
      };
    case actionTypes.SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isPrivate: action.payload.isPrivate
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user: userReducuer,
  channel: channelReducer
});

export default rootReducer;
