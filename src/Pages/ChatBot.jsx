import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './ChatBot.css';

import micOnIcon from '../assets/icons/mic-on.svg';
import sendIcon from '../assets/icons/send.svg';
import tataLogo from '../assets/tata.png'; // ✅ Proper import for Vite

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const ChatBot = () => {
  const recognitionRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text:
        '🌙 Hello there, how can I help you today? Want to know about TATA STEEL or just fun chit-chat? just say it 😊',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatModel, setChatModel] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const setup = async () => {
      const model = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const chat = await model.startChat({ history: [] });
      setChatModel(chat);
    };
    setup();
  }, []);

  const handleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Speech recognition not supported');

    if (!recognitionRef.current) {
      const recog = new SpeechRecognition();
      recog.lang = 'en-US';
      recog.continuous = false;
      recog.interimResults = false;
      recog.onresult = (e) => {
        setInput(e.results[0][0].transcript);
        setIsListening(false);
      };
      recog.onend = () => setIsListening(false);
      recognitionRef.current = recog;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speak = (text) => {
    const synth = window.speechSynthesis;

    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
    } else {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.onend = () => setIsSpeaking(false);
      synth.speak(utter);
      setIsSpeaking(true);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !chatModel) return;

    const tataContext = `
You are an assistant trained to help with Tata Steel Limited Kalinganagar–related queries.
Respond like a Tata Steel employee would, using knowledge of manufacturing, steel plant, blast furnace, machinery, systems, safety norms, and general operations at Tata Steel.
If the question is not related to plant, chat like a friendly person normally. fetch information from all over the internet.
`;

    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    setInput('');
    setLoading(true);

    try {
      const fullPrompt = tataContext + '\n' + input;
      const result = await chatModel.sendMessage(fullPrompt);
      const reply = await result.response.text();
      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    } catch (err) {
      console.error('Gemini Error:', err);
      setMessages((prev) => [...prev, { sender: 'bot', text: '⚠️ Error fetching response' }]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-bg">
      <div className="chat-container">
        <div className="chat-header">
          <span>🤖 Textbot Assistant</span>
          <img src={tataLogo} alt="Tata Logo" className="tata-logo" />
        </div>

        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.sender}`}>
              <span className="label">{msg.sender === 'user' ? 'You:' : 'Bot:'}</span> {msg.text}
              {msg.sender === 'bot' && (
                <button
                  className="sound-btn"
                  onClick={() => speak(msg.text)}
                  title={isSpeaking ? 'Mute' : 'Speak'}
                >
                  {isSpeaking ? '🔇' : '🔊'}
                </button>
              )}
            </div>
          ))}
          {loading && <div className="message bot">✨ Thinking...</div>}
        </div>

        <div className="chat-input">
          <button
            onClick={handleVoice}
            title="Speak"
            className={`icon-btn mic-btn ${isListening ? 'active-mic' : ''}`}
          >
            <img src={micOnIcon} alt="Mic" />
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type or speak..."
          />

          <button onClick={handleSend} title="Send" className="icon-btn">
            <img src={sendIcon} alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
