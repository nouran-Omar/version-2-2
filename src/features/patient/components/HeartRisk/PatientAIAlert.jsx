import React from 'react';
import { HiOutlineLightningBolt } from 'react-icons/hi';

const PatientAIAlert = () => {
  return (
    <div className="w-full  max-w-[674.40px] p-8  bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] shadow-lg outline outline-[1.60px] outline-offset-[-1.60px] outline-yellow-200 rounded-[18px] p-4 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
          <HiOutlineLightningBolt className="text-amber-600 text-lg" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-[14px] font-bold text-black-main-text">AI Detection Alert</h3>
          <p className="text-[12px] text-gray-700">Our AI detected a high probability of heart-related issues based on your responses.</p>
        </div>
      </div>
      <div className="bg-white/60 rounded-xl p-3">
        <p className="text-[11px] text-gray-600">
          *Higher accuracy required. Complete your full profile in the Heart Risk Assessment section for deeper medical insights.
        </p>
      </div>
    </div>
  );
};

export default PatientAIAlert;
