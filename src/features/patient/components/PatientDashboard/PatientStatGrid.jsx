import React from 'react';
import { FaHeartPulse } from 'react-icons/fa6';
import {
  HiOutlineBeaker,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
} from 'react-icons/hi2';
import { TbDroplet, TbLungs } from 'react-icons/tb';
import Heart from '../../../../assets/Images/PatiantHeart.svg'
/* ─── Single std ──────────────────────────── */
const StatCard = ({ label, value, unit, status, trend, gradientFrom, gradientTo, icon }) => {
  const isUp   = trend && trend.startsWith('+');
  const isDown = trend && trend.startsWith('-');

  return (
    <div className="relative bg-white rounded-[16px] border border-gray-100 shadow-sm overflow-hidden flex flex-col gap-1 p-4 pt-5">
      {/* Colour strip */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-[16px]"
        style={{ background: `linear-gradient(160deg, ${gradientFrom} 0%, ${gradientTo} 100%)` }}
      />
      {/* Icon bubble */}
      <div
        className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[18px] mb-1 shrink-0"
        style={{ background: `${gradientFrom}18`, color: gradientFrom }}
      >
        {icon}
      </div>
      {/* Value */}
      <div className="flex items-baseline gap-1">
        <span className="text-[22px] font-extrabold text-black-main-text leading-none">{value}</span>
        <span className="text-[11px] font-semibold text-gray-400">{unit}</span>
      </div>
      {/* Label */}
      <p className="text-[12px] font-semibold text-gray-500">{label}</p>
      {/* Status + trend */}
      <div className="flex items-center justify-between mt-1">
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: `${gradientFrom}15`, color: gradientFrom }}
        >{status}</span>
        {trend && trend !== '0' && (
          <span
            className="flex items-center gap-0.5 text-[11px] font-semibold"
            style={{ color: isDown ? '#F59E0B' : '#00A63E' }}
          >
            {isUp
              ? <HiOutlineArrowTrendingUp className="text-[13px]" />
              : <HiOutlineArrowTrendingDown className="text-[13px]" />
            }
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

/* ─── Grid ──────────────────────────────────────── */
const PatientStatGrid = ({ vitals }) => {
  if (!vitals) return null;

  const cards = [
    { label: 'Heart Rate',     value: vitals.heartRate.value,        unit: vitals.heartRate.unit,        status: vitals.heartRate.status,        trend: vitals.heartRate.trend,        gradientFrom: vitals.heartRate.gradientFrom,        gradientTo: vitals.heartRate.gradientTo,        icon: <img src={Heart} alt="Heart" className="w-5 h-5" /> },
    { label: 'Blood Pressure', value: vitals.bloodPressure.display,  unit: vitals.bloodPressure.unit,    status: vitals.bloodPressure.status,    trend: vitals.bloodPressure.trend,    gradientFrom: vitals.bloodPressure.gradientFrom,    gradientTo: vitals.bloodPressure.gradientTo,    icon: <TbDroplet /> },
    { label: 'Blood Sugar',    value: vitals.bloodSugar.value,       unit: vitals.bloodSugar.unit,       status: vitals.bloodSugar.status,       trend: vitals.bloodSugar.trend,       gradientFrom: vitals.bloodSugar.gradientFrom,       gradientTo: vitals.bloodSugar.gradientTo,       icon: <HiOutlineBeaker /> },
    { label: 'Oxygen Level',   value: vitals.oxygenLevel.value,      unit: vitals.oxygenLevel.unit,      status: vitals.oxygenLevel.status,      trend: vitals.oxygenLevel.trend,      gradientFrom: vitals.oxygenLevel.gradientFrom,      gradientTo: vitals.oxygenLevel.gradientTo,      icon: <TbLungs /> },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
};

export default PatientStatGrid;
