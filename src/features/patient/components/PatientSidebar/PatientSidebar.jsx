import React from 'react';
import { NavLink } from 'react-router-dom';
import { LuLayoutDashboard, LuClipboardList } from 'react-icons/lu';
import { FaHeartPulse, FaUserDoctor } from 'react-icons/fa6';
import {
  HiOutlineCalendarDays,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCog6Tooth,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineDocumentText,
  HiOutlineQrCode,
  HiOutlineBookOpen,
} from 'react-icons/hi2';
import { MdOutlineMedicalInformation } from 'react-icons/md';

const MENU_ITEMS = [
  { label: 'Dashboard',             path: '/patient/dashboard',    icon: <LuLayoutDashboard /> },
  { label: 'Health Survey',         path: '/patient/survey',       icon: <LuClipboardList /> },
  { label: 'Heart Risk Assessment', path: '/patient/heart-risk',   icon: <FaHeartPulse /> },
  { label: 'Doctor List',           path: '/patient/doctors',      icon: <FaUserDoctor /> },
  { label: 'Appointments',          path: '/patient/appointments', icon: <HiOutlineCalendarDays /> },
  { label: 'Messages',              path: '/patient/messages',     icon: <HiOutlineChatBubbleLeftRight /> },
  { label: 'Prescription',          path: '/patient/prescription', icon: <HiOutlineDocumentText /> },
  { label: 'Medical Records',       path: '/patient/records',      icon: <MdOutlineMedicalInformation /> },
  { label: 'QR Code',               path: '/patient/qr',           icon: <HiOutlineQrCode /> },
  { label: 'Stories & community',   path: '/patient/stories',      icon: <HiOutlineBookOpen /> },
];

// 1. تصغير الخط لـ 11px والبادينج الرأسي لـ py-1 لضمان عدم وجود سكرول
const linkBase = 'relative flex items-center gap-2 px-3 py-1 rounded-[8px] text-[11px] font-semibold transition-all duration-200 no-underline cursor-pointer text-[#333CF580] hover:text-[#333CF5] border border-transparent';

// 2. الـ Active class مع البوردر الأزرق
const linkActiveClass = '!text-[#333CF5]  bg-[#155dfc05]';

const PatientSidebar = ({ onClose, onLogout }) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-[24px] overflow-hidden border border-gray-100/50 shadow-sm">
      
      {/* ── Logo - تقليل البادينج الرأسي جداً ── */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 shrink-0">
        <img src="../../../../assets/logo/logo.svg" alt="Logo" className="w-6 h-6 shrink-0" onError={e => e.target.style.display='none'} />
        <span className="text-[13px] font-bold text-black-main-text tracking-tight">
          Pulse<span className="text-[#333CF5]">X</span>
        </span>
      </div>

      {/* ── Navigation - تقليل المسافات ── */}
      <nav className="flex-1  py-2 overflow-hidden flex flex-col justify-between" aria-label="Patient menu">
        
        <div>
          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.15em] px-2 mb-1">Menu</p>
          <ul className="space-y-0.5 list-none p-0 m-0">
            {MENU_ITEMS.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) => `${linkBase} ${isActive ? linkActiveClass : ''}`}
                >
                  {({ isActive }) => (
                    <>
                      {/* الـ Indicator لزق في طرف البوردر */}
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#333CF5] rounded-r-full" />
                      )}
                      <span className="text-[15px] shrink-0">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
                  <div className="mt-2 pt-2 border-t border-[#75757526]">
          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.15em] px-2 mb-1">General</p>
          <ul className="space-y-0.5 list-none p-0 m-0">
            <li>
              <NavLink 
                to="/patient/settings" 
                onClick={onClose} 
                className={({ isActive }) => `${linkBase} ${isActive ? linkActiveClass : ''}`}
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#333CF5] rounded-r-full" />}
                    <HiOutlineCog6Tooth className="text-[15px] shrink-0" />
                    <span className="truncate">Settings & Profile</span>
                  </>
                )}
              </NavLink>
            </li>
            <li>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-[8px] text-[11px] font-semibold text-[#333CF580] hover:text-red-500 hover:bg-red-50 transition-all border border-transparent bg-transparent cursor-pointer"
              >
                <HiOutlineArrowLeftOnRectangle className="text-[15px] shrink-0" />
                <span>Log out</span>
              </button>
            </li>
          </ul>
        </div>
        </div>

        {/* General Section - ملموم في الآخر */}

      </nav>
    </div>
  );
};

export default PatientSidebar;