import axios from 'axios';


const createApiClient = (token:string) => {
  return axios.create({
    baseURL: "http://localhost:3000",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default createApiClient;
