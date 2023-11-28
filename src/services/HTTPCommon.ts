import axios from "axios";

const api =  axios.create({
  baseURL: "http://localhost:62400",
  headers: {
    "Content-type": "application/json"
  }
});

api.interceptors.request.use(function (config) {

  // spinning start to show
  // UPDATE: Add this code to show global loading indicator
  const loader:HTMLElement|null = document.getElementById('loader_div');
  if(loader)
  {
    loader.classList.remove('d-none');
  }
  const token = window.localStorage.token;
  if (token) {
     config.headers.Authorization = `token ${token}`
  }
  return config
}, function (error) {
  return Promise.reject(error);
});

api.interceptors.response.use(function (response) {

  // spinning hide
  // UPDATE: Add this code to hide global loading indicator
  const loader:HTMLElement|null = document.getElementById('loader_div');
  if(loader)
  {
    loader.classList.add('d-none');
  }

  return response;
}, function (error) {
  return Promise.reject(error);
});

// Export the api instance
export default api;