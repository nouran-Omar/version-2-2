import React from 'react';

export default function ConfirmModal({ isOpen, title, desc, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-6 w-full max-w-[380px] flex flex-col gap-4">
        <h2 className="text-[17px] font-bold text-center text-black-main-text">{title}</h2>
        <p className="text-[13px] text-gray-text-dim2 leading-relaxed">{desc}</p>
        <div className="flex items-center justify-end gap-3 pt-2">
          <button onClick={onCancel} className="px-4 py-2 text-[13px] cursor-pointer font-semibold text-gray-600 bg-[#EFEFEF] rounded-full hover:bg-gray-200 transition-colors">No, Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 text-[13px] cursor-pointer font-semibold text-white bg-[#DC2626] rounded-full hover:bg-[#DC2626] transition-colors">Yes, Confirm</button>
        </div>
      </div>
    </div>
  );
}
