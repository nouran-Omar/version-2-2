import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { HiOutlinePaperClip, HiOutlineFaceSmile, HiOutlineVideoCamera } from 'react-icons/hi2';
import { MdSend, MdSearch, MdMenu } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import PatientRatingModal from '../PatientRatingModal/PatientRatingModal';

/* ═══════════════════════════  MOCK DATA  ═══════════════════════════ */
export const DOCTORS_LIST = [
  {
    id: 1,
    name: 'Dr. Jehan Osama',
    specialty: 'Cardiologist',
    status: 'online',
    time: '2h ago',
    lastMsg: 'Your test results are ready for review...',
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&q=80',
  },
  {
    id: 2,
    name: 'Dr. Osama Ali',
    specialty: 'Surgeon',
    status: 'online',
    time: '1d ago',
    lastMsg: 'Please take your medication as pr...',
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&q=80',
  },
  {
    id: 3,
    name: 'Dr. Sarah Omar',
    specialty: 'Specialist',
    status: 'offline',
    time: '3d ago',
    lastMsg: 'How are you feeling today?',
    img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&q=80',
  },
  {
    id: 4,
    name: 'Dr. Ali Seif',
    specialty: 'Consultant',
    status: 'offline',
    time: '1w ago',
    lastMsg: 'Your appointment is confirmed fo...',
    img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&q=80',
  },
];

const INIT_CONVOS = {
  1: [
    { id: 101, from: 'doctor', type: 'text', text: "Hello! I've reviewed your recent lab results and everything looks good. Your blood pressure has improved significantly since our last visit.", time: '10:30 AM' },
    { id: 102, from: 'me',     type: 'text', text: "That's great news! I've been following the diet plan you recommended and taking my medication regularly.", time: '10:32 AM' },
    { id: 103, from: 'doctor', type: 'text', text: "Hello! I've reviewed your recent lab results and everything looks good. Your blood pressure has improved significantly since our last visit.", time: '10:30 AM' },
    { id: 104, from: 'me',     type: 'text', text: "That's great news! I've been following the diet plan you recommended and taking my medication regularly.", time: '10:32 AM' },
    { id: 105, from: 'doctor', type: 'text', text: "Hello! I've reviewed your recent lab results and everything looks good. Your blood pressure has improved significantly since our last visit.", time: '10:30 AM' },
  ],
  2: [{ id: 201, from: 'doctor', type: 'text', text: 'Please take your medication as prescribed. How are you feeling today?', time: '09:15 AM' }],
  3: [{ id: 301, from: 'doctor', type: 'text', text: 'How are you feeling today? Any new symptoms to report?', time: 'Yesterday' }],
  4: [{ id: 401, from: 'doctor', type: 'text', text: 'Your appointment is confirmed for next Monday at 10 AM.', time: '1w ago' }],
};

const EMOJIS = ['😊', '❤️', '👍', '🏥', '💊', '👨‍⚕️', '🙏', '💪', '😷', '🩺'];

