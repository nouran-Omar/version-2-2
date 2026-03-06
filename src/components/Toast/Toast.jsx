/**
 * Toast — Global reusable success/error/info toast notification
 *
 * Figma spec: bg-gray-100 (#F3F4F5), dark icon circle (#303746),
 * green check (#01E17B), green bottom bar, green radial glow,
 * slide-in from right, auto-dismiss after `duration` ms.
 *
 * Props:
 *  visible   {boolean}  — show/hide the toast
 *  title     {string}   — bold main line  (e.g. "Doctor Created Successfully")
 *  message   {string}   — sub-line        (e.g. "Your changes have been saved successfully")
 *  type      {string}   — 'success' | 'error' | 'info'  (default: 'success')
 *  duration  {number}   — ms before auto-hide            (default: 4000)
 *  onClose   {fn}       — called when toast hides
 *
 * Usage:
 *   const [toast, setToast] = useState({ visible: false, title: '', message: '' });
 *
 *   // show:
 *   setToast({ visible: true, title: 'Doctor Created Successfully',
 *              message: 'Your changes have been saved successfully' });
 *
 *   // in JSX:
 *   <Toast {...toast} onClose={() => setToast(t => ({ ...t, visible: false }))} />
 */
import React, { useEffect, useRef, useState } from 'react';
import { IoCheckmarkCircleSharp } from "react-icons/io5";

export default function Toast({
  visible = false,
  title   = 'Password Changed Successfully',
  message = 'Your changes have been saved successfully',
  duration = 4000,
  onClose,
}) {
  const timerRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  // التحكم في وقت الاختفاء التلقائي
  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      if (duration > 0) {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          onClose?.();
        }, duration);
      }
    } else {
      setShouldRender(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [visible, duration, onClose]);

  // لو مش visible مش هنعرض حاجة خالص
  if (!shouldRender) return null;

  return (
    <div className="fixed top-[130px] right-[22px] z-[99999] pointer-events-none flex justify-end">
      <div className="relative w-[403px] min-h-[82px] bg-[#F3F5F6] rounded-[8px] px-4 py-3 flex items-center gap-4 overflow-hidden pointer-events-auto shadow-[0px_8px_10px_rgba(0,0,0,0.20),0px_6px_30px_rgba(0,0,0,0.12),0px_16px_24px_rgba(0,0,0,0.14)] animate-[slideIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)_both]">

        {/* Radial glow */}
        <div
          className="absolute inset-0 z-[1]"
          style={{ background: 'radial-gradient(circle at 30px 50%, rgba(0,237,81,0.15) 0%, rgba(0,237,123,0.05) 40%, transparent 70%)' }}
        />

        {/* Icon circle */}
        <div className="relative z-[2] w-[35px] h-[35px] rounded-full bg-[#303746] flex items-center justify-center shrink-0">
          <IoCheckmarkCircleSharp className="text-[24px] text-[#00DF80]" />
        </div>

        {/* Text */}
        <div className="flex-1 z-[2]">
          <h4 className="text-[16px] font-semibold text-black-main-text m-0">{title}</h4>
          <p className="text-[13px] text-gray-500 mt-0.5 m-0">{message}</p>
        </div>

      </div>
    </div>
  );
}