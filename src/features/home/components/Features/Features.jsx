import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Container from '../HomeSectionWrapper/HomeSectionWrapper';

// الأيقونات
import { 
  HiOutlineHeart, 
  HiOutlineQrCode, 
  HiOutlineBell, 
  HiOutlineDocumentText 
} from "react-icons/hi2";
import { LuVideo, LuSparkles } from "react-icons/lu";
import { RiPulseFill } from "react-icons/ri";

// الصور
import RiskScore from "../../../../assets/Images/f1.png";
import QRCodes from "../../../../assets/Images/f2.png";
import Medication from "../../../../assets/Images/f3.png";
import Records from "../../../../assets/Images/f4.png";
import DoctorFollowups from "../../../../assets/Images/f5.png";

const FEATURES_DATA = [
  {
    id: 0,
    title: "Ai Heart Risk Score",
    description: "Advanced machine learning algorithms analyze your vital signs, lifestyle factors, and medical history to provide a comprehensive risk assessment with 95% accuracy.",
    accuracy: "95%",
    dataPoints: "50+",
    updates: "Real-time",
    icon: <HiOutlineHeart />,
    image: RiskScore,
    activeColor: "#2564EB" // لون القلب
  },
  {
    id: 1,
    title: "Emergency QR Codes",
    description: "Instant access to your complete medical profile for emergency responders. Critical information available in seconds when every moment counts.",
    accuracy: "Instant",
    dataPoints: "Global",
    updates: "24/7 Safe",
    icon: <HiOutlineQrCode />,
    image: QRCodes,
    activeColor: "#E94242" // لون الـ QR
  },
  {
    id: 2,
    title: "Medication Reminders", 
    description: "Smart medication management with personalized reminders, drug interaction alerts, and adherence tracking to optimize your treatment plan.",
    accuracy: "98%",
    dataPoints: "Daily",
    updates: "Smart",
    icon: <HiOutlineBell />,
    image: Medication,
    activeColor: "#D0791D" // لون التذكير
  },
  {
    id: 3,
    title: "Full Medical Records",
    description: "Comprehensive digital health records with secure cloud storage, easy sharing with healthcare providers, and complete medical history tracking.",
    accuracy: "Secure",
    dataPoints: "100%",
    updates: "Cloud Sync",
    icon: <HiOutlineDocumentText />,
    image: Records,
    activeColor: "#0891B2" // لون السجلات
  },
  {
    id: 4,
    title: "Doctor Follow-ups",
    description: "Virtual consultations with certified cardiologists, regular check-ins, and personalized care plans tailored to your specific heart health needs.",
    accuracy: "Expert",
    dataPoints: "HD",
    updates: "Direct Chat",
    icon: <LuVideo />,
    image: DoctorFollowups,
    activeColor: "#13D486" // لون الفيديو
  }
];

const Features = () => {
  const [activeTab, setActiveTab] = useState(0);
  const current = FEATURES_DATA[activeTab];

  return (
    <section id="features" className="py-24 bg-[#FAFAFA] overflow-hidden font-inter">
      <Container>
        {/* العناوين العلوية */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-[32px] md:text-4xl font-bold text-black-main-text mb-4">
            Comprehensive Heart Health Features
          </h2>
          <p className="text-gray-text-dim2 text-lg max-w-2xl mx-auto font-medium">
            Advanced AI-powered tools for complete cardiovascular monitoring and care
          </p>
        </motion.div>

        {/* الكارد الرئيسي */}
        <motion.div
          className="bg-white rounded-[48px] relative min-h-[480px]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <div className="grid lg:grid-cols-2 gap-10 items-center p-8 md:p-16">
            
            {/* المحتوى النصي (يسار) */}
            <div className="flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    {/* تحديث الأيقونة بجانب العنوان لتأخذ نفس لون الأكتيف */}
                    <div 
                      className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-2xl shadow-sm"
                      style={{ color: current.activeColor, borderColor: `${current.activeColor}33` }}
                    >
                      {current.icon}
                    </div>
                    <h3 className="text-3xl font-bold text-black-main-text">{current.title}</h3>
                  </div>

                  <p className="text-gray-text-dim2 text-lg leading-relaxed mb-12 max-w-[500px]">
                    {current.description}
                  </p>

                  <div className="flex gap-12 mb-5">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-black-main-text">{current.accuracy}</span>
                      <span className="text-[12px] font-medium text-gray-text-dim2 tracking-wide">Accuracy</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-black-main-text">{current.dataPoints}</span>
                      <span className="text-[12px] font-medium text-gray-text-dim2 tracking-wide">Data points</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-black-main-text">{current.updates}</span>
                      <span className="text-[12px] font-medium text-gray-text-dim2 tracking-wide">Updates</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full max-w-[400px]">
                    <div className="flex justify-between text-[11px] text-black-main-text mb-2 tracking-wider">
                      <span>Feature {activeTab + 1} of 5</span>
                      <span>{(activeTab + 1) * 20}%</span>
                    </div>
                    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full"
                        style={{ backgroundColor: current.activeColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(activeTab + 1) * 20}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

    {/* الجزء البصري (يمين) */}
    {/* الجزء البصري (يمين) */}
<div className="relative w-full overflow-hidden rounded-[5px] bg-[#f8fafc] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),_0_10px_10px_-5px_rgba(0,0,0,0.04)]" style={{ aspectRatio: '16/10' }}>
  <img 
    src={current.image} 
    alt={current.title}
    className="w-full h-full object-cover block transition-transform duration-700"
  />  

  {/* الأيقونة العلوية - حركة خفيفة للأعلى والأسفل */}
  <motion.div 
    className="absolute top-1 right-1 w-10 h-10 flex items-center justify-center z-20"
    style={{ color: current.activeColor }}
    animate={{ y: [0, -8, 0] }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
  >
    <RiPulseFill />
  </motion.div>

  {/* الأيقونة السفلية */}
  <motion.div 
    className="absolute bottom-1 left-1 w-10 h-10 flex items-center justify-center text-[#F59E0B] z-20"
    animate={{ y: [0, 8, 0] }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
  >
    <LuSparkles />
  </motion.div>
</div>
          </div>

          {/* التابات العائمة بالأسفل */}
      {/* التابات العائمة بالأسفل */}
<div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-40">
  <div className="flex items-center gap-4 px-5 py-3">
    {FEATURES_DATA.map((feat, index) => {
      const isActive = activeTab === index;
      return (
        <button
          key={index}
          onClick={() => setActiveTab(index)}
          className="w-12 h-12 rounded-full flex border border-gray-300 items-center justify-center text-xl transition-all duration-300"
          style={{
            backgroundColor: isActive ? feat.activeColor : "white",
            color: isActive ? "white" : "#1F293780",
            borderColor: isActive ? feat.activeColor : "#E5E7EB",
          }}
        >
          {feat.icon}
        </button>
      );
    })}
  </div>
</div>
        </motion.div>
      </Container>
    </section>
  );
};

export default Features;