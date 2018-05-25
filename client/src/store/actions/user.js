import { GET_USERS } from "./constants";

export const getUsers = () => dispatch => {
  return fetch("/api/users")
    .then(res => res.json())
    .then(users => dispatch({ type: GET_USERS, payload: users }));
};
