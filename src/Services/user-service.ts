import apiClient from "./api-client";
import { IUser } from "./auth-service";

class userService {
  getConnectedUser() {
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const userImg = localStorage.getItem("imgUrl");
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    return {
      username: username,
      email: email,
      userImg: userImg,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  getUser(name:string){
    const controller = new AbortController();
    const User = apiClient.get<IUser>(`/auth/getUser/${name}`, { signal: controller.signal });
    return {User, cancelUser:()=>controller.abort()};
  }
}

export default new userService();
