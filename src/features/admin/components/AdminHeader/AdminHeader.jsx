import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  HiOutlineBell,
  HiOutlineClock,
  HiOutlineXMark,
  HiOutlineCalendarDays,
  HiOutlineCheckCircle,
  HiOutlineTrash,
  HiOutlineChatBubbleLeftRight,
  HiOutlineDocumentText,
  HiOutlineChatBubbleOvalLeft,
} from 'react-icons/hi2';
import { FiCalendar } from 'react-icons/fi';

/* ─── Mock data (replace with real API call) ────────────────── */
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'appointment',
    title: 'New Appointment Request',
    description: 'Sarah Mohamed requested an appointment for tomorrow at 10:00 AM',
    timeAgo: '5 minutes ago',
    isRead: false,
  },
  {
    id: 2,
    type: 'prescription',
    title: 'Prescription Viewed',
    description: 'Ahmed Ali viewed the prescription you sent (RX-2024-00145)',
    timeAgo: '15 minutes ago',
    isRead: false,
  },
  {
    id: 3,
    type: 'message',
    title: 'New Message',
    description: 'Dr. Noha Salem sent you a consultation request',
    timeAgo: '1 hour ago',
    isRead: false,
  },
  {
    id: 4,
    type: 'reminder',
    title: 'Appointment Reminder',
    description: 'You have an appointment with Omar Khaled at 2:30 PM today',
    timeAgo: '2 hours ago',
    isRead: true,
  },
];

/* ─── Icon per notification type ───────────────────────────── */
const NotifIcon = ({ type }) => {
  const base = 'w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-lg';
  if (type === 'appointment')
    return <div className={`${base} bg-blue-100 text-blue-600`}><HiOutlineCalendarDays /></div>;
  if (type === 'prescription')
    return <div className={`${base} bg-purple-100 text-purple-600`}><HiOutlineDocumentText /></div>;
  if (type === 'message')
    return <div className={`${base} bg-green-100 text-green-600`}><HiOutlineChatBubbleLeftRight /></div>;
  return <div className={`${base} bg-gray-100 text-gray-500`}><HiOutlineChatBubbleOvalLeft /></div>;
};

/* ─── Component ─────────────────────────────────────────────── */
const AdminHeader = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [adminData] = useState({ name: 'Tayem Zayed', role: 'Admin', image: '' });
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const notifRef = useRef();

  /* clock tick every minute */
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  /* close panel when clicking outside */
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setIsNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── actions ── */
  const markRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );

  const deleteNotif = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div
      className="flex items-center justify-between w-full h-full font-['inter']"
      ref={notifRef}
    >
      {/* ── Left: Date + Time ── */}
      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        <div className="hidden sm:flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-lg">
          <FiCalendar className="text-brand-main text-base md:text-lg shrink-0" />
          <span className="text-xs md:text-sm font-bold text-black-main-text truncate">
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
        <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-lg">
          <HiOutlineClock className="text-[#13D486] text-base md:text-lg shrink-0" />
          <span className="text-xs md:text-sm font-bold text-black-main-text">
            {currentTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>

      {/* ── Right: Bell + Profile ── */}
      <div className="flex items-center gap-2 md:gap-4">

        {/* Bell button */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-2 md:p-2.5 rounded-full transition-all duration-300 shadow-md border border-gray-100
              ${isNotifOpen
                ? 'bg-brand-main text-white shadow-brand-main/40 scale-95'
                : 'bg-white text-gray-400 hover:bg-gray-50 hover:shadow-lg'
              }`}
          >
            <HiOutlineBell className="text-xl md:text-2xl" />
            {unreadCount > 0 && (
              <span
                className={`absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px]
                  flex items-center justify-center rounded-full border-2 font-bold
                  ${isNotifOpen ? 'border-brand-main' : 'border-white'}`}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* ── Notification Panel ── */}
          {isNotifOpen && (
            <div className="absolute top-12 md:top-14 right-0 w-[calc(100vw-24px)] max-w-[360px] md:max-w-[400px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-3xl border border-gray-100 z-[200] overflow-hidden">

              {/* Header (blue) */}
              <div className="px-5 py-4 bg-brand-main">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-white text-lg font-bold font-['inter'] leading-7">
                    Notifications
                  </h3>
                  <button
                    onClick={() => setIsNotifOpen(false)}
                    className="w-7 h-7 flex items-center justify-center rounded-[10px] text-white hover:bg-white/20 transition-colors"
                  >
                    <HiOutlineXMark className="text-lg" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100 text-sm font-['inter']">
                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-white text-sm font-['inter'] underline hover:text-blue-100 transition-colors"
                    >
                      <HiOutlineCheckCircle className="text-base" />
                      Mark all as read
                    </button>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-100">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 pt-4 pb-3 flex gap-3 transition-colors
                        ${n.isRead ? 'bg-white' : 'bg-blue-50/50'}`}
                    >
                      <NotifIcon type={n.type} />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-bold text-black-main-text font-['inter'] leading-5">
                            {n.title}
                          </h4>
                          {!n.isRead && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-700 font-['inter'] leading-5 mt-0.5 line-clamp-2">
                          {n.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400 font-['inter'] leading-4">
                            {n.timeAgo}
                          </span>
                          <div className="flex items-center gap-3">
                            {!n.isRead && (
                              <button
                                onClick={() => markRead(n.id)}
                                className="text-xs text-blue-600 font-['inter'] font-medium hover:underline"
                              >
                                Mark read
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotif(n.id)}
                              className="text-xs text-red-600 font-['inter'] font-medium hover:underline flex items-center gap-0.5"
                            >
                              <HiOutlineTrash className="text-sm" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <HiOutlineBell className="text-4xl text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-400 font-['inter']">No notifications</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile — clicks → /admin/settings */}
        <div
          onClick={() => navigate('/admin/settings')}
          className="flex items-center gap-3 pl-4 border-l border-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
        >
          {adminData.image ? (
            <img
              src={adminData.image}
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
              alt="Admin"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-brand-main flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {adminData.name.charAt(0)}
            </div>
          )}
          <div className="hidden md:block">
            <p className="text-sm font-bold text-black-main-text font-['inter']">{adminData.name}</p>
            <p className="text-[11px] font-semibold text-gray-400 font-['inter']">{adminData.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;