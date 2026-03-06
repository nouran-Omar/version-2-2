import React from 'react';
import { LuCheck } from "react-icons/lu";

export default function ToastNotification({ message, subMessage }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="flex items-center gap-3 px-5 py-3.5 bg-white rounded-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 min-w-[260px]">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#DCFCE7] shrink-0">
          <LuCheck className="text-[16px] text-[#059669]" />
        </div>
        <div className="flex flex-col">
          <h4 className="text-[13px] font-semibold text-black-main-text leading-tight">{message}</h4>
          {subMessage && <p className="text-[12px] text-gray-500 mt-0.5 leading-tight">{subMessage}</p>}
        </div>
      </div>
    </div>
  );
}

