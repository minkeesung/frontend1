import axios from 'axios'
import { receiveErrors } from './error_actions'

export const RECEIVE_CURRENT_USER = "RECEIVE_CURRENT_USER";
export const LOGOUT = "LOGOUT"

export const receiveCurrentUser = currentUser => ({
  type: RECEIVE_CURRENT_USER,
  currentUser
});

export const signup = user => dispatch => (
  apiSignup(user)
    .then(user => dispatch(receiveCurrentUser(user.data)),
      err => dispatch(receiveErrors(err.responseJSON)))
);

export const login = user => dispatch => (
  apiLogin(user)
    .then(user => dispatch(receiveCurrentUser(user.data)),
      err => dispatch(receiveErrors(err.responseJSON)))
);

export const logout = user => dispatch => (
  apiLogout(user).then(user => dispatch(receiveCurrentUser(null)))
);


const apiSignup = user => {
  return axios({
    method: 'post',
    url: 'http://localhost:4000/api/users',
    data: {user}
  })
}


const apiLogin = user => {
  return axios({
    method: 'post',
    url: 'http://localhost:4000/api/session',
    data: {user}
  });
};

const apiLogout = user => {
  return axios({
    method: 'delete',
    url: 'http://localhost:4000/api/session',
    data: {user}
  });
};
