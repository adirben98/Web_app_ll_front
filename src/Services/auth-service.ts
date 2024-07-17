import { CredentialResponse } from "@react-oauth/google";
import apiClient from "./api-client";

export interface IUser {
  email: string;
  image: string;
  username: string;
  password?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface IChangePassword{
  username:string;
  oldPassword:string;
  newPassword:string;
}


class registerService {


  setLocalStorage = (data: IUser) => {
    localStorage.setItem("email", data.email);
    localStorage.setItem("username", data.username);
    localStorage.setItem("imgUrl", data.image);
    localStorage.setItem("accessToken", data.accessToken!);
    localStorage.setItem("refreshToken", data.refreshToken!);
  };

  registrUser = (user: IUser) => {
    return new Promise<IUser>((resolve, reject) => {
      apiClient
        .post("/auth/register", user)
        .then((response) => {
          console.log(response);
          const data = response.data;
          this.setLocalStorage(data);
  
          resolve(data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  };

  isEmailTaken(email:string){
    return new Promise<boolean>((resolve, reject) => {
      apiClient
        .post("/auth/isEmailTaken", { email: email })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    }
    );
    
  }
  
  isUsernameTaken(username:string){
    return new Promise<boolean>((resolve, reject) => {
      apiClient
        .post("/auth/isUsernameTaken", { username: username })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    }
    );
  }

  login(email:string, password:string){
    return new Promise<IUser>((resolve, reject) => {
      apiClient
        .post<IUser>("/auth/login", { email: email, password: password })
        .then((response) => {
          console.log(response);
          const data = response.data;
          this.setLocalStorage(data);
          resolve(data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });

  }
  

  googleLogin(credentials: CredentialResponse) {
    return new Promise<IUser>((resolve, reject) => {
      apiClient
        .post<IUser>("auth/googleLogin", {
          credentials: credentials.credential,
        })
        .then((response) => {
          this.setLocalStorage(response.data);
          console.log(response);
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  changePassword(object:IChangePassword){
    return new Promise<IUser>((resolve, reject) => {
      apiClient
        .post<IUser>("auth/changePassword", object)
        .then((response) => {
          console.log(response);
          resolve(response.data!);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }
}
export default new registerService();
