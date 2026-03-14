import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineBell, HiOutlineEnvelope, HiOutlineCheck, HiXMark } from 'react-icons/hi2';
import { LuCalendarDays, LuClock } from 'react-icons/lu';
import { MdOutlineReply, MdOutlineDelete, MdOutlineSend } from 'react-icons/md';

/* ── Mock Data ─────────────────────────────────────── */
const MOCK_NOTIFICATIONS = [
  {
    id: 1, unread: true, type: 'alert',
    icon: '⚠️', bg: '#FEE2E2', color: '#EF4444',
    title: 'High Risk Alert',
    desc: 'Your latest health assessment shows high risk indicators. Please consult with your doctor immediately.',
    time: 'Just now', tag: 'Urgent', tagColor: '#EF4444',
  },
  {
    id: 2, unread: true, type: 'message',
    icon: '💬', bg: '#EFF6FF', color: '#3B82F6',
    title: 'Message from Dr. Ahmed Hassan',
    desc: 'Please take your medication as prescribed and avoid heavy meals. Let me know if you have any side effects.',
    time: '5 minutes ago',
  },
  {
    id: 3, unread: true, type: 'payment',
    icon: '✅', bg: '#F0FDF4', color: '#22C55E',
    title: 'Payment Successful',
    desc: 'Your payment of EGP 500 has been processed successfully. Receipt #PAY-2024-789',
    time: '30 minutes ago',
  },
  {
    id: 4, unread: true, type: 'appointment',
    icon: '✅', bg: '#F5F3FF', color: '#8B5CF6',
    title: 'Appointment Confirmed',
    desc: 'Your appointment with Dr. Ahmed Hassan on Feb 16, 2026 at 10:00 AM has been confirmed.',
    time: '1 hour ago',
  },
];

const MOCK_MESSAGES = [
  {
    id: 1, unread: 2,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'Dr. Ahmed Hassan', role: 'Cardiologist', time: '5 min ago',
    text: 'Please take your medication as prescribed and let me know if you experience any side effects.',
  },
  {
    id: 2, unread: 1,
    avatar: 'https://placehold.co/40x40/e0f2fe/155DFC?text=PS',
    name: 'PulseX Support', role: 'Customer Service', time: '1 hour ago',
    text: 'Your appointment has been confirmed for tomorrow at 10:00 AM. See you soon!',
  },
  {
    id: 3, unread: 0,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    name: 'Dr. Noha Salem', role: 'General Practitioner', time: '3 hours ago',
    text: 'Your lab results look good! Keep up the healthy lifestyle.',
  },
  {
    id: 4, unread: 0,
    avatar: 'https://placehold.co/40x40/fef9c3/d97706?text=CL',
    name: 'City Medical Lab', role: 'Laboratory', time: 'Yesterday',
    text: 'Your test results are ready. You can view them in Medical Records.',
  },
];

