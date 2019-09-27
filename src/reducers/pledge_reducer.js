import { RECEIVE_PLEDGE } from '../actions/pledge_actions';

const pledgeReducer = (state = {}, action) => {
  Object.freeze(state)

  switch (action.type) {
    case RECEIVE_PLEDGE:
      return action.pledge;
    default:
      return state;
  }
};

export default pledgeReducer;
