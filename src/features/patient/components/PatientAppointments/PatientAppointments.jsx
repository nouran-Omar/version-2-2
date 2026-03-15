import React, { useState } from 'react';
import {
  HiOutlineCalendarDays,
  HiOutlineCheckBadge,
  HiOutlineMapPin,
  HiOutlineBanknotes,
  HiOutlineXCircle,
} from 'react-icons/hi2';
import { MdOutlineEventNote } from 'react-icons/md';
import { GiCheckMark } from 'react-icons/gi';
import ConfirmModal from '../../../admin/components/ConfirmModal/ConfirmModal';
import SuccessPopup  from '../../../admin/components/SuccessPopup/SuccessPopup';
import { LuCalendarClock } from "react-icons/lu";
const INIT_APPOINTMENTS = [
  { id: 1, doc: 'Dr. Jehan Osama',  date: '22 Oct 2025', time: '03:30 PM', method: 'Cash at Clinic',  loc: 'Cairo Heart Center',   status: 'Upcoming',  img: 'https://images.unsplash.com/photo-1559839734-2b71f1536780?w=200&q=80' },
  { id: 2, doc: 'Dr. Ahmed Hassan', date: '25 Oct 2025', time: '10:00 AM', method: 'Online Payment',  loc: 'Medical City Hospital', status: 'Upcoming',  img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&q=80' },
  { id: 3, doc: 'Dr. Noha Mohamed', date: '28 Oct 2025', time: '02:15 PM', method: 'Online Payment',  loc: 'Skin Care Clinic',      status: 'Upcoming',  img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&q=80' },
  { id: 4, doc: 'Dr. Jehan Osama',  date: '22 Oct 2025', time: '03:30 PM', method: 'Cash at Clinic',  loc: 'Cairo Heart Center',   status: 'Completed', img: 'https://images.unsplash.com/photo-1559839734-2b71f1536780?w=200&q=80' },
  { id: 5, doc: 'Dr. Ahmed Hassan', date: '22 Oct 2025', time: '03:39 PM', method: 'Online Payment',  loc: 'Medical City Hospital', status: 'Completed', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&q=80' },
  { id: 6, doc: 'Dr. Noha Mohamed', date: '22 Oct 2025', time: '03:30 PM', method: 'Online Payment',  loc: 'Care Clinic',           status: 'Completed', img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&q=80' },
];

const PatientAppointments = () => {
  const [activeTab,    setActiveTab]    = useState('upcoming');
  const [appointments, setAppointments] = useState(INIT_APPOINTMENTS);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [showSuccess,  setShowSuccess]  = useState(false);

  const upcoming  = appointments.filter(a => a.status === 'Upcoming');
  const completed = appointments.filter(a => a.status === 'Completed');
  const list      = activeTab === 'upcoming' ? upcoming : completed;

  const handleConfirmCancel = () => {
    setAppointments(prev =>
      prev.map(a => a.id === cancelTarget ? { ...a, status: 'Cancelled' } : a)
    );
    setCancelTarget(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <section className="flex flex-col gap-6 p-[24px]">
      <ConfirmModal
        isOpen={!!cancelTarget}
        title="Cancel Appointment?"
        desc="Are you sure you want to cancel this appointment? This action cannot be undone."
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelTarget(null)}
      />
     

      {/* Header */}
 <header className="flex flex-col  pb-4 mb-6">
  
  <div className="flex flex-col gap-1"> 
  {/* السطر الأول: الأيقونة + العنوان */}
  <div className="flex items-center gap-2">
    {/* حاوية الأيقونة */}
    <div className="w-10 h-10 flex items-center justify-center rounded-xl text-black-main-text text-[24px] shrink-0">
      <MdOutlineEventNote />
    </div>

    {/* العنوان H1 */}
    <h1 className="text-[24px] font-bold text-black-main-text">
      My Appointments
    </h1>
  </div>

  {/* السطر الثاني: الوصف - واخد padding-left مساوي لعرض الأيقونة + المسافة (gap) */}
  <p className="text-[18px] text-[#757575] max-w-2xl pl-[8px]">
    View your scheduled and completed appointments
  </p>
</div>
  
</header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-[20px] border border-green-100 shadow-sm p-7 flex items-center gap-4">
          <div className="w-[80px] h-[80px] rounded-full  flex items-center justify-center shrink-0"
          
          style={{background: 'linear-gradient(201deg, #D3FFE7 0%, #EFFFF6 100%)'}}
          
          >
            < LuCalendarClock className="text-[#00AC4F] text-5xl" />
          </div>
          <div>
            <p className="text-[16px] text-[#757575]">Upcoming Appointments</p>
            <h3 className="text-[32px] font-bold text-brand-main">{upcoming.length}</h3>
          </div>
        </div>
        <div className="bg-white rounded-[20px] border border-indigo-100 shadow-sm p-4 flex items-center gap-4">
          <div className="w-[80px] h-[80px] rounded-full bg-indigo-50 flex items-center justify-center shrink-0"
          
          style={{background: 'linear-gradient(201deg, rgba(51, 60, 245, 0.65) 0%, rgba(51, 60, 245, 0.05) 100%)'}}
          >
            <GiCheckMark className="text-brand-main text-[21px]" />
          </div>
          <div>
            <p className="text-[16px] text-[#757575]">Completed Appointments</p>
            <h3 className="text-[23px] font-bold text-brand-main">{completed.length}</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
    <div className="flex gap-4">
  <button
    className={`px-2 py-2 text-[14px] font-bold transition-all cursor-pointer border-b-2 ${
      activeTab === 'upcoming' 
        ? 'text-black-main-text border-[#333CF5]' 
        : 'text-[#757575B2] border-transparent hover:text-black-main-text'
    }`}
    onClick={() => setActiveTab('upcoming')}
  >
    Upcoming
  </button>
  
  <button
    className={`px-2 py-2 text-[14px] font-bold transition-all cursor-pointer border-b-2 ${
      activeTab === 'completed' 
        ? 'text-black-main-text border-[#333CF5]' 
        : 'text-[#757575B2] border-transparent hover:text-black-main-text'
    }`}
    onClick={() => setActiveTab('completed')}
  >
    Completed
  </button>
</div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {list.length === 0 && (
          <p className="text-[13px] text-gray-400 text-center py-8">No {activeTab} appointments.</p>
        )}
        {list.map(app => (
          <div key={app.id} className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <img src={app.img} alt={app.doc} className="w-14 h-14 rounded-full object-cover shrink-0" />
              <div className="flex flex-col gap-1">
                <h4 className="text-[24px] font-bold text-black-main-text">{app.doc}</h4>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-1 text-[16px] text-[#757575]">
                    <HiOutlineCalendarDays className="text-[#757575]" />
                    {app.date} &ndash; {app.time}
                  </div>
                  <div className="flex items-center gap-1 text-[16px]  text-[#757575]">
                    <HiOutlineBanknotes className="text-[#757575]" />
                    {app.method}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[16px]  text-[#757575]">
                  <HiOutlineMapPin className="text-[#757575]" />
                  {app.loc}
                </div>
              </div>
            </div>
            <div>
              {activeTab === 'upcoming' ? (
                <button
                  className="flex items-center cursor-pointer gap-1.5  text-[#DC2626] hover:bg-red-50 rounded-xl px-4 py-2 text-[16px] font-bold transition-colors"
                  onClick={() => setCancelTarget(app.id)}
                >
                  <HiOutlineXCircle className="text-base" /> Cancel Appointment
                </button>
              ) : (
                <span className="bg-[#D1FAE5] text-[#10B981] border border-[#E5E7EB] rounded-full px-3 py-1 text-[16px] font-bold">
                  Completed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PatientAppointments;
