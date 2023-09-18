import http from "./HTTPCommon";

const ApiEndpoints = {
  getAll: () => {
    return http.get("/todos");
  },

  get: (id: string) => {
    return http.get(`/todo/${id}`);
  }
};

export default ApiEndpoints;
