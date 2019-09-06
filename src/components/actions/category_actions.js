import { receiveErrors } from './error_actions'
import axios from 'axios'

export const RECEIVE_CATEGORIES = "RECEIVE_CATEGORIES"
export const RECEIVE_CATEGORY_PROJECTS = "RECEIVE_CATEGORY_PROJECTS"

const receiveCategories = categories => {
  return { type: RECEIVE_CATEGORIES, categories };
};

const receiveCategoryProjects = ({category}) => {
  return { type: RECEIVE_CATEGORY_PROJECTS, category};
};

export const fetchCategories = () => dispatch => {
  return apiFetchCategories().then(
    categories => dispatch(receiveCategories(categories.data)),
    err => dispatch(receiveErrors(err.response.data))
  )
}

export const fetchCategoryProjects = id => dispatch => {
  return apiFetchCategoryProjects(id).then(
    payload => dispatch(receiveCategoryProjects(payload.data)),
    err => dispatch(receiveErrors(err.response.data))
  )
}

const apiFetchCategories = () => axios.get('http://localhost:4000/api/categories')

const apiFetchCategoryProjects = id => axios.get(`http://localhost:4000/api/categories/${id}`)
