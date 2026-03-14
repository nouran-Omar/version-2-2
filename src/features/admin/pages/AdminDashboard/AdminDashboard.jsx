import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineUserGroup,
  HiOutlineUsers,
  HiOutlineUserPlus,
  HiOutlineArrowTrendingUp,
  HiOutlinePencilSquare,
  HiOutlineUserCircle,
} from 'react-icons/hi2';
import { FaUserMd } from 'react-icons/fa';

/* ─── Mock data — سيُستبدل بـ API calls حقيقية ─────────────── */
const MOCK_STATS = {
  totalDoctors: 214,
  totalPatients: 1467,
  newDoctors: 12,
  newPatients: 154,
};

const MOCK_DOCTORS = [
  { id: 1, name: 'Dr. Michael Chen', email: 'michael.chen@pulsex.com', avatar: '' },
  { id: 2, name: 'Dr. Sarah Williams', email: 'sarah.williams@pulsex.com', avatar: '' },
  { id: 3, name: 'Dr. James Rodriguez', email: 'james.rodriguez@pulsex.com', avatar: '' },
];

const MOCK_PATIENTS = [
  { id: 1, name: 'Emma Thompson', email: 'emma.thompson@email.com', avatar: '' },
  { id: 2, name: 'David Martinez', email: 'david.martinez@email.com', avatar: '' },
  { id: 3, name: 'Olivia Anderson', email: 'olivia.anderson@email.com', avatar: '' },
];

/* ─── Avatar مع fallback بالحرف الأول ──────────────────────── */
const Avatar = ({ name, src }) => {
  if (src)
    return <img src={src} alt={name} className="w-11 h-11 rounded-full object-cover border-2 border-gray-100 shrink-0" />;
  return (
    <div className="w-11 h-11 rounded-full bg-linear-to-br from-blue-400 to-brand-main flex items-center justify-center text-white font-bold text-sm shrink-0">
      {name.charAt(0)}
    </div>
  );
};

