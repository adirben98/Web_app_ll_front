import { useEffect, useState } from "react";
import chatService from "../Services/chat-service";
import { IRoom } from "../Services/chat-service";
import styles from "./MyMessageList.module.css";

export default function MyMessageList() {
  function navigateToChat(roomId: string) {
    window.location.href = `/chat?room=${roomId}`;
  }

  const [rooms, setRooms] = useState<IRoom[]>([]);
  useEffect(() => {
    chatService.getMyRooms().then((data) => {
      setRooms(data.data);
      console.log(data.data);
    });
  }, []);

  return (
    <div className={styles.container}>
      <ul className={styles.roomList}>
        {rooms.map((room) => (
          <li key={room.roomId} className={styles.roomItem} onClick={() => navigateToChat(room.roomId)}>
            {room.otherUser}
          </li>
        ))}
      </ul>
    </div>
  );
}
