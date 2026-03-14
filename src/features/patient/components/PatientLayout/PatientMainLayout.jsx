import React, { useState } from 'react';
// إضافة useLocation هنا
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import PatientSidebar from '../PatientSidebar/PatientSidebar';
import PatientHeader from '../PatientHeader/PatientHeader';
import PatientChatbot from '../PatientChatbot/PatientChatbot';
import ConfirmModal from '../../../admin/components/ConfirmModal/ConfirmModal';
import { HiBars3 } from 'react-icons/hi2';

const PatientMainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  
  // 1. تعريف useLocation لمعرفة المسار الحالي
  const location = useLocation();

  // 2. حددي هنا المسارات (Paths) اللي مش عاوزه الشات بوت يظهر فيها
  // مثلاً لو مش عاوزاه يظهر في صفحة البروفايل أو الإعدادات
  const excludedRoutes = ['/patient/messages', '/patient/settings', '/chat-page'];

  // 3. التحقق إذا كان المسار الحالي ضمن القائمة الممنوعة
  const shouldShowChatbot = !excludedRoutes.includes(location.pathname);

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    localStorage.clear();
    navigate('/login'); 
  };

  return (
    <div className="min-h-screen bg-[#F6F7F8] font-roboto p-[20px] flex gap-[20px] relative box-border items-stretch">

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
          className="w-[260px] bg-white shadow-sm rounded-[24px] border border-gray-100/60 flex flex-col 
                     lg:sticky lg:top-[20px] lg:h-[calc(100vh-40px)]
                     overflow-y-auto 
                     scrollbar-none hover:scrollbar-thin 
                     scrollbar-thumb-gray-300 scrollbar-track-transparent"
        >
          <PatientSidebar 
            onClose={() => setSidebarOpen(false)} 
            onLogout={() => setIsLogoutModalOpen(true)} 
          /> 
        </aside>
      </div>

      {/* ── Right Column ── */}
      <div className="flex-1 flex flex-col gap-[20px] min-w-0">

        {/* Header */}
        <header className="h-[70px] bg-white shadow-sm rounded-[20px] px-6 flex items-center border border-gray-100/60 z-40 shrink-0">
          <button
            className="lg:hidden p-2 rounded-lg text-gray-600 mr-3"
            onClick={() => setSidebarOpen(true)}
          >
            <HiBars3 className="w-6 h-6" />
          </button>
          <div className="flex-1 min-w-0">
            <PatientHeader onLogout={() => setIsLogoutModalOpen(true)} />
          </div>
        </header>

        <main
          aria-label="Patient page content"
          className="bg-white shadow-sm rounded-[24px] border border-gray-100/60 flex-1 lg:min-h-[calc(100vh-130px)]"
        >
          <Outlet />
        </main>
      </div>

      {/* 4. شرط ظهور الشات بوت */}
      {shouldShowChatbot && <PatientChatbot />}

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
