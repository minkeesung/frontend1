import axios from 'axios'
import { receiveErrors } from './error_actions';

export const RECEIVE_PROJECTS = "RECEIVE_PROJECTS";
export const RECEIVE_PROJECT = "RECEIVE_PROJECT";
export const REMOVE_PROJECT = "REMOVE_PROJECT";
export const EDIT_PROJECT = "EDIT_PROJECT";

const receiveProjects = projects => {
  return { type: RECEIVE_PROJECTS, projects };
};

export const receiveProject = ({project, rewards}) => {
  return { type: RECEIVE_PROJECT, project, rewards };
};

export const removeProject = project => {
  return { type: REMOVE_PROJECT, project };
};

export const editProject = ({project, rewards}) => {
  return { type: EDIT_PROJECT, project, rewards };
};

export const fetchProjects = () => dispatch => {
  return apiFetchProjects().then(
    res => dispatch(receiveProjects(res.data)),
    err => dispatch(receiveErrors(err.response.data))
  )
};

export const fetchProject = id => dispatch => {
  return apiFetchProject(id).then(
    res => dispatch(receiveProject(res.data)),
    err => dispatch(receiveErrors(err.response.data))
  )
}

export const createProject = formData => dispatch => {
  return apiCreateProject(formData).then(
    payload => dispatch(receiveProject(payload.data)),
    err => {
      return dispatch(receiveErrors(err.response.data))
    }
  )
}

export const updateProject = (id, project) => dispatch => {
  return apiUpdateProject(id, project).then(
    payload => dispatch(receiveProject(payload.data)),
    err => {
      return dispatch(receiveErrors(err.response.data))
    }
  )
}

export const deleteProject = id => dispatch => {
  return apiDeleteProject(id).then(
    project => dispatch(removeProject(project.data)),
    err => dispatch(receiveErrors(err.response.data))
  );
};

const apiFetchProjects = () => axios.get('http://localhost:4000/api/projects')

const apiFetchProject = id => axios.get(`http://localhost:4000/api/projects/${id}`)

const apiCreateProject = formData => {
  return axios({
    method: 'post',
    url: 'http://localhost:4000/api/projects',
    data: formData
  })
}

const apiUpdateProject = (id, formData) => {
  return axios({
    method: 'patch',
    url: `http://localhost:4000/api/projects/${id}`,
    data: formData
  })
}

const apiDeleteProject = id => axios.delete(`http://localhost:4000/api/projects/${id}`)
