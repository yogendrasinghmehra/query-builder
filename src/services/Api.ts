import http from "./HTTPCommon";

const ApiEndpoints = {
  getAll: () => {
    return http.get("/todos");
  },

  get: (url:string) => {
    return http.get(url);
  }
};

export default ApiEndpoints;
