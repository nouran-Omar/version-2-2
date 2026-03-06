import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../HomeSectionWrapper/HomeSectionWrapper';
import { RiPulseLine } from "react-icons/ri";


// Icons
import { HiStar, HiChevronRight, HiChevronLeft } from "react-icons/hi2";

import { RiHeartPulseLine } from "react-icons/ri"; 
import { IoSpeedometerOutline } from "react-icons/io5"; 
import { AiOutlinePieChart } from "react-icons/ai"; 
import { BsShieldCheck } from "react-icons/bs";
import { CiHeart } from "react-icons/ci";
import { RiSpeedUpFill } from "react-icons/ri";
import { FaUserGroup } from "react-icons/fa6";
import { LuCircleCheckBig } from "react-icons/lu";

import { IoShieldOutline } from "react-icons/io5";
const DOCTORS = [
  {
    id: 1,
    name: "Dr. Aya Fathy Saed",
    role: "interventional Cardiologist",
    exp: "15+ years",
    rating: "4.9",
    patients: "2,847",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400&h=400",
    metrics: [
      { label: "Heart Rate", value: "68 BPM", icon: <CiHeart />, color: "#EA4747" },
      { label: "Blood Pressure", value: "120/80", icon: <RiSpeedUpFill />, color: "#75A7B3" },
      { label: "Risk Score", value: "15%", icon: <IoShieldOutline />, color: "#D0791D" },
      { label: "Status", value: "Normal", icon: <LuCircleCheckBig />, color: "#00C853", isStatus: true },
    ]
  },
  {
    id: 2,
    name: "Dr. Ahmed Mansour",
    role: "Cardiac Surgeon",
    exp: "12+ years",
    rating: "4.8",
    patients: "1,530",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400&h=400",
    metrics: [
      { label: "Heart Rate", value: "72 BPM", icon: <RiHeartPulseLine />, color: "#EF4444" },
      { label: "Blood Pressure", value: "118/75", icon: <IoSpeedometerOutline />, color: "#3B82F6" },
      { label: "Risk Score", value: "10%", icon: <AiOutlinePieChart />, color: "#F59E0B" },
      { label: "Status", value: "Excellent", icon: <BsShieldCheck />, color: "#10B981", isStatus: true },
    ]
  },
  {
    id: 3,
    name: "Dr. Sarah El-Amin",
    role: "Electrophysiologist",
    exp: "10+ years",
    rating: "4.7",
    patients: "1,200",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400&h=400",
    metrics: [
      { label: "Heart Rate", value: "65 BPM", icon: <RiHeartPulseLine />, color: "#EF4444" },
      { label: "Blood Pressure", value: "110/70", icon: <IoSpeedometerOutline />, color: "#3B82F6" },
      { label: "Risk Score", value: "8%", icon: <AiOutlinePieChart />, color: "#F59E0B" },
      { label: "Status", value: "Stable", icon: <BsShieldCheck />, color: "#10B981", isStatus: true },
    ]
  },
  {
    id: 4,
    name: "Dr. Youssef Halim",
    role: "Pediatric Cardiologist",
    exp: "8+ years",
    rating: "4.9",
    patients: "980",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400&h=400",
    metrics: [
      { label: "Heart Rate", value: "75 BPM", icon: <RiHeartPulseLine />, color: "#EF4444" },
      { label: "Blood Pressure", value: "115/78", icon: <IoSpeedometerOutline />, color: "#3B82F6" },
      { label: "Risk Score", value: "5%", icon: <AiOutlinePieChart />, color: "#F59E0B" },
      { label: "Status", value: "Healthy", icon: <BsShieldCheck />, color: "#10B981", isStatus: true },
    ]
  }
];

