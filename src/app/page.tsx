"use client"

import { useState, useEffect, useRef } from 'react';
import { FaCheckCircle, FaPlayCircle, FaPlus, FaMicrophone } from 'react-icons/fa';

export default function Home() {
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);
  const [input, setInput] = useState('');
  const [tasks, setTasks] = useState<{ name: string; duration: string; platform: string; completed: boolean; inProgress: boolean }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Função para rolar automaticamente para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { user: input, bot: '...' }]);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev.slice(0, -1), { user: input, bot: data.reply }]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setMessages((prev) => [...prev.slice(0, -1), { user: input, bot: 'Sorry, something went wrong.' }]);
    }
    setInput('');
  };

  const addTask = (name: string, duration: string, platform: string) => {
    if (name && duration && platform) {
      setTasks([...tasks, { name, duration, platform, completed: false, inProgress: false }]);
    }
  };

  const toggleTaskCompletion = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    updatedTasks[index].inProgress = false;
    setTasks(updatedTasks);
  };

  const toggleTaskInProgress = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].inProgress = !updatedTasks[index].inProgress;
    updatedTasks[index].completed = false;
    setTasks(updatedTasks);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Cronograma */}
      <aside className="w-1/3 p-6 bg-white shadow-lg border-r border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Cronograma</h2>
        <div className="mb-4">
          <input
            id="task-name"
            className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nome da tarefa"
          />
          <input
            id="task-duration"
            className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Duração (ex.: 30min)"
          />
          <select
            id="task-platform"
            className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione a plataforma</option>
            <option value="Duolingo">Duolingo</option>
            <option value="YouTube">YouTube</option>
            <option value="Coursera">Coursera</option>
            <option value="Other">Outra</option>
          </select>
          <button
            onClick={() => {
              const name = (document.getElementById('task-name') as HTMLInputElement).value;
              const duration = (document.getElementById('task-duration') as HTMLInputElement).value;
              const platform = (document.getElementById('task-platform') as HTMLSelectElement).value;
              addTask(name, duration, platform);
              (document.getElementById('task-name') as HTMLInputElement).value = '';
              (document.getElementById('task-duration') as HTMLInputElement).value = '';
              (document.getElementById('task-platform') as HTMLSelectElement).value = '';
            }}
            className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
          >
            <FaPlus /> Adicionar Tarefa
          </button>
        </div>
        <ul className="space-y-3">
          {tasks.map((task, i) => (
            <li
              key={i}
              className={`p-4 rounded-lg shadow-md flex justify-between items-center ${
                task.completed ? 'bg-green-100' : task.inProgress ? 'bg-yellow-100' : 'bg-gray-50'
              }`}
            >
              <div>
                <p className="font-semibold">{task.name}</p>
                <p className="text-sm text-gray-600">Duração: {task.duration}</p>
                <p className="text-sm text-gray-600">Plataforma: {task.platform}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleTaskInProgress(i)}>
                  <FaPlayCircle
                    className={`text-xl ${task.inProgress ? 'text-yellow-500' : 'text-gray-400'}`}
                  />
                </button>
                <button onClick={() => toggleTaskCompletion(i)}>
                  <FaCheckCircle
                    className={`text-xl ${task.completed ? 'text-green-500' : 'text-gray-400'}`}
                  />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Chat */}
      <main className="w-2/3 p-6 flex flex-col bg-gray-50">
        <div className="flex-grow overflow-y-auto mb-4 p-4 bg-white rounded-lg shadow-md">
          {messages.map((msg, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                  {msg.user}
                </div>
              </div>
              <div className="flex justify-start mt-2">
                <div className="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-xs">
                  {msg.bot}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-3">
          <button className="p-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">
            <FaMicrophone />
          </button>
          <input
            className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}