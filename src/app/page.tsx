"use client";

import { useState, useEffect, useRef } from 'react';
import { FaCheckCircle, FaPlayCircle, FaPlus, FaMicrophone, FaRobot } from 'react-icons/fa';

export default function Home() {
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);
  const [input, setInput] = useState('');
  const [tasks, setTasks] = useState<{ name: string; duration: string; platform: string; completed: boolean; inProgress: boolean }[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'conversation' | 'grammar' | 'listening' | 'voice'>('conversation');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Garantir que as vozes estejam carregadas antes de usar
  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  const sendMessage = async (message: string = input) => {
    if (!message.trim()) return;
    setMessages([...messages, { user: message, bot: '' }]);
    if (mode !== 'voice') setInput('');
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, mode }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev.slice(0, -1), { user: message, bot: data.reply }]);
      
      // Configurar o áudio com uma voz mais natural
      const utterance = new SpeechSynthesisUtterance(data.reply);
      utterance.lang = 'en-US';
      
      // Tentar encontrar uma voz mais natural
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(voice => voice.name.includes('Google') || voice.name.includes('Natural') || voice.lang === 'en-US') || voices[0];
      utterance.voice = naturalVoice;
      
      // Ajustar tom e velocidade para soar mais humano
      utterance.pitch = 1.0; // Tom normal
      utterance.rate = 0.9;  // Fala um pouco mais lenta para maior clareza
      utterance.volume = 1.0; // Volume máximo
      
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setMessages((prev) => [...prev.slice(0, -1), { user: message, bot: 'Sorry, something went wrong.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (mode !== 'voice') setInput(transcript);
      sendMessage(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (mode === 'voice' && !isLoading) {
        startListening();
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.start();
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

      <main className="w-2/3 p-6 flex flex-col bg-gray-50">
        <div className="flex items-center justify-between mb-4 p-4 bg-blue-500 text-white rounded-t-lg shadow-md">
          <div className="flex items-center">
            <FaRobot className="text-2xl mr-2" />
            <h2 className="text-xl font-semibold">English Assistant</h2>
          </div>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as 'conversation' | 'grammar' | 'listening' | 'voice')}
            className="p-2 rounded-lg bg-white text-gray-800 focus:outline-none"
          >
            <option value="grammar">Grammar Mode</option>
            <option value="conversation">Conversation Mode</option>
            <option value="listening">Listening Mode</option>
            <option value="voice">Voice Mode</option>
          </select>
        </div>
        <div className="flex-grow overflow-y-auto mb-4 p-4 bg-white rounded-b-lg shadow-md">
          {messages.map((msg, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs shadow-sm">
                  {msg.user}
                </div>
              </div>
              <div className="flex justify-start mt-2">
                <div className="flex items-start gap-2">
                  <FaRobot className="text-gray-500 mt-1" />
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-xs shadow-sm">
                    {msg.bot ? (
                      <div>
                        {mode === 'grammar' ? (
                          (() => {
                            const parts = msg.bot.split('**Response:**');
                            const correctionPart = parts[0]?.replace('**Correction:**', '').trim();
                            const responsePart = parts[1]?.trim();
                            return (
                              <>
                                {correctionPart && correctionPart !== 'No corrections needed.' && (
                                  <p className="text-sm text-gray-600 italic">
                                    Correction: {correctionPart}
                                  </p>
                                )}
                                {responsePart && (
                                  <p className="mt-2">{responsePart}</p>
                                )}
                              </>
                            );
                          })()
                        ) : (
                          <p>{msg.bot.trim()}</p>
                        )}
                      </div>
                    ) : i === messages.length - 1 && isLoading ? (
                      <div className="flex gap-1">
                        <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce1"></span>
                        <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce2"></span>
                        <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce3"></span>
                      </div>
                    ) : (
                      'Waiting for response...'
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-3">
          <button
            onClick={startListening}
            className={`p-3 rounded-lg ${
              isListening ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-800'
            } hover:bg-gray-400`}
          >
            <FaMicrophone />
          </button>
          <input
            className={`flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm ${
              mode === 'voice' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            value={input}
            onChange={(e) => mode !== 'voice' && setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && mode !== 'voice') {
                sendMessage();
              }
            }}
            placeholder={mode === 'voice' ? 'Voice mode: Speak to interact' : 'Type your message...'}
            disabled={mode === 'voice'}
          />
          <button
            onClick={() => sendMessage()}
            className={`p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-sm ${
              mode === 'voice' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={mode === 'voice'}
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}