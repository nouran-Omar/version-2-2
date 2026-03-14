import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuSearch } from 'react-icons/lu';
import { MdOutlineMonitorHeart, MdOutlineSettingsInputAntenna } from 'react-icons/md';
import { LuCloudUpload, LuCircleCheck } from 'react-icons/lu';
import { HiOutlineXMark } from 'react-icons/hi2';
import { LuTriangleAlert } from 'react-icons/lu';
import { IoSearchOutline } from 'react-icons/io5';

/* ─── Upload Card ─── */
const UploadCard = ({ title, desc, Icon, onUpload }) => {
  const [file, setFile] = useState(null);
  const fileRef = React.useRef(null);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 p-4 transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-main flex items-center justify-center shrink-0">
          <Icon className="text-white text-xl" />
        </div>
        <div>
          <p className="text-[18px] font-bold text-black-main-text">{title}</p>
          <p className="text-[14px] text-[#757575]">{desc}</p>
        </div>
      </div>

      <div
        onClick={() => fileRef.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border border-[#E5E7EB] rounded-xl bg-white h-[140px] flex flex-col items-center justify-center cursor-pointer hover:border-brand-main transition"
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
          style={{ background: 'linear-gradient(135deg, #DBEAFE 0%, #BEDBFF 100%)' }}
        >
          <LuCloudUpload className="text-[#155DFC] text-xl" />
        </div>
        <p className="text-xs text-[#364153]">
          Drag & drop {title} files or{' '}
          <span className="text-[#155DFC] font-semibold cursor-pointer">Browse</span>
        </p>
        <p className="text-[10px] text-gray-text-dim2 mt-1">Supported formats: JPEG, PNG</p>
        <input type="file" ref={fileRef} hidden onChange={handleFile} accept="image/*,.pdf" />
      </div>

      {file && (
        <div className="flex items-center gap-3 bg-[#F9FAFB] rounded-xl px-4 py-4 border border-[#E5E7EB] animate-fade-in-up">
          <div className='bg-[#DCFCE7] p-2 rounded-lg '>
            <LuCircleCheck className="text-[#00A63E] text-lg shrink-0" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-black-main-text truncate">{file.name}</p>
            <p className="text-[10px] text-[#757575]">{(file.size / 1024).toFixed(2)} KB</p>
          </div>
          <button onClick={() => setFile(null)} className="text-gray-400 cursor-pointer hover:text-red-500 transition">
            <HiOutlineXMark className="text-base" />
          </button>
        </div>
      )}

      <button
        disabled={!file}
        onClick={() => file && onUpload(file)}
        className={`w-full py-2.5 cursor-pointer rounded-xl text-sm font-semibold transition
          ${file
            ? 'bg-brand-main text-white hover:bg-[#2730d4] shadow-sm'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
      >
        Upload
      </button>
    </div>
  );
};

/* ─── Gauge ─── */
const RiskGauge = ({ percentage = 84 }) => {
  const clamp = Math.min(100, Math.max(0, percentage));
  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <div className="relative w-[180px] h-[100px]">
        <svg viewBox="0 0 180 100" className="w-full h-full" overflow="visible">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0913C3" />
              <stop offset="100%" stopColor="#333CF5" />
            </linearGradient>
          </defs>
          <path d="M 10 90 A 80 80 0 0 1 170 90" fill="none" stroke="#E5E7EB" strokeWidth="14" strokeLinecap="round" />
          <path
            d="M 10 90 A 80 80 0 0 1 170 90"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${(clamp / 100) * 251.2} 251.2`}
            className="transition-all duration-1000 delay-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-end justify-center pb-1">
          <span className="text-2xl font-bold text-black-main-text">{clamp}%</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <LuTriangleAlert className="text-lg text-[#F0B100]" />
        <span className="text-sm font-semibold text-black-main-text">
          {clamp >= 70 ? 'High Risk' : clamp >= 40 ? 'Moderate Risk' : 'Low Risk'}
        </span>
      </div>
    </div>
  );
};

/* ─── Critical Alert ─── */
const CriticalAlert = ({ onFindDoctors }) => (
  <div className="rounded-2xl flex flex-col items-center text-center gap-3 p-6 border border-[#ffc9c9]"
    style={{ background: 'linear-gradient(135deg, #FEF2F2 0%, #FFF7ED 100%)' }}
  >
    <div className="w-10 h-10 rounded-full bg-[#FFE2E2] flex items-center justify-center">
      <LuTriangleAlert className="text-[#E7000B] text-xl" />
    </div>
    <h3 className="text-base font-bold text-black-main-text">Critical Alert: Medical Consultation Recommended</h3>
    <p className="text-sm text-[#364153] max-w-sm w-full leading-relaxed">
      Based on our AI analysis of your uploaded X-rays, we have detected indicators that require
      immediate medical attention. Your health is our priority; we have curated a list of top
      cardiologists available on PulseX to help you right now.
    </p>
    <button
      onClick={onFindDoctors}
      className="flex items-center gap-2 px-5 py-2.5 cursor-pointer rounded-full bg-brand-main text-white text-sm font-semibold hover:bg-[#2730d4] transition mt-1"
    >
      Find Doctors <IoSearchOutline className="text-base" />
    </button>
  </div>
);

/* ─── Main Page ─── */
const PatientHeartRisk = () => {
  const navigate = useNavigate();
  const [ecgUploaded, setEcgUploaded] = useState(false);
  const [radiologyUploaded, setRadiologyUploaded] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const anyUploaded = ecgUploaded || radiologyUploaded;
  const mockResult = { percentage: 84, level: 'high' };

  return (
    <div className="min-h-screen p-[24px]">
      <style>{`
        /* أنيميشن جديد: ظهور تدريجي مع حركة للأعلى */
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* الكلاس الأساسي للأنيميشن */
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out both;
        }

        /* Delay للزرار أول ما يظهر */
        .delay-button {
          animation-delay: 0.4s;
        }

        /* Delay للنتيجة الأولى (الجيدج) */
        .delay-gauge {
          animation-delay: 0.3s;
        }

        /* Delay للتنبيه اللي تحت النتيجة */
        .delay-alert {
          animation-delay: 0.7s;
        }
      `}</style>

      {/* ── Header ── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <LuSearch className="text-[28px] text-black-main-text" />
          <h1 className="text-[24px] font-bold text-black-main-text">Heart Risk Assessment</h1>
        </div>
        <p className="text-[18px] text-[#757575]">Upload and view your medical health easily.</p>
      </div>

      {/* ── Upload Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
        <UploadCard
          title="ECG"
          desc="Keep track of your latest ECG results (Optional)."
          Icon={MdOutlineMonitorHeart}
          onUpload={() => setEcgUploaded(true)}
        />
        <UploadCard
          title="Radiology"
          desc="Upload your X-rays or CT (Optional)."
          Icon={MdOutlineSettingsInputAntenna}
          onUpload={() => setRadiologyUploaded(true)}
        />
      </div>

      {/* ── View Result Button ── */}
      {anyUploaded && !showResult && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setShowResult(true)}
            className="animate-view-result delay-button flex items-center gap-2 px-8 py-5 rounded-full text-white text-[14px] cursor-pointer font-semibold shadow-lg transition hover:opacity-90 hover:scale-105 active:scale-95 animate-fade-in-up"
            style={{ background: 'linear-gradient(90deg, #0913C3 0%, #FF0000 100%)' }}
          >
            <span>🚀</span> View Result
          </button>
        </div>
      )}

      {/* ── Result Container ── */}
      {showResult && (
        <div className="max-w-[775px] w-full mx-auto flex flex-col gap-5 mt-8 transition-all duration-500">
          
          {/* Gauge card - تظهر أولاً بعد الضغط */}
          <div className="animate-fade-in-up delay-gauge bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 mb-10">
            <RiskGauge percentage={mockResult.percentage} />
          </div>

          {/* Critical alert - تظهر بتأخير بسيط بعد الـ Gauge */}
          {mockResult.level === 'high' && (
            <div className="animate-fade-in-up delay-alert">
              <CriticalAlert onFindDoctors={() => navigate('/patient/doctors')} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientHeartRisk;