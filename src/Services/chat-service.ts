import { apiClient } from "./useAuth";

class chatService{
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
export default new chatService();