import React from 'react';
import { useNavigate } from 'react-router-dom';
import usePatientData from '../../../../PatientHooks/usePatientData';
import PatientWeeklyChart from '../../components/PatientDashboard/PatientWeeklyChart';
import { FaHeartPulse, FaBrain } from 'react-icons/fa6';
import {
  HiOutlineCalendarDays,
  HiOutlineLightBulb,
  HiOutlineExclamationTriangle,
  HiOutlineArrowRight,
  HiOutlineClipboardDocumentCheck,
  HiOutlineSparkles,
} from 'react-icons/hi2';
import { TbDroplet } from 'react-icons/tb';
import { HiOutlineBeaker } from 'react-icons/hi';
import { MdOutlineStar, MdOutlineStarBorder } from 'react-icons/md';
import Heart from '../../../../assets/Images/PatiantHeart.svg'
import noIcon from "../../../../assets/Images/no.svg";
import yesIcon from '../../../../assets/Images/yes.svg'
import { LuUtensils, LuActivity, LuMoon, LuGlassWater, LuStethoscope } from 'react-icons/lu';

/* ── Mini chart paths ── */
const BLOOD_PRESSURE_PATH = "M0,22 C8,22 12,8 20,12 C30,17 34,26 44,14 C52,5 56,18 60,18 L60,30 L0,30 Z";
const BLOOD_SUGAR_PATH    = "M0,24 C8,24 12,14 20,16 C28,18 32,8 42,10 C50,12 56,20 60,18 L60,30 L0,30 Z";
const BLOOD_COUNT_PATH    = "M0,20 C8,20 14,10 24,12 C34,14 38,22 48,16 C54,12 57,16 60,16 L60,30 L0,30 Z";
const getRecommendationIcon = (text) => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('eat') || lowerText.includes('greens') || lowerText.includes('diet')) 
    return <LuUtensils className="text-emerald-500" size={14} />;
  if (lowerText.includes('walk') || lowerText.includes('exercise') || lowerText.includes('mins')) 
    return <LuActivity className="text-blue-500" size={14} />;
  if (lowerText.includes('sleep') || lowerText.includes('rest')) 
    return <LuMoon className="text-indigo-500" size={14} />;
  if (lowerText.includes('water') || lowerText.includes('caffeine') || lowerText.includes('drink')) 
    return <LuGlassWater className="text-cyan-500" size={14} />;
  
  // أيقونة افتراضية لو مفيش كلمة مطابقة
  return <LuStethoscope className="text-rose-500" size={14} />;
};
const MiniChart = ({ path, color, gradId }) => (
  <svg className="w-full h-[30px]" viewBox="0 0 60 30" preserveAspectRatio="none">
    <defs>
      <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor={color} stopOpacity="0.35" />
        <stop offset="100%" stopColor={color} stopOpacity="0"    />
      </linearGradient>
    </defs>
    <path d={path} stroke={color} strokeWidth="1.8" fill={`url(#${gradId})`} />
  </svg>
);

