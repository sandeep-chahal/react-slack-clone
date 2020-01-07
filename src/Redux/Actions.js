import * as actionTypes from "./ActionTypes";

export const setUser = user => {
  return {
    type: actionTypes.SET_USER,
    user
  };
};
export const clearUser = () => {
  return {
    type: actionTypes.CLEAR_USER
  };
};

// channel actions

export const setCurrentChannel = channel => {
  return {
    type: actionTypes.SET_CURRENT_CHANNEL,
    payLoad: channel
  };
};
