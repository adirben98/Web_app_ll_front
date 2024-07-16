import axios, { InternalAxiosRequestConfig,CanceledError } from 'axios';
export {CanceledError}
const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
});

const authExcludedRoutes = ['/auth/login', '/auth/register','/auth/isEmailTaken','/auth/isUsernameTaken','auth/googleLogin'];
const isAuthExcludedRoute = (url:string) => {
  if (authExcludedRoutes.includes(url) || url.startsWith('file')) {
    return true;
  }
};

apiClient.interceptors.request.use(async (config): Promise<InternalAxiosRequestConfig<unknown>> => {
  if (isAuthExcludedRoute(config.url!)) {
    return config;
  }

  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    try {
      await axios.post('http://localhost:3000/auth/checkToken', {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
        signal: config.signal,
      });

     

      config.headers.Authorization = `Bearer ${accessToken}`;
    } catch (error) {

      if(error instanceof CanceledError ){
        console.log("Fetch canceled")
      }

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        window.location.href = '/login';
        return config;
      }

      try {
        const response = await axios.get('http://localhost:3000/auth/refresh',{ headers: { Authorization: `Bearer ${refreshToken}` },
          signal: config.signal,
        })

        if (response.status === 200) {
          console.log('Token refreshed');
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        } else {
          window.location.href = '/login';
        }
      } catch (err) {
        if(err instanceof CanceledError ){
          console.log("Fetch canceled")
        } else {
          window.location.href = '/login';
        }      }
    }
  } else {
    window.location.href = '/login';
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
