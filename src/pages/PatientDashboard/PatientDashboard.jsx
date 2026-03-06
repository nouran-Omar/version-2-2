import React from 'react';
import usePatientData from '../../PatientHooks/usePatientData';
import PatientStatGrid from '../../components/PatientDashboard/PatientStatGrid';
import PatientWeeklyChart from '../../components/PatientDashboard/PatientWeeklyChart';
import PatientSummaryCard from '../../components/PatientDashboard/PatientSummaryCard';
import PatientChatbot from '../../components/PatientChatbot/PatientChatbot';
import { HiOutlineCalendarDays, HiOutlineClipboardDocumentCheck } from 'react-icons/hi2';
import { FaHeartPulse } from 'react-icons/fa6';

/* ─────────────────────────────────────────────────────
   PatientDashboard Page
   Route: /patient/dashboard  (rendered inside PatientMainLayout)
───────────────────────────────────────────────────── */
const PatientDashboard = () => {
  const { patient, isLoading } = usePatientData();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-[#155dfc] text-[14px] font-semibold">
        <FaHeartPulse className="text-[40px] animate-[heartbeat_1s_ease-in-out_infinite]" />
        <p>Loading your health data…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── Welcome Banner ── */}
      <div
        className="flex items-center justify-between flex-wrap gap-4 px-6 py-5 rounded-[20px] text-white shadow-[0_6px_24px_rgba(21,93,252,0.3)]"
        style={{ background: 'linear-gradient(135deg, #155dfc 0%, #4a7fff 60%, #7aa8ff 100%)' }}
      >
        <div className="flex items-center gap-4">
          <FaHeartPulse className="text-[38px] text-white/85 shrink-0" />
          <div>
            <h2 className="text-[18px] font-bold text-white m-0">
              Welcome back, <span className="font-extrabold">{patient.name}</span>
            </h2>
            <p className="text-[12px] text-white/70 mt-1">
              {patient.lastUpdated} &nbsp;·&nbsp; Last updated: today
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[20px] bg-white/20 border border-white/30 text-[12px] text-white backdrop-blur-sm">
            <HiOutlineCalendarDays />
            <span>Blood Type: <strong>{patient.bloodType}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[20px] bg-white/20 border border-white/30 text-[12px] text-white backdrop-blur-sm">
            <HiOutlineClipboardDocumentCheck />
            <span>ID: <strong>{patient.id}</strong></span>
          </div>
        </div>
      </div>

      {/* ── Vital Signs ── */}
      <section className="flex flex-col gap-3.5">
        <div className="flex items-center gap-2.5">
          <h3 className="text-[15px] font-bold text-black-main-text m-0">Vital Signs</h3>
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-[20px] bg-green-50 text-green-600 text-[11px] font-bold before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-green-500 before:animate-pulse">
            Live
          </span>
        </div>
        <PatientStatGrid vitals={patient.vitals} />
      </section>

      {/* ── Chart + Summary ── */}
      <section className="flex flex-col gap-3.5">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-4 items-stretch">
          <div className="min-w-0">
            <PatientWeeklyChart weeklyData={patient.weeklyData} />
          </div>
          <div className="min-w-0">
            <PatientSummaryCard aiRisk={patient.aiRisk} />
          </div>
        </div>
      </section>

      {/* ── Upcoming Appointments ── */}
      <section className="flex flex-col gap-3.5">
        <h3 className="text-[15px] font-bold text-black-main-text m-0">Upcoming Appointments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {patient.appointments.map((apt) => (
            <div
              key={apt.id}
              className="flex items-center gap-3.5 px-5 py-4 bg-white rounded-[18px] border border-gray-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all"
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white text-[18px] font-bold shrink-0 shadow-[0_4px_12px_rgba(21,93,252,0.3)]"
                style={{ background: 'linear-gradient(135deg, #155dfc 0%, #4a7fff 100%)' }}
              >
                {apt.doctor.charAt(apt.doctor.indexOf(' ') + 1)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-black-main-text m-0 truncate">{apt.doctor}</p>
                <p className="text-[12px] text-gray-500 m-0 mb-1.5">{apt.specialty}</p>
                <p className="flex items-center gap-1.5 text-[12px] text-gray-400 m-0">
                  <HiOutlineCalendarDays />
                  {apt.date} &nbsp;·&nbsp; {apt.time}
                </p>
              </div>
              <span
                className="px-3 py-1 rounded-[20px] text-[11px] font-bold whitespace-nowrap shrink-0"
                style={{
                  background: apt.status === 'Confirmed' ? '#00A63E18' : '#F59E0B18',
                  color: apt.status === 'Confirmed' ? '#00A63E' : '#F59E0B',
                }}
              >
                {apt.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Floating Chatbot ── */}
      <PatientChatbot />
    </div>
  );
};

export default PatientDashboard;

