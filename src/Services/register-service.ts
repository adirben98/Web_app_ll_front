import apiClient from "../Services/api-client";

export interface IUser {
  email: string;
  imgUrl: string;
  username: string;
  password: string;
  accessToken?: string;
  refreshToken?: string;
}
export const setLocalStorage = (data: IUser) => {
  localStorage.setItem("email", data.email);
  localStorage.setItem("username", data.username);
  localStorage.setItem("imgUrl", data.imgUrl);
  localStorage.setItem("accessToken", data.accessToken!);
  localStorage.setItem("refreshToken", data.refreshToken!);
};

export const registrUser = (user: IUser) => {
  return new Promise<IUser>((resolve, reject) => {
    apiClient
      .post("/auth/register", user)
      .then((response) => {
        console.log(response);
        const data = response.data;
        setLocalStorage(data);

        resolve(data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};