/* ═══════════════════════════  COMPONENT  ═══════════════════════════ */
const PatientMessages = () => {
  const location = useLocation();

  // If navigated from booking/payment with a doctorId in state, auto-open that chat
  const initialId = location.state?.doctorId ?? 1;

  const [activeId,    setActiveId]    = useState(initialId);
  const [search,      setSearch]      = useState('');
  const [input,       setInput]       = useState('');
  const [showEmoji,   setShowEmoji]   = useState(false);
  const [convos,      setConvos]      = useState(INIT_CONVOS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showRating,  setShowRating]  = useState(false);

  const fileRef   = useRef(null);
  const bottomRef = useRef(null);

  /* auto-scroll to bottom */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [convos, activeId]);

  /* close emoji on outside click */
  useEffect(() => {
    const close = (e) => { if (!e.target.closest('[data-emoji]')) setShowEmoji(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  /* if state changes (e.g. navigated again), update activeId */
  useEffect(() => {
    if (location.state?.doctorId) setActiveId(location.state.doctorId);
  }, [location.state]);

  const doctor   = DOCTORS_LIST.find((d) => d.id === activeId);
  const filtered = DOCTORS_LIST.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

  const sendMsg = (content, type = 'text') => {
    if (type === 'text' && !content.trim()) return;
    const t   = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg = { id: Date.now(), from: 'me', type, text: content, time: t };
    setConvos((p) => ({ ...p, [activeId]: [...(p[activeId] ?? []), msg] }));
    setInput('');
    setShowEmoji(false);
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1, from: 'doctor', type: 'text',
        text: "Thank you for your message. I'll review it and get back to you shortly.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setConvos((p) => ({ ...p, [activeId]: [...(p[activeId] ?? []), reply] }));
    }, 1500);
  };

  const pickFile = (e) => {
    const f = e.target.files[0];
    if (f) sendMsg(URL.createObjectURL(f), 'image');
    e.target.value = '';
  };

  const selectChat = (id) => { setActiveId(id); setSidebarOpen(false); };

  /* ─────────────────────────── render ─────────────────────────── */
  return (
    <div className="h-[calc(100vh-120px)] min-h-[500px]">
      {/* Rating modal */}
      <PatientRatingModal
        isOpen={showRating}
        onClose={() => setShowRating(false)}
        onSubmit={(rating, feedback) => {
          console.log('Rating submitted:', { doctorId: activeId, rating, feedback });
        }}
        doctor={{
          name:            doctor?.name,
          img:             doctor?.img,
          appointmentDate: 'December 15, 2024 at 3:00 PM',
        }}
      />

      <div className="bg-white rounded-[22px] border border-gray-100 shadow-sm flex h-full overflow-hidden relative">

        {/* Mobile backdrop */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              key="bd"
              className="fixed inset-0 z-20 bg-black/40 lg:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* ═══════════  SIDEBAR  ═══════════ */}
        <aside className={`absolute lg:relative z-30 top-0 left-0 h-full w-80 bg-white border-r border-gray-200 flex flex-col rounded-tl-3xl rounded-bl-3xl transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

          {/* Sidebar header — Figma: Messages title + icon */}
          <div className="flex items-center gap-3 px-4 pt-4 pb-0 shrink-0">
            <span className="text-[22px] font-medium text-black-main-text leading-7">Messages</span>
            <span className="w-6 h-6 flex items-center justify-center">
              <svg width="20" height="16" viewBox="0 0 24 24" fill="#010218">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </span>
          </div>

          {/* Search — Figma: rounded-3xl, gray-50 bg */}
          <div className="px-4 pt-3 pb-3 shrink-0">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-3xl px-3 py-2.5 h-11">
              <MdSearch className="text-gray-400 shrink-0 text-[16px]" />
              <input
                type="text"
                placeholder="Search doctor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none w-full text-[14px] text-black-main-text placeholder:text-gray-400 font-normal"
              />
            </div>
          </div>

          {/* Active chat — Figma: bg-indigo-50, full-width highlight */}
          {filtered.filter(d => d.id === activeId).map((doc) => (
            <div
              key={`active-${doc.id}`}
              onClick={() => selectChat(doc.id)}
              className="flex items-center gap-3 px-4 py-3 bg-indigo-50 cursor-pointer shrink-0 h-16"
            >
              <div className="relative shrink-0">
                <img src={doc.img} alt={doc.name} className="w-12 h-12 rounded-full object-cover" />
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold text-black-main-text truncate">{doc.name}</span>
                  <span className="text-[12px] text-gray-500 shrink-0 ml-2">{doc.time}</span>
                </div>
                <p className="text-[12px] text-gray-600 truncate mt-0.5">{doc.lastMsg}</p>
              </div>
            </div>
          ))}

          {/* Inactive chats — Figma: border-b border-gray-50, unread dot = Blue-1 */}
          <div className="flex-1 overflow-y-auto">
            {filtered.filter(d => d.id !== activeId).map((doc) => (
              <div
                key={doc.id}
                onClick={() => selectChat(doc.id)}
                className="flex items-center gap-3 px-4 py-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors h-20"
              >
                <div className="relative shrink-0">
                  <img src={doc.img} alt={doc.name} className="w-12 h-12 rounded-full object-cover" />
                  {/* Figma: unread dot top-right = Blue-1 (#333CF5), size=12px */}
                  {doc.status === 'online' && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#333CF5]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-medium text-black-main-text truncate">{doc.name}</span>
                    <span className="text-[12px] text-gray-500 shrink-0 ml-2">{doc.time}</span>
                  </div>
                  <p className="text-[12px] text-gray-600 truncate mt-0.5">{doc.lastMsg}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar footer — Figma: bg-gray-50, border-t, rounded-bl-3xl */}
          <div className="bg-gray-50 border-t border-gray-200 rounded-bl-3xl px-4 py-4 shrink-0">
            <p className="text-[12px] text-gray-500 leading-5">
              Start a new conversation with your doctor. Your messages are private and encrypted.
            </p>
          </div>
        </aside>

        {/* ═══════════  CHAT WINDOW  ═══════════ */}
        <div className="flex-1 flex flex-col min-w-0 bg-gray-200 rounded-tr-3xl rounded-br-3xl overflow-hidden">

          {/* Chat header — white bg on top of gray */}
          <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shrink-0 rounded-tr-3xl">
            <div className="flex items-center gap-3">
              {/* Hamburger mobile */}
              <button
                aria-label="Open sidebar"
                className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <MdMenu className="text-xl text-gray-600" />
              </button>
              <div className="relative shrink-0">
                <img src={doctor?.img} alt={doctor?.name} className="w-9 h-9 rounded-full object-cover" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-black-main-text">{doctor?.name}</p>
                <p className="text-[11px] text-green-500 font-semibold">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                aria-label="Video call"
                className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <HiOutlineVideoCamera className="text-[#333CF5] text-lg" />
              </button>
              <button
                className="bg-[#E7000B] hover:bg-red-700 text-white rounded-xl px-4 py-2 text-[12px] font-bold transition-colors"
                onClick={() => setShowRating(true)}
              >
                End Chat
              </button>
            </div>
          </div>

          {/* Messages area — Figma: gray-200 bg */}
          <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
            {(convos[activeId] ?? []).map((msg) => {
              const isMe = msg.from === 'me';
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>

                  {/* Doctor bubble — Figma: white bg, rounded-tl-sm rounded-tr-3xl rounded-bl-3xl rounded-br-3xl, shadow */}
                  {!isMe && (
                    <div className="flex items-start gap-2 max-w-[65%]">
                      <img
                        src={doctor?.img}
                        alt="doctor"
                        className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                      />
                      <div>
                        <div className="bg-white rounded-tl-sm rounded-tr-3xl rounded-bl-3xl rounded-br-3xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] px-4 py-4">
                          {msg.type === 'text'
                            ? <p className="text-[14px] text-black-main-text font-normal leading-5">{msg.text}</p>
                            : <img src={msg.text} alt="attachment" className="max-w-[200px] rounded-lg" />
                          }
                        </div>
                        <span className="text-[12px] text-gray-500 mt-1 ml-1 block">{msg.time}</span>
                      </div>
                    </div>
                  )}

                  {/* My bubble — Figma: Blue-1 (#333CF5) bg, rounded-tl-3xl rounded-tr-sm rounded-bl-3xl rounded-br-3xl, shadow */}
                  {isMe && (
                    <div className="flex flex-col items-end max-w-[65%]">
                      <div className="bg-[#333CF5] rounded-tl-3xl rounded-tr-sm rounded-bl-3xl rounded-br-3xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] px-4 py-4">
                        {msg.type === 'text'
                          ? <p className="text-[14px] text-white font-normal leading-5">{msg.text}</p>
                          : <img src={msg.text} alt="attachment" className="max-w-[200px] rounded-lg" />
                        }
                      </div>
                      <span className="text-[12px] text-gray-500 mt-1 mr-1">{msg.time}</span>
                    </div>
                  )}

                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input bar — white bg */}
          <div className="px-4 py-3 bg-white border-t border-gray-200 shrink-0">
            <div className="flex items-center gap-2">
              {/* Attachment */}
              <input type="file" ref={fileRef} className="hidden" onChange={pickFile} accept="image/*" />
              <button
                aria-label="Attach file"
                className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                <HiOutlinePaperClip className="text-gray-500 text-lg" />
              </button>

              {/* Text field */}
              <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 gap-2 focus-within:border-[#333CF5] transition-colors">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMsg(input)}
                  className="bg-transparent outline-none flex-1 text-[13px] text-black-main-text placeholder:text-gray-400"
                />
                {/* Emoji */}
                <div data-emoji className="relative">
                  <button
                    data-emoji
                    aria-label="Emoji"
                    className="w-7 h-7 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors"
                    onClick={() => setShowEmoji((s) => !s)}
                  >
                    <HiOutlineFaceSmile className="text-gray-500 text-lg" />
                  </button>
                  <AnimatePresence>
                    {showEmoji && (
                      <motion.div
                        data-emoji
                        className="absolute bottom-10 right-0 bg-white border border-gray-100 rounded-[16px] shadow-xl p-2 grid grid-cols-5 gap-1 z-50"
                        initial={{ opacity: 0, y: 6, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.94 }}
                        transition={{ duration: 0.13 }}
                      >
                        {EMOJIS.map((em) => (
                          <button
                            key={em}
                            data-emoji
                            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-lg transition-colors"
                            onClick={() => { setInput((v) => v + em); setShowEmoji(false); }}
                          >
                            {em}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Send */}
              <button
                aria-label="Send message"
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${input.trim() ? 'bg-[#333CF5] hover:bg-[#2830d4]' : 'bg-gray-100 cursor-not-allowed'}`}
                onClick={() => sendMsg(input)}
                disabled={!input.trim()}
              >
                <MdSend className={`text-lg ${input.trim() ? 'text-white' : 'text-gray-400'}`} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PatientMessages;
