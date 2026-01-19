import { useEffect, useState } from "react";
import "./Forum.css";

type User = {
  email: string;
  role: string;
};

type Message = {
  id: number;
  sender: string;
  receiver: string;
  text: string;
  date: string;
};

type ForumProps = {
  user: User;
};

const Forum: React.FC<ForumProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000); // refresh auto
    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    const res = await fetch(
      `http://localhost:3001/api/messages/${user.email}`
    );
    const data = await res.json();
    setMessages(data);
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    await fetch("http://localhost:3001/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: user.email,
        receiver: "admin@cyberparc.tn", // أو company
        text
      })
    });

    setText("");
    loadMessages();
  };

  return (
    <div className="chat-root">
      <div className="chat-header">
        💬 Discussion interne
      </div>

      <div className="chat-messages">
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.sender === user.email
                ? "chat-bubble mine"
                : "chat-bubble other"
            }
          >
            <p>{m.text}</p>
            <span>
              {new Date(m.date).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </span>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Écrire un message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
};

export default Forum;
