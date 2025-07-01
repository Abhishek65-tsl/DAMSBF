import React, { useState } from 'react';
import { Bot, User } from 'lucide-react';
import axios from 'axios';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '👋 Hello! I’m your digital assistant. Ask me anything about this system.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful assistant for a steel plant dashboard.' },
            { role: 'user', content: input },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
        }
      );

      const botReply = response.data.choices[0].message.content;
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    } catch (error) {
      console.error('API Error:', error?.response?.status, error?.response?.data);

      const errorMessage =
        error?.response?.status === 429
          ? '⚠️ You’re sending too many requests. Please wait a few seconds and try again.'
          : '⚠️ Sorry, something went wrong. Please try again.';

      setMessages((prev) => [...prev, { sender: 'bot', text: errorMessage }]);
    }

    setInput('');
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white">
      <div className="backdrop-blur-md bg-white/10 p-6 rounded-2xl shadow-2xl w-full max-w-lg h-[600px] flex flex-col border border-white/20">
        <h2 className="text-lg font-semibold mb-2 text-center">🤖 Chat Assistant</h2>

        <div className="flex-1 overflow-y-auto mb-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-500 pr-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && <Bot size={18} className="mt-1 text-cyan-300" />}
              <div
                className={`px-4 py-2 rounded-xl text-sm max-w-[70%] ${
                  msg.sender === 'bot'
                    ? 'bg-cyan-800 text-white shadow-lg'
                    : 'bg-emerald-500 text-white shadow-md'
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === 'user' && <User size={18} className="mt-1 text-emerald-200" />}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 rounded-full px-4 py-2 text-black bg-white focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
          />
          <button
            onClick={handleSend}
            className="bg-cyan-600 hover:bg-cyan-700 transition text-white px-4 py-2 rounded-full disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;