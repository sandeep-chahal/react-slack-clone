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

export const setPrivateChannel = isPrivate => {
  return {
    type: actionTypes.SET_PRIVATE_CHANNEL,
    payload: {
      isPrivate
    }
  };
};