/* ── Stat Card (بدون أي تعديل في الستايل كما طلبت) ── */
const StatCard = ({ label, value, unit, status, isHeartRate, isLow, chartSlot, icon }) => (
  <div 
    className={`relative w-full rounded-[24px] overflow-hidden shadow-xl flex flex-col justify-between p-4 ${isHeartRate ? 'text-white' : 'bg-white border border-gray-100 shadow-sm'}`}
    style={isHeartRate ? { background: 'linear-gradient(180deg, #333CF5 0%, #0913C3 100%)' } : {}}
  >
    {isHeartRate ? (
      <>
        <div className="flex justify-between items-start">
          <h2 className="text-[20px] font-bold tracking-tight">{label}</h2>
          <img src={Heart} alt="heart" className="w-14 h-14 object-contain -mt-1 -mr-1" />
        </div>
        <div className="flex items-end justify-between relative">
          <div className="z-10">
            <div className="flex items-baseline gap-1">
              <span className="text-[18px] font-bold leading-none">{value}</span>
              <span className="text-[16px]">{unit}</span>
            </div>
            <p className="text-[16px] mt-1">{status}</p>
          </div>
          <img src={'/Images/yes.svg'} alt="wave" className="absolute -bottom-1 -right-4 w-[65%] h-auto pointer-events-none" />
        </div>
      </>
    ) : (
      <>
        <div className="flex justify-between items-start">
          <p className="tracking-tight text-base font-normal text-black-main-text">{label}</p>
          {icon && <span className="text-black-main-text text-[24px] -mt-1 -mr-1">{icon}</span>}
        </div>
        <div className="flex items-end justify-between relative">
          <div className="z-10">
            <div className="flex items-baseline gap-1">
              <span className="leading-none text-base font-bold font-['Poppins'] text-black-main-text">{value}</span>
              <span className="text-sm font-normal font-['Poppins'] text-[#757575]">{unit}</span>
            </div>
            <div className="mt-2">
              <span className="text-xs font-normal font-['Roboto'] px-3 py-1 rounded-full inline-block"
                style={{ color: isLow ? '#6D0C0C' : '#0C6D31', background: isLow ? '#F7E8E8' : '#E8F7EE' }}>
                {status}
              </span>
            </div>
          </div>
          {chartSlot && (
            <div className="absolute -bottom-6 right-2 w-[60%] h-auto pointer-events-none overflow-visible">
              <img src={isLow ? "/Images/no.svg" : "/Images/yes.svg"} alt="wave" className="absolute bottom-5 -right-4 w-full h-auto pointer-events-none" />
            </div>
          )}
        </div>
      </>
    )}
  </div>
);

const Stars = ({ count }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => i <= count
      ? <MdOutlineStar key={i} className="text-[#F59E0B] text-[13px]" />
      : <MdOutlineStarBorder key={i} className="text-gray-300 text-[13px]" />
    )}
  </div>
);

