import {
  GET_ALL_STOCKS,
  GET_ONE_STOCK,
  DELETE_STOCK,
} from "../actions/constants";

const defaultState = [];

const userReducer = (state = defaultState, { type, payload }) => {
  switch (type) {
    case GET_ALL_STOCKS:
    case GET_ONE_STOCK:
    case DELETE_STOCK:
      return payload;
    default:
      return state;
  }
};

export default userReducer;
