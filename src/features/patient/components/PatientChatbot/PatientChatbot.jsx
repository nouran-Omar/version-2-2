
import React, { useState, useRef, useEffect } from 'react';
import {
  HiOutlineXMark,
  HiOutlinePaperAirplane,
} from 'react-icons/hi2';

const chatbotIcon = '/image/chatpot.svg'; // استبدلها بـ /image/chatpot.svg

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'assistant',
    text: "Hey there! 👋 I'm PulseX, your AI assistant. How can I help you today?",
  },
];

const AUTO_REPLIES = [
  "That's a great question! I'm processing that and learning more every day. Is there something specific I can help you with?",
  "Your heart rate of 75 bpm is within a healthy range. Keep it up!",
  "Your next appointment with Dr. Ahmed Hassan is on Feb 20 at 10:00 AM.",
];

let replyIdx = 0;

const PatientChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = AUTO_REPLIES[replyIdx % AUTO_REPLIES.length];
      replyIdx++;
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'assistant', text: reply }]);
    }, 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 right-6 z-50 w-[90vw] sm:w-96 h-[600px] bg-white rounded-3xl overflow-hidden shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-2 outline-offset-[-2px] outline-sky-200 transition-all duration-300 transform ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="relative w-full h-20 bg-blue-600 flex items-center px-6">
            <div className="absolute inset-0 bg-white/10" /> {/* White Overlay */}
            
            <div className="relative flex items-center gap-3 w-full">
                {/* Avatar */}
                <div className="w-13 h-13 bg-white rounded-full shadow-lg flex items-center justify-center overflow-hidden">
                    <img className="w-15 h-15 object-cover" src={chatbotIcon} alt="PulseX" />
                </div>

                {/* Info */}
                <div className="flex flex-col">
                    <span className="text-white text-base font-medium font-['Roboto'] leading-6">PulseX Assistant</span>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse" />
                        <span className="text-white/90 text-sm font-['Roboto']">Online</span>
                    </div>
                </div>

                {/* Close Button */}
                <button 
                    onClick={() => setIsOpen(false)}
                    className="ml-auto w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                    <HiOutlineXMark size={20} />
                </button>
            </div>
        </div>

        {/* Messages Area */}
        <div className="h-[430px] overflow-y-auto p-6 bg-gradient-to-b from-white to-gray-50/30 flex flex-col gap-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 text-base font-['Roboto'] leading-6 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-t-2xl rounded-bl-2xl rounded-br-md'
                    : 'bg-cyan-50 text-black-main-text rounded-t-2xl rounded-br-2xl rounded-bl-md'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="bg-cyan-50 px-4 py-2 rounded-2xl rounded-bl-md w-16 flex justify-center gap-1">
               <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
               <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
               <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 w-full h-24 bg-white border-t border-gray-100 px-6 flex items-center gap-3">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message…"
              className="w-full h-12 pl-4 pr-4 bg-white rounded-2xl outline outline-[0.80px] outline-cyan-300 shadow-[0px_0px_0px_2px_rgba(77,234,251,0.20)] text-black-main-text placeholder:text-neutral-950/50 focus:outline-blue-400 transition-all"
            />
          </div>
          
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
              input.trim() 
              ? 'bg-blue-600 text-white opacity-100 scale-100' 
              : 'bg-blue-600 text-white opacity-50 scale-95 cursor-not-allowed'
            }`}
          >
            <HiOutlinePaperAirplane size={20} className="rotate-35" />
          </button>
        </div>
      </div>

      {/* Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-6 w-20 h-24 bg-transparent  flex items-center justify-center  hover:scale-110 transition-transform z-50"
      >
        {isOpen ? <HiOutlineXMark size={30} /> : <img src={chatbotIcon} className=" shadow-5xl w-30 h-30" alt="chat" />}
      </button>
    </>
  );
};

export default PatientChatbot;