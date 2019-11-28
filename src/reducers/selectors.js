import { values } from 'lodash';

export const selectAllProjects = ({projects}) => {
  return values(projects);
};

export const selectAllCategories = ({categories}) => {
  // puts all the values of the object into an array
  return values(categories);
};
