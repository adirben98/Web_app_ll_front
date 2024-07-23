// Chat.tsx
import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import styles from './Chat.module.css';

const socket: Socket = io('https://10.10.248.166');

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<{ username: string; message: string }[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const roomId = "roomIdFromPropsOrState"; // This should be obtained dynamically

  useEffect(() => {
    // Retrieve username from local storage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      // Handle cases where the username is not available
      console.error("Username not found in local storage");
    }

    // Join the room
    socket.emit('join room', { roomId });

    socket.on('chat message', (msg: { username: string; message: string }) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, [roomId]);

  const sendMessage = () => {
    if (input.trim() && username.trim()) {
      socket.emit('chat message', { roomId, username, message: input });
      setInput('');
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messageList}>
        {messages.map((msg, index) => (
          <div key={index}>
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
