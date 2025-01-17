import { State } from "../interfaces/Interfaces";

const isDev = process.env.NODE_ENV === 'development';
const { DEV_PORT, API_BASE_URL } = require('../../../config.js');
let serverURL = API_BASE_URL;

//check if we're in dev mode
if (isDev) {
  serverURL = `http://localhost:${DEV_PORT}`;
}

export const getProjects = (): Promise<any> => {
  const projects = fetch(`${serverURL}/getProjects`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    // need credentials for userid pull from cookie
    credentials: 'include'
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(`Error getting project ${err}`));
  return projects;//returns an array of projects with _id, name, project
};

export const saveProject = (
  name: string,
  workspace: State
): Promise<Object> => {
  const newProject = { ...workspace}
  delete newProject._id;
  delete newProject.name; //deleting the _id from the current state slice. We don't actually want it in the project object in the mongo db document
  const body = JSON.stringify({
    name,
    project: { ...newProject},
    comments: []
  });
  const project = fetch(`${serverURL}/saveProject`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    credentials: 'include',
    body
  })
    .then((res) => res.json())
    .then((data) => {
      return {_id: data._id, name: data.name, published: data.published, ...data.project}; //passing up what is needed for the global appstateslice
    })
    .catch((err) => console.log(`Error saving project ${err}`));
  return project;//returns _id in addition to the project object from the document
};

export const publishProject = (
  name: string,
  workspace: State
): Promise<Object> => {
  const newProject = { ...workspace}
  delete newProject.name; 
  const body = JSON.stringify({
    _id: workspace._id, 
    name: name,
    project: { ...newProject},
    comments: [],
  });

  const response = fetch(`${serverURL}/publishProject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body
  });

  const publishedProject = response
    .then((res) => res.json())
    .then((data) => {
      return {_id: data._id, name: data.name, published:data.published, ...data.project};
    })
    .catch((err) => {
      console.log(`Error publishing project ${err}`);
      throw err;
    });

  return publishedProject;
};

export const unpublishProject = (
  projectData: State
): Promise<Object> => {
  const body = JSON.stringify({
    _id: projectData._id,
  });

  const response = fetch(`${serverURL}/unpublishProject`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body,
  });

  const unpublishedProject = response
    .then((res) => res.json())
    .then((data) => {
      return {_id: data._id, name: data.name, published:data.published, ...data.project};
    })
    .catch((err) => {
      console.log(`Error unpublishing project ${err}`);
      throw err;
    });

  return unpublishedProject;
};

export const deleteProject = (project: any): Promise<Object> => {
  const body = JSON.stringify({
    _id: project._id,
    // userId: window.localStorage.getItem('ssid')
  });
  const deletedProject = fetch(`${serverURL}/deleteProject`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body
  })
    .then((res) => res.json())
    .then((data) => { 
      return {_id: data._id, name: data.name, published:data.published, ...data.project};
    })
    .catch((err) => console.log(`Error deleting project ${err}`));
  return deletedProject;
};
