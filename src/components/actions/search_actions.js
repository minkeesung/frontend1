import axios from 'axios'
export const RECEIVE_SEARCH_RESULTS = "RECEIVE_SEARCH_RESULTS";

export const receiveSearchResults = projects => {
  return { type: RECEIVE_SEARCH_RESULTS, projects };
};

export const fetchSearchResults = search => dispatch => {
  return apiFetchSearchResults(search).then(
    projects => dispatch(receiveSearchResults(projects.data))
  );
};

const apiFetchSearchResults = search => {
  return axios.get('http://localhost:4000/api/projects/search', {
    params: {search}})
}
