import React from 'react';
import { HiOutlineHeart, HiOutlineArrowRight } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

const PatientNextStep = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[674.40px] bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl p-8 flex flex-col items-center text-center gap-4">
      <HiOutlineHeart className="text-white text-4xl" />
      <h2 className="text-[18px] font-bold text-white">Take the Next Step</h2>
      <p className="text-[13px] text-blue-100">Get a comprehensive heart health assessment with our advanced AI analysis</p>
      <button
        className="border-2 bg-white border-white text-brand-main hover:bg-white/10 transition-colors px-6 py-2.5 rounded-full text-[13px] font-bold flex items-center gap-2"
        onClick={() => navigate('/patient/heart-risk')}
      >
        Proceed to Full Assessment <HiOutlineArrowRight />
      </button>
    </div>
  );
};

export default PatientNextStep;
