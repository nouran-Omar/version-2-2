import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/* ── Icons ── */
import { LuStethoscope, LuUsers, LuUserPlus, LuUserX } from 'react-icons/lu';
import { MdPersonAddAlt } from 'react-icons/md';

/* ─── Mock data ──────────────────────────────────────────────── */
const MOCK_STATS = { totalDoctors: 214, totalPatients: 1467, newDoctors: 12, newPatients: 154 };

const MOCK_DOCTORS = [
  { id: 1, name: 'Dr. Michael Chen',    email: 'michael.chen@pulsex.com',    image: 'https://i.pravatar.cc/150?u=dr1' },
  { id: 2, name: 'Dr. Sarah Williams',  email: 'sarah.williams@pulsex.com',  image: 'https://i.pravatar.cc/150?u=dr2' },
  { id: 3, name: 'Dr. James Rodriguez', email: 'james.rodriguez@pulsex.com', image: 'https://i.pravatar.cc/150?u=dr3' },
];

const MOCK_PATIENTS = [
  { id: 101, name: 'Emma Thompson',   email: 'emma.thompson@email.com',   image: 'https://i.pravatar.cc/150?u=p1' },
  { id: 102, name: 'David Martinez',  email: 'david.martinez@email.com',  image: 'https://i.pravatar.cc/150?u=p2' },
  { id: 103, name: 'Olivia Anderson', email: 'olivia.anderson@email.com', image: 'https://i.pravatar.cc/150?u=p3' },
];

/* ─── StatCard ──────────────────────────────────────────────── */
const StatCard = ({ icon, label, value, sub, gradient }) => (
  <div className="bg-white rounded-[16px] p-5 flex flex-col items-start gap-4 border border-gray-100 shadow-sm transition-all hover:shadow-md">
    
    {/* الأيقونة في الأعلى */}
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-xl shrink-0"
      style={{ background: gradient }}
    >
      {icon}
    </div>

    {/* النصوص تحت الأيقونة مباشرة */}
    <div className="flex flex-col gap-1 min-w-0">
      <span className="text-[22px] sm:text-[24px] font-bold text-[#101828] leading-tight">
        {(value ?? 0).toLocaleString()}
      </span>
      <span className="text-[13px] font-semibold text-[#101828]">{label}</span>
      <span className="text-[11px] text-[#6A7282]">{sub}</span>
    </div>

  </div>
);

/* ─── Skeleton ──────────────────────────────────────────────── */
const Skeleton = () => (
  <div className="flex items-center gap-3 py-3 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-3/4" />
      <div className="h-2.5 bg-gray-100 rounded w-1/2" />
    </div>
    <div className="w-12 h-7 bg-gray-200 rounded-lg" />
  </div>
);

