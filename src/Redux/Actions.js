import * as actionTypes from "./ActionTypes";

export const setUser = user => {
  return {
    type: actionTypes.SET_USER,
    user
  };
};
