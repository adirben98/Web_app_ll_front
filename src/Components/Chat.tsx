// import React, { useEffect, useState } from 'react';
// import { io, Socket } from 'socket.io-client';
// import styles from './Chat.module.css';

// const socket: Socket = io('https://193.106.55.166:80');

// const Chat: React.FC = () => {
//   const [messages, setMessages] = useState<string[]>([]);
//   const [input, setInput] = useState('');

//   useEffect(() => {
//     socket.on('chat message', (msg: string) => {
//       setMessages((prevMessages) => [...prevMessages, msg]);
//     });

//     return () => {
//       socket.off('chat message');
//     };
//   }, []);

//   const sendMessage = () => {
//     if (input.trim()) {
//       socket.emit('chat message', input);
//       setInput(''); 
//     }
//   };

//   return (
//     <div className={styles.chatContainer}>
//       <div className={styles.messageList}>
//         {messages.map((msg, index) => (
//           <div key={index}>{msg}</div>
//         ))}
//       </div>
//       <div className={styles.inputContainer}>
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type a message..."
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default Chat;