const Doctors = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    if (currentIndex < DOCTORS.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const prevSlide = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const doctor = DOCTORS[currentIndex];

  return (
    <section id="doctors" className="bg-[#FAFAFA] py-24 overflow-hidden  font-inter">
      <Container>
        {/* العناوين اللي فوق */}
<motion.div
  className="text-center mb-16 flex flex-col items-center" // استخدمت flex عشان نضمن التوسط الدقيق
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
  {/* العنوان الرئيسي - بنفس الحجم واللون الداكن */}
  <h2 className="text-[32px] md:text-[40px] font-bold text-black-main-text tracking-tight mb-4">
    Expert Cardiologists
  </h2>

  {/* الجملة الفرعية الأولى - واخدة رمادي أغمق شوية ومسافة بسيطة */}
  <p className="text-gray-text-dim2 text-lg md:text-xl mb-6">
    Connect with certified heart specialists for personalized care and monitoring
  </p>

  {/* الفقرة الطويلة - معمولة بمقاس محدد عشان تنزل سطر في نفس الأماكن */}
  <p className="text-gray-text-dim2 text-base md:text-lg max-w-[850px] leading-[1.8] font-light">
    Our AI-powered platform connects you with board-certified cardiologists who specialize in remote
    monitoring and preventive care. Get expert insights, personalized recommendations, and continuous 
    support for your heart health journey.
  </p>
</motion.div>

        <motion.div
          className="relative max-w-[950px] mx-auto px-4 md:px-0"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          
          {/* زرار الشمال - بيختفي لو إحنا في أول صورة */}
          <button 
            onClick={prevSlide}
            className={`absolute top-1/2 -translate-y-1/2 w-[54px] h-[54px] bg-white rounded-full flex items-center justify-center text-[#94a3b8] shadow-[0_10px_25px_rgba(0,0,0,0.06)] border border-[#f1f5f9] cursor-pointer z-30 transition-all duration-300 hover:bg-brand-main hover:text-white hover:shadow-[0_10px_20px_rgba(51,60,245,0.2)] left-[-20px] md:left-[-60px] ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <HiChevronLeft size={24} />
          </button>

          {/* الكارد الرئيسي */}
          <div className="bg-white rounded-[32px] p-8 shadow-lg md:p-14 min-h-[460px]">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col md:flex-row items-center gap-10 md:gap-20"
              >
                {/* الجزء الشمال: صورة وبيانات */}
                <div className="w-full md:w-[40%] flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="relative mb-8">
                    <img 
                      src={doctor.image} 
                      alt={doctor.name} 
                      className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-10 border-[#F8F9FA]" 
                    />
                 <div className="absolute bottom-5 right-5 w-4 h-4 bg-[#DCEDE8] border-3 border-[#079A6B] rounded-full"></div></div>
                  
                  <h3 className="text-2xl font-bold text-black-main-text mb-1">{doctor.name}</h3>
                  <p className="text-brand-main font-semibold text-lg mb-1">{doctor.role}</p>
                  <p className="text-gray-text-dim2 text-sm mb-6">{doctor.exp} years</p>

                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-1.5">
                      <HiStar className="text-[#F59E0B] size-5" />
                      <span className="font-bold text-black-main-text">{doctor.rating}</span>
                   <span className="text-gray-text-dim2 text-sm ml-1 flex items-center gap-1">
  <FaUserGroup className="text-xs" /> {doctor.patients}
</span></div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[#00C853] text-sm font-bold  px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></span>
                    Available Now
                  </div>
                </div>

                {/* الجزء اليمين: الـ Metrics */}
                <div className="w-full md:w-[50%]">
                  <div className="flex items-center gap-2 text-black-main-text font-bold text-lg mb-8">
                    <span className="text-brand-main"> <RiPulseLine className=" w-5 h-5 " />
            </span> 
                    Patient Metrics
                  </div>

                  <div className="space-y-5 mb-10">
                    {doctor.metrics.map((m, i) => (
                      <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-1">
                        <div className="flex items-center gap-3 text-gray-text-dim2 font-medium">
                          <span style={{ color: m.color }} className="text-xl">{m.icon}</span>
                          {m.label}
                        </div>
                        <span className={`font-bold ${m.isStatus ? 'text-[#00C853]' : 'text-black-main-text'}`}>
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* ECG Box */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex justify-between text-[10px] font-bold text-[#94A3B8] mb-3 tracking-widest uppercase">
                      <span>ECG Recording</span>
                      <span className="text-[#10B981] flex items-center gap-1">
                         LIVE
                      </span>
                    </div>
                    <div className="h-14">
                       <ECGAnimation />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* زرار اليمين - بيختفي لو إحنا في آخر صورة */}
          <button 
            onClick={nextSlide}
            className={`absolute top-1/2 -translate-y-1/2 w-[54px] h-[54px] bg-white rounded-full flex items-center justify-center text-[#94a3b8] shadow-[0_10px_25px_rgba(0,0,0,0.06)] border border-[#f1f5f9] cursor-pointer z-30 transition-all duration-300 hover:bg-brand-main hover:text-white hover:shadow-[0_10px_20px_rgba(51,60,245,0.2)] right-[-20px] md:right-[-60px] ${currentIndex === DOCTORS.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <HiChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2.5 mt-10">
            {DOCTORS.map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2.5 transition-all duration-500 rounded-full ${currentIndex === i ? 'w-2.5 bg-brand-main' : 'w-2.5 bg-gray-200'}`}
              />
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

const ECGAnimation = () => (
  <svg viewBox="0 0 400 60" className="w-full h-full">
    <path
      d="M0 30 L60 30 L70 10 L80 50 L90 30 L180 30 L190 5 L200 55 L210 30 L300 30 L310 15 L320 45 L330 30 L400 30"
      fill="none"
      stroke="#10B981"
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{
        strokeDasharray: 1000,
        strokeDashoffset: 1000,
        animation: 'drawECG 5s linear infinite',
      }}
    />
  </svg>
);

export default Doctors;