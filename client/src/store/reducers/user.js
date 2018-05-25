import { GET_USERS } from "../actions/constants";

const userReducer = (state = [], { type, payload }) => {
  switch (type) {
    case GET_USERS:
      return payload;
    default:
      return state;
  }
};

export default userReducer;
