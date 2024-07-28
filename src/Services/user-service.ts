import { apiClient } from "./useAuth";
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
    };
    return user;
  }

  getUser(name: string) {
    const controller = new AbortController();
    const User = apiClient.get<IUser>(`/auth/getUser/${name}`, { signal: controller.signal });
    return { User, cancelUser: () => controller.abort() };
  }

  updateUserImage(image: string) {
    return apiClient.put(`/auth/updateUserImage`, { imgUrl: image });
  }

  async checkRoom(roomId: string): Promise<boolean> {
    try {
      const response = await apiClient.get(`/rooms/check/${roomId}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking room:', error);
      return false;
    }
  }

  async createRoom(roomId: string, user1: string, user2: string): Promise<void> {
    try {
      await apiClient.post(`/rooms/create`, { roomId, users: [user1, user2] });
    } catch (error) {
      console.error('Error creating room:', error);
    }
  }
}

export default new userService();
