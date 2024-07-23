import {apiClient} from "./useAuth";
import { IUser } from "./auth-service";

class userService {
  getConnectedUser() {
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const userImg = localStorage.getItem("imgUrl");
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    const user: IUser = {
      username: username!,
      email: email!,
      image: userImg!,
      accessToken: accessToken!,
      refreshToken: refreshToken!,
    }
    return user
  }

  getUser(name:string){
    const controller = new AbortController();
    const User = apiClient.get<IUser>(`/auth/getUser/${name}`, { signal: controller.signal });
    return {User, cancelUser:()=>controller.abort()};
  }

  updateUserImage(image: string){
    return apiClient.put(`/auth/updateUserImage`, {imgUrl:image});
  }
}

export default new userService();
