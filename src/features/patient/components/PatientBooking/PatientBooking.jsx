import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  HiStar, HiChevronLeft, HiChevronRight,
  HiOutlineCalendar, HiOutlineClock, HiOutlineCreditCard, HiOutlineLocationMarker
} from 'react-icons/hi';
import Toast from '../../../../components/Toast/Toast';

/* ── Mock doctors data ── */
/* ── Mock doctors data ── */
const DOCTORS_DB = {
  1:  { name: 'DR. Walid Ali',      title: 'Specialist Doctor',   rate: 4.9, reviews: 127, price: 200, img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&q=80' },
  2:  { name: 'DR. Tamer Megahd',   title: 'Cardiologist',        rate: 4.7, reviews: 98,  price: 80,  img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&q=80' },
  3:  { name: 'DR. Jehan Osama',    title: 'Heart Specialist',    rate: 4.5, reviews: 210, price: 400, img: 'https://images.unsplash.com/photo-1559839734-2b71f1536780?w=150&q=80' },
  4:  { name: 'DR. Ali Ramez',      title: 'Cardiologist',        rate: 4.8, reviews: 88,  price: 300, img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&q=80' },
  5:  { name: 'DR. Noha Ahmed',     title: 'Cardiac Surgeon',     rate: 4.4, reviews: 156, price: 85,  img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&q=80' },
  6:  { name: 'DR. Zena Mahmoud',   title: 'Heart Specialist',    rate: 4.6, reviews: 76,  price: 120, img: 'https://images.unsplash.com/photo-1623854767233-243a6496667a?w=150&q=80' },
  7:  { name: 'DR. Ahmed Hassan',   title: 'Senior Cardiologist', rate: 4.9, reviews: 210, price: 150, img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&q=80' },
  8:  { name: 'DR. Sara Khalil',    title: 'Cardiologist',        rate: 4.5, reviews: 85,  price: 100, img: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=150&q=80' },
  9:  { name: 'DR. Layla Ibrahim',  title: 'Cardiac Specialist',  rate: 4.8, reviews: 176, price: 250, img: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=150&q=80' },
  10: { name: 'DR. Omar Farouk',    title: 'Heart Surgeon',       rate: 4.6, reviews: 95,  price: 180, img: 'https://images.unsplash.com/photo-1605684954998-685c79d6a018?w=150&q=80' },
  11: { name: 'DR. Mona Saeed',     title: 'Cardiologist',        rate: 4.3, reviews: 60,  price: 70,  img: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=150&q=80' },
  12: { name: 'DR. Khaled Mansour', title: 'Senior Specialist',   rate: 4.9, reviews: 310, price: 350, img: 'https://images.unsplash.com/photo-1638202993928-7d113b8e4519?w=150&q=80' },
};

const WEEK_DAYS   = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const DAY_NAMES   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const ALL_TIMES   = ['05:30 PM', '06:30 PM', '07:30 PM', '08:30 PM', '09:30 PM'];

const getAvailableDays = (year, month) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const available = new Set();
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(year, month, d).getDay();
    if (dow === 5 || dow === 6) continue;
    if (d % 2 !== 0 || d > 10) available.add(d);
  }
  return available;
};

const getTimesForDay = (day) => {
  if (day % 3 === 0) return ALL_TIMES.slice(0, 3);
  if (day % 2 === 0) return ALL_TIMES.slice(1, 4);
  return ALL_TIMES;
};

const PatientBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = DOCTORS_DB[Number(id)] || DOCTORS_DB[1];

  const [calYear,  setCalYear]  = useState(2025);
  const [calMonth, setCalMonth] = useState(9); 
  const [selectedDate, setSelectedDate] = useState({ day: 15, month: 9, year: 2025 });
  const [selectedTime, setSelectedTime] = useState(null);
  const [toast, setToast] = useState({ visible: false, title: '', message: '' });

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
  const availableDays = getAvailableDays(calYear, calMonth);
  const timesForDay = getTimesForDay(selectedDate.day);

  const isSelectedDay = (day) => selectedDate.day === day && selectedDate.month === calMonth && selectedDate.year === calYear;
  const stepperDateLabel = `${selectedDate.day} ${MONTH_NAMES[selectedDate.month].slice(0,3)}, ${selectedDate.year}`;
  const selectedDow = new Date(selectedDate.year, selectedDate.month, selectedDate.day).getDay();
  const dayOfWeekLabel = `${DAY_NAMES[selectedDow]}, ${selectedDate.day}. ${MONTH_NAMES[selectedDate.month]}`;
  const calHeaderLabel = `${MONTH_NAMES[calMonth]} ${calYear}`;

  const goPrevMonth = useCallback(() => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
    setSelectedTime(null);
  }, [calMonth]);

  const goNextMonth = useCallback(() => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
    setSelectedTime(null);
  }, [calMonth]);

  const handleDayClick = (day) => {
    if (!availableDays.has(day)) return;
    setSelectedDate({ day, month: calMonth, year: calYear });
    setSelectedTime(null);
  };

  const handleConfirm = () => {
    if (!selectedTime) {
      setToast({ visible: true, title: 'No Time Selected', message: 'Please choose a time slot.' });
      return;
    }
    navigate(`/patient/payment/${id}`, { state: { doctorName: doctor.name, date: stepperDateLabel, time: selectedTime, price: doctor.price } });
  };

  return (
    <div className="min-h-screen rounded-full flex flex-col  items-center justify-start bg-[#F9FAFB] sm:p-6 lg:p-8">
      <Toast {...toast} onClose={() => setToast(t => ({ ...t, visible: false }))} />

      <div className="w-full max-w-5xl bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="flex flex-col lg:flex-row">

          {/* ── LEFT SIDEBAR ── */}
          <div className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-gray-100 p-8 flex flex-col items-start gap-6">
            
            {/* Doctor Info - محاذاة لليسار */}
            <div className="flex flex-col items-start text-left gap-2 w-full">
              <img
                src={doctor.img}
                alt={doctor.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-50 shadow-sm"
              />
              <div className="mt-2">
                <span className="text-[10px] font-bold text-black-main-text ">{doctor.title}</span>
                <h3 className="text-[22px] font-bold text-black-main-text leading-tight">{doctor.name}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <HiStar className="text-yellow-400 text-sm" />
                  <span className="text-[16px] font-bold text-black-main-text">{doctor.rate}</span>
                  <span className="text-[16px] text-gray-400">({doctor.reviews} reviews)</span>
                </div>
                <p className="text-2xl font-black text-black-main-text mt-2">
                  ${doctor.price}<span className="text-sm text-gray-400 font-normal"> / session</span>
                </p>
              </div>
            </div>

            {/* Stepper - مسافات أطول وتلوين الخط */}
            <div className="flex flex-col w-full mt-4 pl-1">
              {/* Step 1 */}
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-main flex items-center justify-center shrink-0 shadow-md shadow-blue-100">
                  <HiOutlineCalendar className="text-white text-sm" />
                </div>
                <span className="text-xs font-bold text-brand-main">{stepperDateLabel}</span>
              </div>
              
              {/* الخط الرابط - يتلون بالأزرق إذا تم اختيار الوقت */}
              <div className={`h-7 ml-[15px] border-l-2 border-dashed transition-colors duration-500 ${selectedTime ? 'border-brand-main' : 'border-gray-200'}`} />

              {/* Step 2 */}
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${selectedTime ? 'bg-brand-main border-brand-main shadow-md shadow-blue-100' : 'bg-white border-gray-200'}`}>
                  <HiOutlineClock className={`text-sm ${selectedTime ? 'text-white' : 'text-gray-300'}`} />
                </div>
                <span className={`text-xs font-bold ${selectedTime ? 'text-brand-main' : 'text-gray-300'}`}>
                  {selectedTime || 'Select Time'}
                </span>
              </div>

              <div className="h-7 ml-[15px] border-l-2 border-dashed border-gray-200" />

              {/* Step 3 */}
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shrink-0">
                  <HiOutlineCreditCard className="text-gray-300 text-sm" />
                </div>
                <span className="text-xs font-bold text-gray-300">Payment Type</span>
              </div>
            </div>

            {/* Location */}
          <div className="flex items-center justify-center gap-2 bg-gray-50 rounded-2xl px-4 py-3 text-[11px] text-[#757575B2] font-bold w-full mt-auto border border-gray-100">
 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16" fill="none">
  <g clip-path="url(#clip0_548_5423)">
    <path d="M6.74062 15.6C8.34375 13.5938 12 8.73125 12 6C12 2.6875 9.3125 0 6 0C2.6875 0 0 2.6875 0 6C0 8.73125 3.65625 13.5938 5.25938 15.6C5.64375 16.0781 6.35625 16.0781 6.74062 15.6ZM6 4C6.53043 4 7.03914 4.21071 7.41421 4.58579C7.78929 4.96086 8 5.46957 8 6C8 6.53043 7.78929 7.03914 7.41421 7.41421C7.03914 7.78929 6.53043 8 6 8C5.46957 8 4.96086 7.78929 4.58579 7.41421C4.21071 7.03914 4 6.53043 4 6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4Z" fill="#9CA3AF"/>
  </g>
  <defs>
    <clipPath id="clip0_548_5423">
      <path d="M0 0H12V16H0V0Z" fill="white"/>
    </clipPath>
  </defs>
</svg>City Medical Center
</div>
          </div>

          {/* ── RIGHT CONTENT ── */}
          <div className="flex-1 p-8">
            <h2 className="text-2xl font-bold text-black-main-text mb-8">Select date & time</h2>

            <div className="flex flex-col xl:flex-row gap-10">
              {/* Calendar */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-8">
                  <button onClick={goPrevMonth} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition">
                    <HiChevronLeft className="text-gray-400" />
                  </button>
                  <span className="text-base font-bold text-black-main-text">{calHeaderLabel}</span>
                  <button onClick={goNextMonth} className="w-9 h-9 rounded-full bg-brand-main flex items-center justify-center shadow-lg shadow-blue-100">
                    <HiChevronRight className="text-white" />
                  </button>
                </div>

                {/* أيام الأسبوع */}
                <div className="grid grid-cols-7 mb-4">
                  {WEEK_DAYS.map(d => (
                    <span key={d} className="text-center text-[11px] text-[#010218B2] font-black uppercase tracking-widest">{d}</span>
                  ))}
                </div>

                {/* خلايا الأيام - تم ضبط المسافات */}
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e-${i}`} />)}
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const isAvail = availableDays.has(day);
                    const isSelected = isSelectedDay(day);
                    return (
                      <button
                        key={day}
                        onClick={() => handleDayClick(day)}
                        disabled={!isAvail}
                        className={`aspect-square w-full max-w-[40px] mx-auto rounded-full text-xs font-bold flex items-center justify-center transition-all
                          ${isSelected ? 'bg-brand-main text-white shadow-lg' : 
                            isAvail ? 'bg-[#333CF514] text-black-main-text cursor-pointer hover:bg-blue-100' : 'text-gray-200 cursor-not-allowed'}`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div className="xl:w-56 shrink-0">
                <p className="text-[16px] font-normal text-[#010218] mb-5">{dayOfWeekLabel}</p>
                <div className="flex flex-col gap-3">
                  {timesForDay.map(t => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`flex items-center cursor-pointer gap-3 border-2 rounded-[20px] px-4 py-3.5 text-sm transition-all
                        ${selectedTime === t 
                          ? 'border-brand-main bg-blue-50 text-brand-main font-bold' 
                          : 'border-[#333CF54D] bg-gray-50 text-gray-400 hover:border-gray-100'}`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                        ${selectedTime === t ? 'border-brand-main' : 'border-gray-300'}`}>
                        {selectedTime === t && <div className="w-2 h-2 rounded-full bg-brand-main" />}
                      </div>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleConfirm}
        className="bg-brand-main cursor-pointer bg-[#333cf5] text-white font-bold text-base px-16 py-4 rounded-full hover:bg-[#333cf5] transition shadow-xl shadow-blue-100 active:scale-95"
      >
        Confirm Appointment
      </button>
    </div>
  );
};

export default PatientBooking;