/* ─── AdminDashboard ─────────────────────────────────────────── */
export default function AdminDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    stats: { totalDoctors: 0, totalPatients: 0, newDoctors: 0, newPatients: 0 },
    doctors: [],
    patients: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [stats, docs, pats] = await Promise.all([
          axios.get('/api/admin/stats', config).catch(() => ({ data: MOCK_STATS })),
          axios.get('/api/admin/recent-doctors', config).catch(() => ({ data: MOCK_DOCTORS })),
          axios.get('/api/admin/recent-patients', config).catch(() => ({ data: MOCK_PATIENTS })),
        ]);

        setData({
          stats: stats.data ?? MOCK_STATS,
          doctors: Array.isArray(docs.data) ? docs.data : MOCK_DOCTORS,
          patients: Array.isArray(pats.data) ? pats.data : MOCK_PATIENTS,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="flex flex-col gap-8" aria-label="Admin Dashboard">

      {/* ══ Welcome Card ════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-[20px] p-6 sm:p-8 bg-gradient-to-br from-[#155dfc] via-brand-main to-[#9810fa] shadow-[0_20px_40px_rgba(21,93,252,0.25)]">
        {/* Background circles */}
        <div aria-hidden="true" className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
        <div aria-hidden="true" className="absolute -bottom-16 -right-4 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-[22px] sm:text-[26px] font-bold text-white leading-tight">
            Welcome Back 👋
          </h1>
          <p className="text-[13px] text-white/75 mt-1 mb-5 max-w-md">
            Manage doctors and patients across the PulseX platform.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => navigate('/admin/AddDoctorBtn')}
              className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold bg-white text-[#333CF5] rounded-full hover:bg-blue-50 transition-colors shadow-sm"
            >
              <MdPersonAddAlt className="text-lg" />
              Add Doctor
            </button>
            <button
              onClick={() => navigate('/admin/AddPatientBtn')}
              className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold bg-[#0913C3] text-white border border-white/30 rounded-full hover:bg-white/25 transition-colors"
            >
              <MdPersonAddAlt className="text-lg" />
              Add Patient
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2   lg:grid-cols-4 gap-3">
            <StatCard
              icon={<LuStethoscope />}
              label="Total Doctors"
              value={data.stats.totalDoctors}
              sub="Active practitioners"
              gradient="linear-gradient(135deg,#60A5FA 0%,#2563EB 100%)"
            />
            <StatCard
              icon={<LuUsers />}
              label="Total Patients"
              value={data.stats.totalPatients}
              sub="Registered users"
              gradient="linear-gradient(135deg,#34D399 0%,#059669 100%)"
            />
            <StatCard
              icon={<LuUserPlus />}
              label="New Doctors"
              value={data.stats.newDoctors}
              sub="Last 7 days"
              gradient="linear-gradient(135deg,#C084FC 0%,#9333EA 100%)"
            />
            <StatCard
              icon={<LuUserPlus />}
              label="New Patients"
              value={data.stats.newPatients}
              sub="Last 7 days"
              gradient="linear-gradient(135deg,#FB923C 0%,#EA580C 100%)"
            />
          </div>
        </div>
      </div>

      {/* ══ Recent Doctors + Recent Patients ════════════════════ */}
      <div className="grid grid-cols-1 p-5   lg:grid-cols-2 gap-8">

        {/* ── Recent Doctors ── */}
        <div className="bg-white  rounded-[16px] p-5 min-h-[280px] flex flex-col shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-bold text-black-main-text">Recent Doctors</h2>
            <button
              className="text-[12px] font-semibold text-[#333CF5] hover:underline bg-white  border-none cursor-pointer"
              onClick={() => navigate('/admin/doctor-management')}
            >
              View All
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col">{[1, 2, 3].map(i => <Skeleton key={i} />)}</div>
          ) : data.doctors.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-6">
              <div className="w-12 h-12 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#8EC5FF] text-2xl">
                <LuUserX />
              </div>
              <h3 className="text-[13px] font-semibold text-black-main-text">No Doctors Added Yet</h3>
              <p className="text-[12px] text-gray-500 max-w-[220px]">
                Start building your medical team by adding doctors to the PulseX platform.
              </p>
              <button
                onClick={() => navigate('/admin/AddDoctorBtn')}
                className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold bg-[#333CF5] text-white rounded-[10px] hover:bg-[#0913C3] transition-colors"
              >
                <MdPersonAddAlt /> Add First Doctor
              </button>
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-gray-200/60 list-none p-0 m-0">
              {data.doctors.map(doc => (
                <li key={doc.id} className="flex items-center justify-between py-3 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={doc.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=EFF6FF&color=155DFC`}
                      alt={doc.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-100"
                    />
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-black-main-text truncate">{doc.name}</p>
                      <p className="text-[11px] text-gray-text-dim2 truncate">{doc.email}</p>
                    </div>
                  </div>
                  <button
                    className="shrink-0 px-3 py-1.5 text-[11px] font-semibold text-[#333CF5] rounded-[8px] hover:transition-colors border-none cursor-pointer"
                    onClick={() => navigate(`/admin/edit-doctor/${doc.id}`)}
                  >
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Recent Patients ── */}
        <div className="bg-white  rounded-[16px] p-5 min-h-[280px] flex flex-col shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-bold text-black-main-text">Recent Patients</h2>
            <button
              className="text-[12px] font-semibold text-[#333CF5] hover:underline bg-white border-none cursor-pointer"
              onClick={() => navigate('/admin/patient-management')}
            >
              View All
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col">{[1, 2, 3].map(i => <Skeleton key={i} />)}</div>
          ) : data.patients.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-6">
              <div className="w-12 h-12 rounded-full bg-[#F0FDF4] flex items-center justify-center text-[#00A63E] text-2xl">
                <LuUsers />
              </div>
              <h3 className="text-[13px] font-semibold text-black-main-text">No Patients Registered</h3>
              <p className="text-[12px] text-gray-500 max-w-[220px]">
                Your patient list is empty. Start by adding patients to the PulseX platform.
              </p>
              <button
                onClick={() => navigate('/admin/AddPatientBtn')}
                className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold bg-[#059669] text-white rounded-[10px] hover:bg-[#047857] transition-colors"
              >
                <MdPersonAddAlt /> Add First Patient
              </button>
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-gray-200/60 list-none p-0 m-0">
              {data.patients.map(p => (
                <li key={p.id} className="flex items-center justify-between py-3 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=F0FDF4&color=059669`}
                      alt={p.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-100"
                    />
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-black-main-text truncate">{p.name}</p>
                      <p className="text-[11px] text-gray-text-dim2 truncate">{p.email}</p>
                    </div>
                  </div>
                  <button
                    className="shrink-0 px-3 py-1.5 text-[11px] font-semibold text-[#333CF5] rounded-[8px] hover: border-none cursor-pointer"
                    onClick={() => navigate(`/admin/edit-patient/${p.id}`)}
                  >
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </section>
  );
}
