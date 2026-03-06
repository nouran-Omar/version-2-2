import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'; // ضفنا useNavigate
import PatientSidebar from '../PatientSidebar/PatientSidebar';
import PatientHeader from '../PatientHeader/PatientHeader';
import PatientChatbot from '../PatientChatbot/PatientChatbot';
import ConfirmModal from '../../../admin/components/ConfirmModal/ConfirmModal'; // تأكدي من المسار صح
import { HiBars3, HiXMark } from 'react-icons/hi2';

const PatientMainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // 1. ضيفي الـ State دي للـ Modal
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const navigate = useNavigate();

  // 2. Function تنفيذ الخروج
  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    // لو فيه Token بتمسحيه هنا (localStorage.clear() مثلاً)
    navigate('/login'); 
  };

  return (
    <div className="min-h-screen bg-[#F6F7F8] font-['Inter'] p-4 lg:p-8 flex gap-4 lg:gap-8 relative box-border items-stretch">

      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar Column ── */}
      <div className={`
        fixed lg:relative top-0 left-0 z-50 transition-transform duration-300 ease-in-out shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        h-screen lg:h-auto 
      `}>
        <aside
          aria-label="Patient navigation"
          className="w-[260px] bg-white shadow-sm rounded-[24px] overflow-hidden border border-gray-100/60 flex flex-col 
                     lg:sticky lg:top-8 lg:h-[calc(100vh-64px)]" 
        >
          <button
            className="lg:hidden absolute top-3 right-3 z-50 p-1.5 rounded-lg bg-gray-100 text-gray-600"
            onClick={() => setSidebarOpen(false)}
          >
            <HiXMark className="w-5 h-5" />
          </button>

          {/* نبعت الـ props للـ Sidebar */}
          <PatientSidebar 
            onClose={() => setSidebarOpen(false)} 
            onLogout={() => setIsLogoutModalOpen(true)} 
          /> 
        </aside>
      </div>

      {/* ── Right Column ── */}
      <div className="flex-1 flex flex-col gap-4 lg:gap-8 min-w-0">

        {/* Sticky Header */}
        <header className="sticky top-4 lg:top-8 h-[60px] md:h-[66px] bg-white shadow-sm rounded-[20px] px-4 md:px-6 flex items-center border border-gray-100/60 z-40 shrink-0">
          <button
            className="lg:hidden p-2 rounded-lg text-gray-600 mr-3"
            onClick={() => setSidebarOpen(true)}
          >
            <HiBars3 className="w-6 h-6" />
          </button>
          <div className="flex-1 min-w-0">
            {/* لو عوزة برضه زرار logout في الهيدر ابعتيله الـ prop ده */}
            <PatientHeader onLogout={() => setIsLogoutModalOpen(true)} />
          </div>
        </header>

        {/* Page Content */}
        <main
          aria-label="Patient page content"
          className="bg-white shadow-sm rounded-[24px] border border-gray-100/60  lg:min-h-[calc(100vh-160px)]"
        >
          <Outlet />
        </main>
      </div>

      <PatientChatbot />

      {/* 3. الـ Modal مكانه هنا في الـ Layout عشان يظهر فوق كل حاجة */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="Log Out?"
        desc="Are you sure you want to log out of your account?"
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
};

export default PatientMainLayout;
