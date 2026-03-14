import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  HiStar, HiChevronLeft, HiChevronRight,
  HiOutlineCalendar, HiOutlineClock, HiOutlineCreditCard, HiOutlineLocationMarker
} from 'react-icons/hi';

/* ── Same mock data ── */
const DOCTORS_DB = {
  1:  { name: 'DR. Walid Ali',      title: 'Specialist Doctor', rate: 4.9, reviews: 127, price: 200, img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&q=80' },
  2:  { name: 'DR. Tamer Megahd',   title: 'Cardiologist',      rate: 4.7, reviews: 98,  price: 80,  img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&q=80' },
  3:  { name: 'DR. Jehan Osama',    title: 'Heart Specialist',  rate: 4.5, reviews: 210, price: 400, img: 'https://images.unsplash.com/photo-1559839734-2b71f1536780?w=150&q=80' },
  4:  { name: 'DR. Ali Ramez',      title: 'Cardiologist',      rate: 4.8, reviews: 88,  price: 300, img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&q=80' },
  5:  { name: 'DR. Noha Ahmed',     title: 'Cardiac Surgeon',   rate: 4.4, reviews: 156, price: 85,  img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&q=80' },
  6:  { name: 'DR. Zena Mahmoud',   title: 'Heart Specialist',  rate: 4.6, reviews: 76,  price: 120, img: 'https://images.unsplash.com/photo-1623854767233-243a6496667a?w=150&q=80' },
  7:  { name: 'DR. Ahmed Hassan',   title: 'Senior Cardiologist',rate: 4.9, reviews: 210, price: 150, img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&q=80' },
  8:  { name: 'DR. Sara Khalil',    title: 'Cardiologist',      rate: 4.5, reviews: 85,  price: 100, img: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=150&q=80' },
  9:  { name: 'DR. Layla Ibrahim',  title: 'Cardiac Specialist', rate: 4.8, reviews: 176, price: 250, img: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=150&q=80' },
  10: { name: 'DR. Omar Farouk',    title: 'Heart Surgeon',     rate: 4.6, reviews: 95,  price: 180, img: 'https://images.unsplash.com/photo-1605684954998-685c79d6a018?w=150&q=80' },
  11: { name: 'DR. Mona Saeed',     title: 'Cardiologist',      rate: 4.3, reviews: 60,  price: 70,  img: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=150&q=80' },
  12: { name: 'DR. Khaled Mansour', title: 'Senior Specialist', rate: 4.9, reviews: 310, price: 350, img: 'https://images.unsplash.com/photo-1638202993928-7d113b8e4519?w=150&q=80' },
};

const DAYS   = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const TIMES  = ['05:30 PM', '06:30 PM', '07:30 PM', '08:30 PM', '09:30 PM'];
/* Oct 2025 starts on Wednesday (offset=3) */
const OFFSET = 3;

/* days with available slots */
const AVAILABLE = new Set([3, 5, 8, 10, 13, 14, 15, 16, 17, 18, 20, 21, 22, 24, 25, 26, 27, 28, 29, 30]);

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const PatientBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const doctor = DOCTORS_DB[Number(id)] || DOCTORS_DB[1];

  const [selectedDate, setSelectedDate] = useState(15);
  const [selectedTime, setSelectedTime] = useState(null);

  /* compute day-of-week for the selected date */
  const dayOfWeek = DAY_NAMES[(OFFSET + selectedDate - 1) % 7];

  const handleConfirm = () => {
    if (!selectedTime) return alert('Please select a time slot!');
    navigate(`/patient/payment/${id}`, {
      state: { doctorName: doctor.name, doctorTitle: doctor.title, date: `Oct ${selectedDate}, 2025`, time: selectedTime, price: doctor.price }
    });
  };

  return (
    <div className="min-h-screen  flex flex-col items-center justify-start sm:p-6 lg:p-8">

      {/* ── Booking Card ── */}
      <div className="w-full max-w-4xl bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="flex flex-col lg:flex-row">

          {/* ── LEFT SIDEBAR ── */}
          <div className="w-full lg:w-56 border-b lg:border-b-0 lg:border-r border-gray-100 p-5 flex flex-col items-center gap-4">

            {/* Doctor Info */}
            <div className="flex flex-col items-center text-center gap-1">
              <img
                src={doctor.img} alt={doctor.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${doctor.name}&background=E8EAF6&color=333CF5`; }}
              />
              <span className="text-[10px] text-black-main-text mt-1">{doctor.title}</span>
              <h3 className="text-sm font-bold text-black-main-text">{doctor.name}</h3>
              <div className="flex items-center gap-1">
                <HiStar className="text-yellow-400 text-xs" />
                <span className="text-xs font-semibold text-black-main-text">{doctor.rate}</span>
                <span className="text-xs text-[#6B7280]">({doctor.reviews} reviews)</span>
              </div>
              <p className="text-base font-bold text-black-main-text mt-1">${doctor.price}<span className="text-xs text-[#757575]font-normal"> / session</span></p>
            </div>

            {/* Stepper */}
            <div className="flex flex-col gap-0 w-full mt-2">
              {/* Step 1 - Date */}
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-brand-main flex items-center justify-center shrink-0">
                  <HiOutlineCalendar className="text-white text-xs" />
                </div>
                <span className="text-xs font-semibold text-brand-main">{selectedDate} Oct, 2025</span>
              </div>
              <div className="w-px h-8 bg-gray-200 ml-3.5"></div>

              {/* Step 2 - Time */}
              <div className="flex items-center gap-3 ">
                <div className={`w-7 h-7 rounded-full border border-[#BDC6C6]  flex items-center justify-center shrink-0 ${selectedTime ? 'bg-brand-main' : 'bg-[#FFFFFF]'}`}>
                  <HiOutlineClock className={`text-xs ${selectedTime ? 'text-white' : 'text-[#BDC6C6]'}`} />
                </div>
                <span className={`text-xs font-semibold ${selectedTime ? 'text-brand-main' : 'text-[#BDC6C6]'}`}>{selectedTime || 'Time'}</span>
              </div>
              <div className="w-px h-6 bg-gray-200 ml-3.5"></div>

              {/* Step 3 - Payment */}
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-white border border-[#BDC6C6]  flex items-center justify-center shrink-0">
                  <HiOutlineCreditCard className="text-[#BDC6C6] text-xs" />
                </div>
                <span className="text-xs text-[#BDC6C6]">Payment Type</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1.5 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#BDC6C6]  w-full mt-2">
              <HiOutlineLocationMarker className="text-[#BDC6C6]  shrink-0" />
              City Medical Center
            </div>
          </div>

          {/* ── RIGHT - Calendar + Time ── */}
          <div className="flex-1 p-5 sm:p-7">
            <h2 className="text-2xl font-bold text-black-main-text mb-15">Select date &amp; time</h2>

            <div className="flex flex-col lg:flex-row gap-6">

              {/* Calendar */}
              <div className="flex-1">
                {/* Month header */}
                <div className="flex items-center cursor-pointer justify-between mb-4">
                  <button className="w-7 h-7 rounded-full bg-[#3C46F614] flex items-center justify-center hover:bg-gray-200 transition">
                    <HiChevronLeft className="text-[#BDC6C6] text-sm" />
                  </button>
                  <span className="text-sm font-semibold cursor-pointer text-black-main-text">October 2025</span>
                  <button className="w-7 h-7 rounded-full bg-brand-main flex items-center justify-center hover:bg-[#2730d4] transition">
                    <HiChevronRight className="text-white text-sm" />
                  </button>
                </div>

                {/* Day labels */}
                <div className="grid grid-cols-7 mb-2">
                  {DAYS.map(d => (
                    <span key={d} className="text-center text-[11px] text-gray-400 font-medium py-1">{d}</span>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-y-1">
                  {/* offset empty cells */}
                  {Array.from({ length: OFFSET }).map((_, i) => <div key={`e-${i}`} />)}

                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                    const isAvail   = AVAILABLE.has(day);
                    const isSelected = selectedDate === day;
                    const isToday    = day === 15;
                    return (
                      <button
                        key={day}
                        onClick={() => { if (isAvail) { setSelectedDate(day); setSelectedTime(null); } }}
                        disabled={!isAvail}
                        className={`mx-auto w-8 h-8 cursor-pointer rounded-full  text-xs font-medium flex items-center justify-center transition
                          ${isSelected
                            ? 'bg-brand-main text-white shadow'
                            : isToday && !isSelected
                            ? 'bg-[#333CF514] text-brand-main font-bold'
                            : isAvail
                            ? 'bg-[#333CF514] hover:bg-[#333CF514] text-black-main-text'
                            : 'text-gray-300 cursor-not-allowed'}`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px bg-gray-100" />
              <div className="block lg:hidden h-px bg-gray-100" />

              {/* Time Slots */}
              <div className="lg:w-40">
                <p className="text-xs font-semibold text-black-main-text mb-3">
                  {dayOfWeek}, {selectedDate}. October
                </p>
                <div className="flex flex-col gap-2">
                  {TIMES.map(t => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`flex items-center gap-2 border cursor-pointer border-[#333CF54D] rounded-full px-3 py-2.5 text-sm transition
                        ${selectedTime === t
                          ? 'border-brand-main bg-[#EEF0FF] text-brand-main font-semibold'
                          : 'border-[#333CF54D] text-[#0102188e] hover:border-brand-main hover:text-brand-main'}`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center cursor-pointer shrink-0
                        ${selectedTime === t ? 'border-brand-main' : 'border-gray-300'}`}>
                        {selectedTime === t && <div className="w-1.5 h-1.5 rounded-full bg-brand-main" />}
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

      {/* ── Confirm Button ── */}
      <button
        onClick={handleConfirm}
        className="bg-brand-main cursor-pointer text-white font-semibold text-sm px-12 py-3 rounded-full hover:bg-[#2730d4] transition shadow-md"
      >
        Confirm Appointment
      </button>

    </div>
  );
};

export default PatientBooking;
