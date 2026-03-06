/**
 * DoctorLayout — Reusable Layout for Doctor role
 * ─────────────────────────────────────────────────────────────
 * يستخدم مؤقتاً PatientSidebar و PatientHeader حتى يتم إنشاء
 * UnifiedSidebar / DashboardHeader كـ shared components لاحقاً.
 * ─────────────────────────────────────────────────────────────
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
// مؤقتاً نستخدم sidebar وheader الـ patient — استبدليهم بـ shared components لو أنشأتِهم
import PatientSidebar from '../../../patient/components/PatientSidebar/PatientSidebar';
import PatientHeader  from '../../../patient/components/PatientHeader/PatientHeader';

const DoctorLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F7F8]">
      {/* Fixed Sidebar */}
      <aside className="w-[260px] shrink-0 h-screen">
        <PatientSidebar />
      </aside>

      {/* Right Column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Sticky Header */}
        <header className="shrink-0">
          <PatientHeader />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
