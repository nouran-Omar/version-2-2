import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import AdminHeader from '../AdminHeader/AdminHeader';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import { HiBars3, HiXMark } from 'react-icons/hi2';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    localStorage.clear(); // مسح البيانات للتأكد من الخروج
    navigate('/login'); 
  };

  return (
    // استخدام نفس الخلفية والـ Padding والـ Gap مثل الـ Patient
    <div className="min-h-screen bg-[#F8F9FB] font-roboto p-5 flex gap-5 relative box-border items-stretch">

      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── LEFT COLUMN: Admin Sidebar ── */}
      <div className={`
        fixed lg:relative top-0 left-0 z-50 transition-transform duration-300 ease-in-out shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        h-screen lg:h-auto 
      `}>
        <aside
          aria-label="Admin navigation"
          className="w-[280px] bg-white shadow-[0px_10px_30px_rgba(0,0,0,0.03)] rounded-[32px] border border-gray-100 flex flex-col 
                     lg:sticky lg:top-5 lg:h-[calc(100vh-40px)]
                     overflow-hidden"
        >
          {/* Close button — Mobile only */}
          <button
            className="lg:hidden absolute top-5 right-5 z-50 p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all"
            onClick={() => setSidebarOpen(false)}
          >
            <HiXMark className="w-5 h-5" />
          </button>

          <Sidebar 
            onClose={() => setSidebarOpen(false)} 
            onLogout={() => setIsLogoutModalOpen(true)} 
          /> 
        </aside>
      </div>

      {/* ── RIGHT COLUMN: Header + Content ── */}
      <div className="flex-1 flex flex-col gap-5 min-w-0">

        {/* 1. Admin Header */}
        <header className="h-[80px] bg-white shadow-sm rounded-[24px] px-8 flex items-center border border-gray-100 z-40 shrink-0 transition-all">
          <button
            className="lg:hidden p-2.5 rounded-xl bg-gray-50 text-gray-600 mr-4 hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <HiBars3 className="w-6 h-6" />
          </button>
          
          <div className="flex-1 min-w-0">
            <AdminHeader onLogout={() => setIsLogoutModalOpen(true)} />
          </div>
        </header>

        {/* 2. Admin Page Content */}
        <main
          aria-label="Admin page content"
          className="bg-white shadow-sm rounded-[32px] border border-gray-100 flex-1 relative overflow-hidden flex flex-col lg:min-h-[calc(100vh-145px)]"
        >
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
             <Outlet />
          </div>
        </main>
      </div>

      {/* ── Logout Modal ── */}
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