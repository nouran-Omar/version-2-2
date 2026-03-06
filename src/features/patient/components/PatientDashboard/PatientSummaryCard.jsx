import React from 'react';
import { HiOutlineSparkles, HiOutlineCheckCircle } from 'react-icons/hi2';
import { FaHeartPulse } from 'react-icons/fa6';

/* ─── Radial progress ring ───────────────────────── */
const RiskRing = ({ score, color }) => {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const filled = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-[110px] h-[110px] shrink-0">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={radius} fill="none" stroke="#f1f3f5" strokeWidth="8" />
        <circle cx="55" cy="55" r={radius} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={filled} transform="rotate(-90 55 55)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[18px] font-extrabold leading-none" style={{ color }}>{score}%</span>
        <span className="text-[10px] font-semibold text-gray-400 mt-0.5">Risk</span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────── */
const PatientSummaryCard = ({ aiRisk }) => {
  if (!aiRisk) return null;

  return (
    <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[18px] bg-[#155dfc0d] text-[#155dfc]">
            <HiOutlineSparkles />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-black-main-text">AI Risk Score</h3>
            <p className="text-[11px] text-gray-400">Powered by PulseX Intelligence</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: aiRisk.color + '15', color: aiRisk.color }}>
          <FaHeartPulse />{aiRisk.level} Risk
        </span>
      </div>

      {/* Body */}
      <div className="flex items-center gap-5">
        <RiskRing score={aiRisk.score} color={aiRisk.color} />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold text-black-main-text mb-2">Smart Recommendations</p>
          <ul className="flex flex-col gap-1.5 list-none p-0 m-0">
            {aiRisk.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px] text-gray-600">
                <HiOutlineCheckCircle className="text-[14px] shrink-0 mt-0.5" style={{ color: aiRisk.color }} />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PatientSummaryCard;
