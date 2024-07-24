import {apiClient} from "./useAuth";
import { IUser } from "./auth-service";

class userService {
  getConnectedUser() {
    const username = localStorage.getItem("username");

    const email = localStorage.getItem("email");
    let userImg = localStorage.getItem("imgUrl");
    if(!userImg)userImg= "../assets/avatar.png";

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (!username || !email  || !accessToken || !refreshToken) {return null}

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

  logout(){
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("imgUrl");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
}

export default new userService();
