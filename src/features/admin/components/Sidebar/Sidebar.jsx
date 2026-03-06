import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  HiOutlineUsers,
  HiOutlineClock,
  HiOutlineCog6Tooth,
  HiOutlineArrowLeftOnRectangle,
} from 'react-icons/hi2';
import { LuLayoutDashboard } from 'react-icons/lu';
import { FaUserDoctor, FaBookOpen } from 'react-icons/fa6';
import { CiFlag1 } from 'react-icons/ci';

import logo from '../../../../assets/logo/logo.svg';

const MENU_ITEMS = [
  { name: 'Dashboard',          path: 'dashboard',           icon: <LuLayoutDashboard /> },
  { name: 'Doctor Management',  path: 'doctor-management',   icon: <FaUserDoctor />,
    extraActivePaths: ['/admin/AddDoctorBtn', '/admin/edit-doctor'] },
  { name: 'Patient Management', path: 'patient-management', icon: <HiOutlineUsers />,
    extraActivePaths: ['/admin/AddPatientBtn', '/admin/edit-patient'] },
  { name: 'Stories Management', path: 'stories-management', icon: <FaBookOpen />,
    extraActivePaths: ['/admin/add-story', '/admin/edit-story', '/admin/stories'] },
  { name: 'Activity Logs',      path: 'activity-logs',       icon: <HiOutlineClock /> },
  { name: 'Reports',            path: 'reports',             icon: <CiFlag1 /> },
];

const linkBase = 'relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold transition-all duration-200 no-underline cursor-pointer text-[#333CF580] hover:text-[#333CF5] border border-transparent hover:bg-[#155dfc05]';
const linkActiveClass = '!text-[#333CF5] bg-[#155dfc08] ';

const Sidebar = ({ onClose, onLogout }) => {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col h-full bg-white rounded-[24px] border border-gray-100/50 shadow-sm overflow-hidden">

      {/* ── Logo Section ── */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100 shrink-0">
        <img src={logo} alt="PulseX Logo" className="w-7 h-7 shrink-0" />
        <span className="text-[16px] font-bold text-black-main-text tracking-tight">
          Pulse<span className="text-[#333CF5]">X</span>
        </span>
      </div>

      {/* ── Navigation Container ── */}
      {/* استخدمنا flex-1 و overflow-y-auto هنا عشان لو الشاشة صغرت القائمة بس هي اللي تعمل سكرول واللوجو واللوج أوت يفضلوا ثابتين */}
      <nav className="flex-1 flex flex-col justify-between py-3 overflow-y-auto custom-scrollbar" aria-label="Admin menu">
        
        {/* Top Part: Menu Items */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-[#757575B2] uppercase tracking-[0.2em] px-3 mb-3 mt-2">
            Menu
          </p>
          <ul className="space-y-1 list-none p-0 m-0">
            {MENU_ITEMS.map((item) => {
              const fullPath = `/admin/${item.path}`;
              const isActive =
                pathname === fullPath ||
                (item.extraActivePaths?.some((sub) => pathname.startsWith(sub)));

              return (
                <li key={item.path}>
                  <NavLink
                    to={fullPath}
                    onClick={onClose}
                    className={`${linkBase} ${isActive ? linkActiveClass : ''}`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#333CF5] rounded-r-full" />
                    )}
                    <span className="text-[18px] shrink-0">{item.icon}</span>
                    <span className="truncate">{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
                  <div className="mt-auto border-t-[#757575B2] ">
          <p className="text-[10px] font-bold text-[#757575B2] uppercase tracking-[0.2em] px-3 mb-2">
            General
          </p>
          <ul className="space-y-1 list-none p-0 m-0">
            <li>
              <NavLink
                to="/admin/settings"
                onClick={onClose}
                className={({ isActive }) => `${linkBase} ${isActive ? linkActiveClass : ''}`}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#333CF5] rounded-r-full" />
                    )}
                    <HiOutlineCog6Tooth className="text-[18px] shrink-0" />
                    <span className="truncate">Settings & Profile</span>
                  </>
                )}
              </NavLink>
            </li>
            
            <li>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold text-[#333CF580] hover: cursor-pointer"
              >
                <HiOutlineArrowLeftOnRectangle className="text-[18px] shrink-0" />
                <span>Log out</span>
              </button>
            </li>
          </ul>
        </div>
        </div>

        {/* Bottom Part: General & Logout */}
        {/* الـ mt-auto بتخلي الجزء ده ينزل لتحت خالص دايماً */}


      </nav>
    </div>
  );
};

export default Sidebar;