const HealthSummaryRing = ({ score, color }) => {
  const size = 100;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full shadow-md" style={{ background: '#F7F7F7' }} />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F7F7F7" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[18px] font-semibold text-[#010218]">{score}%</span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   PatientDashboard Component
═══════════════════════════════════════════ */
const PatientDashboard = () => {
  const { patient, isLoading, hasVitals } = usePatientData();
  const navigate = useNavigate();

  if (isLoading) return <div className="text-center py-20 text-[#155dfc] font-bold">Loading...</div>;

  const v = patient.vitals;

  return (
    <section className="flex flex-col gap-6 p-4 md:p-6 bg-[#FAFBFF] min-h-screen">
      
      {/* Welcome Header */}
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-black-main-text leading-tight">Welcome Back, {patient.name} 👋</h2>
        <p className="text-sm text-gray-500">Here's an overview of your current heart health status.</p>
      </div>

      {/* ROW 1: 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Heart Rate" value={v.heartRate.value} unit="bpm" status="Normal" isHeartRate />
        <StatCard label="Blood Pressure" value={v.bloodPressure.display} unit="mmHg" status={v.bloodPressure.status} isLow icon={<TbDroplet />} chartSlot={<MiniChart path={BLOOD_PRESSURE_PATH} color="#F23985" gradId="bpGrad" />} />
        <StatCard label="Blood Sugar" value={v.bloodSugar.value} unit="mg/dl" status={v.bloodSugar.status} icon={<HiOutlineBeaker />} chartSlot={<MiniChart path={BLOOD_SUGAR_PATH} color="#00DEA3" gradId="bsGrad" />} />
        <StatCard label="Blood Count" value={v.bloodCount?.value ?? 40} unit="g/dl" status={v.bloodCount?.status ?? 'Normal'} icon={<FaHeartPulse />} chartSlot={<MiniChart path={BLOOD_COUNT_PATH} color="#00DEA3" gradId="bcGrad" />} />
      </div>

      {/* Main Layout: Chart + Cards (Left) | Summary + Recs (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Column (8 units on XL) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          
          {/* Weekly Chart */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-50 overflow-hidden">
             <PatientWeeklyChart weeklyData={patient.weeklyData} />
          </div>

{/* QR/AI Cards & Doctors List Row */}

{/* QR/AI Cards & Doctors List Row */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  
  {/* Left Column: QR + AI + Accuracy (Small Cards) */}
  <div className="lg:col-span-1 flex flex-col gap-3">
    
    {/* 1. QR Code Card */}
    <div 
      onClick={() => navigate('/patient/qr')} 
      className="flex flex-col gap-2 p-4 bg-slate-400 rounded-[24px] cursor-pointer hover:opacity-90 transition-all shadow-sm"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-yellow-400 rounded-lg shrink-0">
            <FaHeartPulse className="text-white text-[12px]"/>
          </div>
          <p className="text-[13px] font-bold text-white leading-tight">QR Code</p>
        </div>
        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
          <HiOutlineArrowRight size={12} className="text-slate-500 -rotate-45" />
        </div>
      </div>
      <div className="pl-8">
        <p className="text-[10px] text-[#F1F1F1] font-medium leading-tight opacity-90">
          Quick access to your medical records
        </p>
      </div>
    </div>

    {/* 2. AI Model Card (Matching QR Style Exactly) */}
    <div 
      className="flex flex-col gap-2 self-stretch px-4 py-3 bg-gradient-to-b from-[#5A8169] to-[#20E56F] rounded-[24px] shadow-sm relative overflow-hidden"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          {/* أيقونة العقل في بوكس زي الـ QR */}
          <div className="p-1.5 bg-emerald-500 rounded-lg shrink-0 shadow-sm">
            <FaBrain className="text-white text-[12px]"/>
          </div>
          <p className="text-[13px] font-bold text-white leading-tight">AI Model: Active</p>
        </div>
        {/* لمبة صغيرة تدل على العمل (Status) */}
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
      </div>
      <div className="pl-8">
        <p className="text-[10px] text-[#F1F1F1] font-medium leading-tight opacity-90">
          Heart risk analysis is working fine
        </p>
      </div>
    </div>

    {/* 3. Accuracy Bar */}
    <div className=" space-y-2">
     
      <div className="w-full h-4 bg-[#75757566] rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-brand-main to-brand-dark " style={{ width: '98%' }} />
      </div>
       <div className="flex justify-between text-black-main-tex items-center">
         <span className="text-[11px] font-bold ">⚙️ Accuracy : 98 %</span>
        
      </div>
    </div>
  </div>

  {/* Right Column: Doctors List (Double Width, Vertical List) */}
  <div className="lg:col-span-2 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-[15px] font-bold text-black-main-text tracking-tight">Doctors List</h3>
      <button onClick={() => navigate('/patient/doctors')} className="text-[11px] font-bold text-black-main-text hover:underline flex items-center gap-1">
        View More <HiOutlineArrowRight size={12}/>
      </button>
    </div>
    
    {/* القائمة تحت بعضها (Vertical) */}
    <div className="flex flex-col gap-2">
      {patient.featuredDoctors.slice(0, 3).map(doc => (
        <div key={doc.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-50">
          <div className="relative">
            <img src={doc.img} alt={doc.name} className="w-11 h-11 rounded-full object-cover shadow-sm ring-2 ring-white" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-black-main-text group-hover:text-blue-600 transition-colors">{doc.name}</p>
            <p className="text-[11px] text-[#75757566] font-medium">{doc.location}</p>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <Stars count={doc.rating} />
         </div>
        </div>
      ))}
    </div>
  </div>

</div></div>

        {/* Right Column (4 units on XL) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          
          {/* Health Summary Card */}
      {/* Health Summary Card - Exact Style */}
<div className="bg-white rounded-[32px] shadow-[0px_8px_24px_rgba(0,0,0,0.05)] border border-gray-100 p-5 md:p-6 flex items-center justify-between gap-4 transition-all hover:shadow-lg">
  
  {/* Left Content */}
  <div className="flex flex-col gap-3 flex-1">
    <h3 className="text-[12px] md:text-[18px] font-bold text-black-main-text tracking-tight">
      Health Summary
    </h3>
    
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-[12px] md:text-[14px] font-semibold text-black-main-text">
          Ai Risk Score
        </span>
        {/* Risk Badge */}
        <span className="px-1.5 py-0.5 bg-[#E8F7EE] text-[#0C6D31] rounded-full text-[8px] tracking-wider border border-[#E8F7EE]">
          {patient.aiRisk?.level || 'Low'} Risk
        </span>
      </div>
      
      <p className="text-[11px] md:text-[12px] text-[#757575] leading-relaxed max-w-[180px]">
        Your heart condition is stable. <br className="hidden sm:block" />
        Keep following your daily plan.
      </p>
    </div>
  </div>

  {/* Right Content: Ring Chart */}
  <div className="shrink-0 scale-90 md:scale-100">
    <HealthSummaryRing 
      score={patient.aiRisk?.score || 95} 
      color="#333CF5" 
    />
  </div>
</div>

          {/* Smart Recommendations Card */}
         <div className="bg-white rounded-[32px] shadow-[0px_8px_24px_rgba(0,0,0,0.05)] border border-gray-100 p-5 flex flex-col gap-4">
  
  {/* Header */}
  <div className="flex items-center gap-2">
 
    <h3 className="text-[16px] font-bold text-black-main-text tracking-tight">
      Smart Recommendation
    </h3>
  </div>

  {/* List */}
  <div className="flex flex-col gap-2">
    {['Eat more leafy greens', 'Walk 30 mins daily', 'Reduce caffeine intake'].map((rec, i) => (
      <div 
        key={i} 
        className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8FAFF] border border-transparent hover:border-blue-100 hover:bg-white transition-all group"
      >
        <div className="shrink-0 group-hover:scale-110 transition-transform">
          {getRecommendationIcon(rec)}
        </div>
        
        <p className="text-[11px] md:text-[12px] text-[#010218B2] font-semibold leading-tight">
          {rec}
        </p>
      </div>
    ))}
  </div>
</div>
{/* Upcoming Appointments Card */}
<div className="bg-white rounded-[32px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)] outline outline-[0.6px] outline-zinc-200 px-6 py-5 flex flex-col gap-4 overflow-hidden">
  
  {/* Header: Title + Link */}
  <div className="flex items-center justify-between border-b border-gray-50 pb-3">
    <h3 className="text-black-main-text text-[14px] font-semibold font-['Roboto'] tracking-tight">
      Upcoming Appointments
    </h3>
    <button 
      onClick={() => navigate('/patient/appointments')}
      className="text-black-main-text text-[12px] font-medium hover:underline flex items-center gap-1"
    >
      View More <HiOutlineArrowRight size={10} />
    </button>
  </div>

  {/* Appointments List */}
  <div className="flex flex-col gap-4">
    {patient.appointments?.length > 0 ? (
      patient.appointments.slice(0, 2).map((apt) => (
        <div 
          key={apt.id} 
          className="flex items-center justify-between rounded-2xl bg-[#F8FAFF] border border-blue-50/50 hover:bg-[#F0F4FF] transition-colors"
        >
          <div className="flex items-center gap-3">
            {/* Doctor Image or Placeholder */}
            <div className="relative">
              <img 
                src={apt.img} 
                alt={apt.doctor} 
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            
            <div className="flex flex-col">
              <p className="text-black-main-text text-[13px] font-bold leading-tight">
                {apt.doctor}
              </p>
              <p className="text-neutral-400 text-[11px] font-normal mt-0.5">
                {apt.location}
              </p>
            </div>
          </div>

          <div className="text-right flex flex-col items-end gap-1">
            <span className="px-2 py-0.5 text-black-main-text text-[10px] font-bold rounded-md">
              {apt.time}
            </span>
            <p className="text-neutral-500 text-[10px] font-medium">
              {apt.date}
            </p>
          </div>
        </div>
      ))
    ) : (
      <div className="flex flex-col items-center py-4 text-center">
        <HiOutlineCalendarDays className="text-blue-200 text-3xl mb-2" />
        <p className="text-gray-400 text-[12px]">No upcoming appointments</p>
      </div>
    )}
  </div>
</div>

        </div>
      </div>
    </section>
  );
};

export default PatientDashboard;