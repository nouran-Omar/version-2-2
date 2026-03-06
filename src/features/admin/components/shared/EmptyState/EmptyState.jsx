import React from 'react';

export default function EmptyState({
  icon,
  title,
  description,
  buttonLabel,
  onAction,
  accentColor = '#EFF6FF',
  iconColor   = '#2563EB',
}) {
  return (
    <div className="flex items-center justify-center py-16 px-4">
      <div className="flex flex-col items-center gap-4 text-center max-w-[340px]">
        {icon && (
          <div className="w-14 h-14 flex items-center justify-center rounded-[16px] text-[24px]" style={{ background: accentColor, color: iconColor }}>
            {icon}
          </div>
        )}
        <h2 className="text-[17px] font-bold text-black-main-text">{title}</h2>
        {description && <p className="text-[13px] text-gray-500 leading-relaxed">{description}</p>}
        {buttonLabel && onAction && (
          <button onClick={onAction} className="mt-1 px-5 py-2.5 text-[13px] font-semibold text-white rounded-[10px] hover:opacity-90 transition-opacity" style={{ background: iconColor }}>
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
}