/* ─── بطاقة إحصاء واحدة ─────────────────────────────────────── */
const StatCard = ({ label, value, icon: Icon, iconBg, iconColor }) => (
  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 flex items-center gap-4 border border-white/30">
    <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center shrink-0`}>
      <Icon className={`text-2xl ${iconColor}`} />
    </div>
    <div>
      <p className="text-white/80 text-xs font-medium font-roboto">{label}</p>
      <p className="text-white text-2xl font-bold font-roboto">{value.toLocaleString()}</p>
    </div>
  </div>
);

/* ─── AdminDashboard ─────────────────────────────────────────── */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats] = useState(MOCK_STATS);
  const [doctors] = useState(MOCK_DOCTORS);
  const [patients] = useState(MOCK_PATIENTS);

  return (
    <div className="p-6 space-y-6 font-roboto bg-gray-50 min-h-full">

      {/* ══ Hero Banner ════════════════════════════════════════ */}
      <div className="relative bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl p-8 overflow-hidden">
        {/* دوائر زخرفية */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full" />
        <div className="absolute -bottom-12 right-32 w-36 h-36 bg-white/10 rounded-full" />
        <div className="absolute top-4 right-72 w-20 h-20 bg-white/10 rounded-full" />

        {/* المحتوى العلوي: عنوان + أزرار */}
        <div className="relative flex flex-wrap items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white font-roboto mb-1">Welcome Back 👋</h1>
            <p className="text-white/70 text-sm font-roboto">
              Here's what's happening in your system today
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/admin/AddDoctorBtn')}
              className="px-5 py-2.5 bg-white text-blue-600 font-semibold text-sm rounded-xl hover:bg-blue-50 transition-colors shadow-md font-roboto"
            >
              + Add Doctor
            </button>
            <button
              onClick={() => navigate('/admin/AddPatientBtn')}
              className="px-5 py-2.5 bg-[#0913C3] text-white font-semibold text-sm rounded-xl hover:bg-brand-main transition-colors shadow-md font-roboto"
            >
              + Add Patient
            </button>
          </div>
        </div>

        {/* ── الإحصاءات الأربعة ── */}
        <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Doctors"
            value={stats.totalDoctors}
            icon={FaUserMd}
            iconBg="bg-blue-500/30"
            iconColor="text-white"
          />
          <StatCard
            label="Total Patients"
            value={stats.totalPatients}
            icon={HiOutlineUsers}
            iconBg="bg-green-400/30"
            iconColor="text-white"
          />
          <StatCard
            label="New Doctors (7d)"
            value={stats.newDoctors}
            icon={HiOutlineUserPlus}
            iconBg="bg-purple-400/30"
            iconColor="text-white"
          />
          <StatCard
            label="New Patients (7d)"
            value={stats.newPatients}
            icon={HiOutlineArrowTrendingUp}
            iconBg="bg-amber-400/30"
            iconColor="text-white"
          />
        </div>
      </div>

      {/* ══ Recent Doctors + Recent Patients ══════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Recent Doctors ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <FaUserMd className="text-brand-main text-lg" />
              <h2 className="text-base font-bold text-black-main-text font-roboto">Recent Doctors</h2>
            </div>
            <button
              onClick={() => navigate('/admin/doctor-management')}
              className="text-sm text-brand-main font-semibold hover:underline font-roboto"
            >
              View All
            </button>
          </div>

          <div className="p-4">
            {doctors.length > 0 ? (
              <div className="space-y-3">
                {doctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Avatar name={doc.name} src={doc.avatar} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-black-main-text font-roboto truncate">{doc.name}</p>
                      <p className="text-xs text-gray-500 font-roboto truncate">{doc.email}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/admin/edit-doctor/${doc.id}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-main border border-brand-main/30 rounded-lg hover:bg-blue-50 transition-colors font-roboto shrink-0"
                    >
                      <HiOutlinePencilSquare className="text-sm" />
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty state — doctors */
              <div className="py-10 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FaUserMd className="text-3xl text-blue-300" />
                </div>
                <p className="text-base font-bold text-black-main-text font-roboto mb-1">No Doctors Added Yet</p>
                <p className="text-sm text-gray-400 font-roboto mb-5">
                  Start by adding your first doctor to the system
                </p>
                <button
                  onClick={() => navigate('/admin/AddDoctorBtn')}
                  className="px-6 py-2.5 bg-brand-main text-white text-sm font-semibold rounded-3xl hover:bg-[#0913C3] transition-colors font-roboto"
                >
                  Add First Doctor
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Recent Patients ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <HiOutlineUserCircle className="text-green-600 text-xl" />
              <h2 className="text-base font-bold text-black-main-text font-roboto">Recent Patients</h2>
            </div>
            <button
              onClick={() => navigate('/admin/patient-management')}
              className="text-sm text-brand-main font-semibold hover:underline font-roboto"
            >
              View All
            </button>
          </div>

          <div className="p-4">
            {patients.length > 0 ? (
              <div className="space-y-3">
                {patients.map((pat) => (
                  <div
                    key={pat.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Avatar name={pat.name} src={pat.avatar} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-black-main-text font-roboto truncate">{pat.name}</p>
                      <p className="text-xs text-gray-500 font-roboto truncate">{pat.email}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/admin/edit-patient/${pat.id}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors font-roboto shrink-0"
                    >
                      <HiOutlinePencilSquare className="text-sm" />
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty state — patients */
              <div className="py-10 text-center">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <HiOutlineUserGroup className="text-3xl text-green-300" />
                </div>
                <p className="text-base font-bold text-black-main-text font-roboto mb-1">No Patients Registered</p>
                <p className="text-sm text-gray-400 font-roboto mb-5">
                  No patients have been registered in the system yet
                </p>
                <button
                  onClick={() => navigate('/admin/AddPatientBtn')}
                  className="px-6 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-3xl hover:bg-green-700 transition-colors font-roboto"
                >
                  Add First Patient
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

