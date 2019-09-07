import axios from 'axios'
import { receiveProject } from './project_actions';

export const RECEIVE_PLEDGE = "RECEIVE_PLEDGE";

export const receivePledge = pledge => {
  return { type: RECEIVE_PLEDGE, pledge };
};

export const createPledge = pledge => dispatch => {
  return apiCreatePledge(pledge).then(
    project => {
      return dispatch(receiveProject(project.data));
    }
  );
};

const apiCreatePledge = pledge => {
  return axios({
    method: 'post',
    url: 'http://localhost:4000/api/pledges',
    data: { pledge }
  })
}
