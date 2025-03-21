'use client'

import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);
  const [input, setInput] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);

  const sendMessage = async () => {
    if (!input) return;
    setMessages([...messages, { user: input, bot: '...' }]);
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });
    const data = await response.json();
    setMessages((prev) => [...prev.slice(0, -1), { user: input, bot: data.reply }]);
    setInput('');
  };

  const addTask = (task: string) => {
    if (task) setTasks([...tasks, task]);
  };

  return (
    <div className={styles.container}>
      <aside className={styles.schedule}>
        <h2>Cronograma</h2>
        <input
          className={styles.input}
          placeholder="Adicionar tarefa"
          onKeyPress={(e) => e.key === 'Enter' && addTask((e.target as HTMLInputElement).value)}
        />
        <ul>
          {tasks.map((task, i) => (
            <li key={i}>{task}</li>
          ))}
        </ul>
      </aside>
      <main className={styles.chat}>
        <div className={styles.messages}>
          {messages.map((msg, i) => (
            <div key={i} className={styles.message}>
              <p><strong>You:</strong> {msg.user}</p>
              <p><strong>Bot:</strong> {msg.bot}</p>
            </div>
          ))}
        </div>
        <div className={styles.inputArea}>
          <input
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
          />
          <button className={styles.button} onClick={sendMessage}>
            Send
          </button>
        </div>
      </main>
    </div>
  );
}