/* ── Helpers ───────────────────────────────────────── */
function formatDate(d) {
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
function formatTime(d) {
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

/* ══════════════════════════════════════════════════════
   Reply Modal
══════════════════════════════════════════════════════ */
const ReplyModal = ({ target, onClose, onSend }) => {
  const [text, setText] = useState('');
  if (!target) return null;
  return (
    <div className="fixed inset-0 bg-black-main-text/45 flex items-center justify-center z-[1000] p-4 animate-[fadeIn_0.15s_ease]" onClick={onClose}>
      <div className="bg-white rounded-[20px] w-full max-w-[440px] shadow-[0_25px_60px_rgba(0,0,0,0.18)] overflow-hidden animate-[slideUp_0.2s_ease]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-br from-[#155DFC] to-[#4A7FFF]">
          <span className="text-[14px] font-bold text-white font-roboto">Reply to {target.name || target.title}</span>
          <button className="bg-white/20 rounded-lg w-7 h-7 flex items-center justify-center text-white cursor-pointer hover:bg-white/35 transition-colors" onClick={onClose}><HiXMark /></button>
        </div>
        
        {target.avatar && (
          <div className="flex items-center gap-[10px] px-5 pt-4">
            <img src={target.avatar} alt="" className="w-[38px] h-[38px] rounded-full object-cover border-2 border-gray-200 shrink-0" />
            <div>
              <div className="text-[13px] font-bold text-black-main-text font-roboto">{target.name}</div>
              <div className="text-[11px] text-[#9ca3af] font-roboto">{target.role}</div>
            </div>
          </div>
        )}

        <div className="mx-5 mt-3 p-3 bg-[#f8fafc] border-l-[3px] border-[#155DFC] rounded-r-lg">
          <span className="block text-[10px] font-bold text-[#9ca3af] uppercase mb-1 font-roboto">Original:</span>
          <span className="text-[12px] text-[#4b5563] leading-relaxed font-roboto">{target.text || target.desc}</span>
        </div>

        <textarea
          className="block w-full mt-3 px-5 py-3 border-none border-t border-gray-100 resize-none text-[13px] font-roboto text-black-main-text outline-none placeholder:text-[#9ca3af]"
          placeholder="Write your reply..."
          value={text}
          onChange={e => setText(e.target.value)}
          rows={3}
          autoFocus
        />

        <div className="flex items-center justify-end gap-[10px] px-5 py-4 border-t border-gray-100">
          <button className="bg-none border-[1.5px] border-gray-200 rounded-[20px] px-[18px] py-[7px] text-[12px] font-semibold text-[#6b7280] cursor-pointer hover:border-gray-400 font-roboto transition-colors" onClick={onClose}>Cancel</button>
          <button
            className="flex items-center gap-1.5 bg-[#333CF5] border-none rounded-[20px] px-5 py-[7px] text-[12px] font-bold text-white cursor-pointer shadow-[0_4px_12px_rgba(51,60,245,0.25)] hover:bg-[#2430e0] hover:-translate-y-px transition-all disabled:opacity-45 disabled:cursor-not-allowed font-roboto"
            onClick={() => { if (text.trim()) { onSend(text); onClose(); } }}
            disabled={!text.trim()}
          >
            <MdOutlineSend /> Send
          </button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   PatientHeader Component
══════════════════════════════════════════════════════ */
const PatientHeader = () => {
  const [now, setNow] = useState(new Date());
  const [notifOpen, setNotifOpen] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [replyTarget, setReplyTarget] = useState(null);

  const notifRef = useRef(null);
  const msgRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (msgRef.current && !msgRef.current.contains(e.target)) setMsgOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unreadNotif = notifications.filter(n => n.unread).length;
  const unreadMsg = messages.filter(m => m.unread > 0).length;

  const markOneRead = (id) => setNotifications(p => p.map(n => n.id === id ? { ...n, unread: false } : n));
  const deleteNotif = (id) => setNotifications(p => p.filter(n => n.id !== id));
  const markAllRead = () => setNotifications(p => p.map(n => ({ ...n, unread: false })));
  const deleteMsg = (id) => setMessages(p => p.filter(m => m.id !== id));

  const handleSendReply = (text) => {
    console.log('[Reply sent]', { to: replyTarget?.name, message: text });
  };

  return (
    <>
      <header className="flex items-center justify-between w-full h-full relative gap-3">
        
        {/* ── Left: Date & Time ── */}
        <div className="flex items-center gap-[10px] shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-[10px]  ">
            <LuCalendarDays className="text-[15px] text-[#155dfc] shrink-0" />
            <span className="text-[13px] font-bold text-black-main-text whitespace-nowrap font-roboto">{formatDate(now)}</span>
          </div>
          <div className="hidden min-[480px]:flex items-center gap-2 px-3.5 py-1.5 rounded-[10px] bg-white ">
            <LuClock className="text-[15px] text-[#00a63e] shrink-0" />
            <span className="text-[13px] font-bold text-black-main-text whitespace-nowrap font-roboto">{formatTime(now)}</span>
          </div>
        </div>

        {/* ── Right: Icons + Avatar ── */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* ── Messages Button ── */}
          <div className="relative" ref={msgRef}>
            <button
              className={`relative w-10 h-10 flex items-center justify-center rounded-full bg-white border-[1.5px] border-gray-200 cursor-pointer transition-all shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:bg-[#EEF3FF] hover:border-[#155DFC] group ${msgOpen ? 'bg-[#155DFC]! border-[#155DFC]! shadow-[0_4px_16px_rgba(21,93,252,0.3)]!' : ''}`}
              onClick={() => { setMsgOpen(p => !p); setNotifOpen(false); }}
            >
              <HiOutlineEnvelope className={`text-[18px] transition-colors group-hover:text-[#155DFC] ${msgOpen ? 'text-white!' : 'text-[#6b7280]'}`} />
              {unreadMsg > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#00C950] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white font-roboto">
                  {unreadMsg}
                </span>
              )}
            </button>

            {msgOpen && (
              <div className="absolute top-[calc(100%+10px)] right-0 w-[290px] sm:w-[360px] bg-white rounded-[20px] border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.13)] overflow-hidden z-[300] animate-[fadeDown_0.18s_ease]">
                <div className="flex items-center justify-between px-[18px] py-4 bg-gradient-to-br from-[#16a34a] to-[#22c55e]">
                  <div>
                    <div className="text-[15px] font-bold text-white font-roboto">Messages</div>
                    <div className="text-[11px] text-white/75 mt-0.5 font-roboto">{unreadMsg} unread messages</div>
                  </div>
                  <button className="bg-white/20 rounded-lg w-7 h-7 flex items-center justify-center text-white cursor-pointer hover:bg-white/35 transition-colors" onClick={() => setMsgOpen(false)}><HiXMark /></button>
                </div>

                <div className="max-h-[340px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50">
                  {messages.map(msg => (
                    <div key={msg.id} className="flex items-start gap-3 px-4 py-3 border-bottom border-gray-100 transition-colors hover:bg-gray-50">
                      <div className="relative shrink-0">
                        <img src={msg.avatar} alt={msg.name} className="w-[42px] h-[42px] rounded-full object-cover border-2 border-gray-200" />
                        {msg.unread > 0 && <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-[#22c55e] border-2 border-white rounded-full" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[13px] font-bold text-black-main-text font-roboto truncate">{msg.name}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-[#9ca3af] font-roboto">{msg.time}</span>
                            {msg.unread > 0 && <span className="min-w-[18px] h-[18px] px-1 bg-[#22c55e] text-white text-[10px] font-bold rounded-full flex items-center justify-center font-roboto">{msg.unread}</span>}
                          </div>
                        </div>
                        <span className="block text-[11px] text-[#9ca3af] mb-1 font-roboto">{msg.role}</span>
                        <p className="text-[12px] text-[#6b7280] leading-[1.4] font-roboto line-clamp-2">{msg.text}</p>
                        <div className="flex gap-2.5 mt-1.5">
                          <button className="flex items-center gap-1 text-[11px] font-semibold text-[#22c55e] cursor-pointer hover:underline font-roboto" onClick={() => { setReplyTarget(msg); setMsgOpen(false); }}>
                            <MdOutlineReply /> Reply
                          </button>
                          <button className="flex items-center gap-1 text-[11px] font-semibold text-[#ef4444] cursor-pointer hover:underline font-roboto" onClick={() => deleteMsg(msg.id)}>
                            <MdOutlineDelete /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Notifications Button ── */}
          <div className="relative" ref={notifRef}>
            <button
              className={`relative w-10 h-10 flex items-center justify-center rounded-full bg-white border-[1.5px] border-gray-200 cursor-pointer transition-all shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:bg-[#EEF3FF] hover: group ${notifOpen ? 'shadow-[0_4px_16px_rgba(21,93,252,0.3)]!' : ''}`}
              onClick={() => { setNotifOpen(p => !p); setMsgOpen(false); }}
            >
              <HiOutlineBell className={`text-[18px] transition-colors group-hover:text-[#155DFC] ${notifOpen ? 'text-[#6b7280]!' : 'text-[#6b7280]'}`} />
              {unreadNotif > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#FB2C36] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white font-roboto">
                  {unreadNotif}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute top-[calc(100%+10px)] right-0 w-[290px] sm:w-[360px] bg-white rounded-[20px] border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.13)] overflow-hidden z-[300] animate-[fadeDown_0.18s_ease]">
                <div className="flex items-center justify-between px-[18px] py-4 bg-gradient-to-br from-[#155dfc] to-[#4a7fff]">
                  <div>
                    <div className="text-[15px] font-bold text-white font-roboto">Notifications</div>
                    <div className="text-[11px] text-white/75 mt-0.5 font-roboto">{unreadNotif} unread notifications</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="bg-transparent border-none text-white/90 text-[11px] font-semibold cursor-pointer underline font-roboto" onClick={markAllRead}>
                      <HiOutlineCheck className="inline mr-1" /> Mark all
                    </button>
                    <button className="bg-white/20 rounded-lg w-7 h-7 flex items-center justify-center text-white cursor-pointer hover:bg-white/35 transition-colors" onClick={() => setNotifOpen(false)}><HiXMark /></button>
                  </div>
                </div>

                <div className="max-h-[340px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50">
                  {notifications.map(n => (
                    <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-none transition-colors hover:bg-gray-50 ${n.unread ? 'bg-[#FAFCFF]' : ''}`}>
                      <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center shrink-0 shadow-sm" style={{ background: n.bg }}>
                        <span className="text-[15px]">{n.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-bold text-black-main-text mb-0.5 font-roboto">{n.title}</div>
                        <div className="text-[12px] text-[#6b7280] leading-[1.4] font-roboto">{n.desc}</div>
                        {n.tag && (
                          <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border-[1.5px] bg-[#fef2f2] font-roboto" style={{ color: n.tagColor, borderColor: n.tagColor }}>
                             ⚠️ {n.tag}
                          </span>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] text-[#9ca3af] font-roboto">{n.time}</span>
                          <div className="flex gap-2">
                            {(n.type === 'message' || n.type === 'alert') && (
                              <button className="text-[#155dfc] text-[11px] font-semibold cursor-pointer hover:underline font-roboto flex items-center gap-0.5" onClick={() => { setReplyTarget({ name: n.title, desc: n.desc, avatar: null }); setNotifOpen(false); }}>
                                <MdOutlineReply /> Reply
                              </button>
                            )}
                            {n.unread && <button className="text-[#155dfc] text-[11px] font-semibold cursor-pointer hover:underline font-roboto" onClick={() => markOneRead(n.id)}>Mark read</button>}
                            <button className="text-[#ef4444] text-[11px] font-semibold cursor-pointer hover:underline font-roboto" onClick={() => deleteNotif(n.id)}>Delete</button>
                          </div>
                        </div>
                      </div>
                      {n.unread && <span className="w-2 h-2 rounded-full shrink-0 mt-1.5 bg-[#3B82F6]" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Avatar ── */}
          <div className="flex items-center gap-[10px] pl-3.5  cursor-pointer group">
            <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-[#e0eaff]  " />
            <div className="hidden md:flex flex-col">
              <span className="text-[13px] font-bold text-black-main-text whitespace-nowrap font-roboto ">Mohamed Salem</span>
              <span className="text-[10px]  text-[#6b7280] uppercase tracking-wider font-roboto">Patient </span>
            </div>
          </div>

        </div>
      </header>

      <ReplyModal target={replyTarget} onClose={() => setReplyTarget(null)} onSend={handleSendReply} />

      <style>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default PatientHeader;