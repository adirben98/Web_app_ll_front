import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import styles from "./Chat.module.css";

const socket: Socket = io("https://193.106.55.166:80");

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<
    { username: string; message: string }[]
  >([]);
  const [input, setInput] = useState("");
  const username = localStorage.getItem("username") || "";
  const [searchParams] = useSearchParams();
  const room = searchParams.get("room");

  useEffect(() => {
    if (!room) window.location.href = "/404";
    const users = room!.split("_");
    if (users[0] !== username && users[1] !== username) {
      window.location.href = `/404`;
    }
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.emit("join room", room);

    socket.on(
      "previous messages",
      (prevMessages: { username: string; message: string }[]) => {
        setMessages(prevMessages);
      }
    );

    socket.on("chat message", (msg: { username: string; message: string }) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("chat message");
      socket.emit("leave room", room);
    };
  }, [room]);

  const sendMessage = () => {
    if (input.trim() && username.trim() && room) {
      console.log("Sending message:", { username, message: input, room });
      socket.emit("chat message", { username, message: input, room });
      setInput("");
    } else {
      console.log("Message not sent. Check input, username, or room.");
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messageList}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              msg.username === username ? styles.mine : styles.other
            }`}
          >
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
