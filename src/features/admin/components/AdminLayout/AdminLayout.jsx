import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import AdminHeader from '../AdminHeader/AdminHeader';
import ConfirmModal from '../ConfirmModal/ConfirmModal'; // تأكد من صحة المسار لديك
import { HiBars3, HiXMark } from 'react-icons/hi2';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const navigate = useNavigate();

  // تنفيذ عملية تسجيل الخروج
  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    // localStorage.removeItem('token'); // مثال لمسح بيانات الدخول
    navigate('/login'); 
  };

  return (
    <div className="min-h-screen bg-[#F6F7F8] font-['Inter'] p-4 lg:p-8 flex gap-4 lg:gap-8 relative box-border items-stretch">

      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar Column ── */}
      <div className={`
        fixed lg:relative top-0 left-0 z-50 transition-transform duration-300 ease-in-out shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        h-screen lg:h-auto 
      `}>
        <aside
          aria-label="Admin navigation"
          className="w-[260px] bg-white shadow-sm rounded-[24px] overflow-hidden border border-gray-100/60 flex flex-col 
                     lg:sticky lg:top-8 lg:h-[calc(100vh-64px)]" 
        >
          {/* Close button — mobile only */}
          <button
            className="lg:hidden absolute top-3 right-3 z-50 p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <HiXMark className="w-5 h-5" />
          </button>

          {/* تمرير الـ props للـ Sidebar للتحكم في الـ Logout */}
          <Sidebar 
            onClose={() => setSidebarOpen(false)} 
            onLogout={() => setIsLogoutModalOpen(true)} 
          /> 
        </aside>
      </div>

      {/* ── Right Column ── */}
      <div className="flex-1 flex flex-col gap-4 lg:gap-8 min-w-0">

        {/* Sticky Header */}
        <header className="sticky top-4 lg:top-8 h-[60px] md:h-[66px] bg-white shadow-sm rounded-[20px] px-4 md:px-6 flex items-center border border-gray-100/60 z-40 shrink-0">
          {/* Hamburger — mobile only */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 mr-3 shrink-0 transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <HiBars3 className="w-6 h-6" />
          </button>
          
          <div className="flex-1 min-w-0">
            {/* تمرير الـ Logout للهيدر أيضاً لو أردتِ إضافة زر خروج هناك */}
            <AdminHeader onLogout={() => setIsLogoutModalOpen(true)} />
          </div>
        </header>

        {/* Page Content */}
        <main
          aria-label="Admin page content"
          className="bg-white shadow-sm rounded-[24px] border border-gray-100/60 lg: min-h-[calc(100vh-160px)]"
        >
          <Outlet />
        </main>
      </div>

      {/* ── Logout Confirmation Modal ── */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="Admin Log Out?"
        desc="Are you sure you want to end your administrative session?"
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
};

export default AdminLayout;