import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import { LuQrCode, LuCalendarDays, LuDownload, LuShare2, LuShieldCheck } from 'react-icons/lu';
import { HiOutlineLightBulb, HiOutlineCheckBadge } from 'react-icons/hi2';
import { RiNumbersLine, RiCheckFill, RiTestTubeLine, RiBodyScanLine, RiCapsuleLine, RiHeartPulseLine } from 'react-icons/ri';

/* ── QR Content list ───────────────────────────────── */
const QR_CONTENTS = [
  { label: 'Blood Test Results',    icon: RiTestTubeLine,    color: '#EF4444', bg: '#FEF2F2' },
  { label: 'Radiology Scans',       icon: RiBodyScanLine,    color: '#8B5CF6', bg: '#F5F3FF' },
  { label: 'Medication Reports',    icon: RiCapsuleLine,     color: '#059669', bg: '#ECFDF5' },
  { label: 'Vital Signs History',   icon: RiHeartPulseLine,  color: '#333CF5', bg: '#EEF2FF' },
];

/* ── How-to steps ──────────────────────────────────── */
const HOW_TO_STEPS = [
  { step: '01', text: 'Open your phone camera or a QR scanner app.' },
  { step: '02', text: 'Point it at the QR code until it focuses.' },
  { step: '03', text: 'Tap the notification to open your records.' },
];

/* ══════════════════════════════════════════════════════
   PatientQRCode Component
══════════════════════════════════════════════════════ */
const PatientQRCode = () => {
  const qrRef = useRef(null);

  const [userData] = useState({
    name: 'Nouran Omar',
    patientId: 'PT-20241019-008',
    generatedDate: '19/10/2024',
    totalFiles: 8,
    avatarInitials: 'NO',
    medicalImages: [
      'https://images.unsplash.com/photo-1530026405186-ed1f1305b3c2?w=500',
      'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=500',
    ],
  });

  /* ── Download PDF ── */
  const downloadPDF = async () => {
    const doc = new jsPDF();
    const svgEl = qrRef.current?.querySelector('svg');

    if (svgEl) {
      const svgData = new XMLSerializer().serializeToString(svgEl);
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      await new Promise((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0, 200, 200);
          URL.revokeObjectURL(url);
          resolve();
        };
        img.src = url;
      });

      doc.setFontSize(22);
      doc.setTextColor(1, 2, 24);
      doc.text('PulseX - Medical QR Report', 105, 20, { align: 'center' });

      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Patient: ${userData.name}`, 20, 35);
      doc.text(`Patient ID: ${userData.patientId}`, 20, 43);
      doc.text(`Generated on: ${userData.generatedDate}`, 20, 51);
      doc.text(`Total Files: ${userData.totalFiles}`, 20, 59);

      const qrImgData = canvas.toDataURL('image/png');
      doc.addImage(qrImgData, 'PNG', 80, 68, 50, 50);

      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text('Scan this QR code to access all medical records securely.', 105, 126, { align: 'center' });
    }

    for (let i = 0; i < userData.medicalImages.length; i++) {
      doc.addPage();
      doc.setFontSize(14);
      doc.setTextColor(1, 2, 24);
      doc.text(`Medical Document ${i + 1}`, 20, 15);
      try {
        doc.addImage(userData.medicalImages[i], 'JPEG', 15, 25, 180, 150);
      } catch {
        doc.setFontSize(11);
        doc.setTextColor(150);
        doc.text('Image could not be loaded.', 20, 40);
      }
    }

    doc.save(`PulseX_Records_${userData.name.replace(' ', '_')}.pdf`);
  };

  /* ── Share (Web Share API with clipboard fallback) ── */
  const handleShare = async () => {
    const shareUrl = `https://pulsex-app.com/records/${userData.patientId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My PulseX Medical Records', url: shareUrl });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('[PatientQRCode] Share failed:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch (err) {
        console.warn('[PatientQRCode] Clipboard write failed:', err);
      }
    }
  };

  return (
    <section className="flex flex-col gap-6 p-5 sm:p-6">

      {/* ── Page Header ── */}
      <header className="flex flex-col gap-2 pb-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-[#333CF50D] text-brand-main text-[18px] shrink-0">
            <LuQrCode />
          </div>
          <h1 className="text-[18px] font-bold text-black-main-text font-roboto">
            Your Personal QR Code
          </h1>
        </div>
        <p className="text-[13px] text-gray-500 leading-relaxed max-w-xl font-roboto">
          Access all your medical records instantly by scanning this code.
        </p>
      </header>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ══ Left: QR Card ══ */}
        <div className="bg-white rounded-[22px] border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-5">

          {/* Patient identity strip */}
          <div className="w-full flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-main to-brand-dark flex items-center justify-center text-white font-bold text-[14px] shrink-0 font-roboto">
              {userData.avatarInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-black-main-text truncate font-roboto">{userData.name}</p>
              <p className="text-[11px] text-gray-400 font-roboto">{userData.patientId}</p>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#059669] bg-[#ECFDF5] px-2.5 py-1 rounded-full shrink-0 font-roboto">
              <HiOutlineCheckBadge className="text-[14px]" />
              Verified
            </span>
          </div>

          {/* QR Code */}
          <div
            ref={qrRef}
            className="p-4 rounded-[20px] border border-gray-100 bg-gray-50 shadow-inner"
          >
            <QRCodeSVG
              value={`https://pulsex-app.com/records/${userData.patientId}`}
              size={190}
              bgColor="#ffffff"
              fgColor="#010218"
              level="H"
            />
          </div>

          {/* Meta info */}
          <div className="w-full grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-0.5 bg-gray-50 rounded-[14px] px-3.5 py-3">
              <span className="text-[10px] text-gray-400 uppercase tracking-wide font-roboto">Generated</span>
              <div className="flex items-center gap-1.5 text-[13px] font-semibold text-black-main-text font-roboto">
                <LuCalendarDays className="text-brand-main shrink-0" />
                {userData.generatedDate}
              </div>
            </div>
            <div className="flex flex-col gap-0.5 bg-gray-50 rounded-[14px] px-3.5 py-3">
              <span className="text-[10px] text-gray-400 uppercase tracking-wide font-roboto">Total Files</span>
              <div className="flex items-center gap-1.5 text-[13px] font-semibold text-black-main-text font-roboto">
                <RiNumbersLine className="text-brand-main shrink-0" />
                {userData.totalFiles} Files
              </div>
            </div>
          </div>

          {/* Security note */}
          <div className="w-full flex items-center gap-2 bg-[#F0FDF4] rounded-[12px] px-3.5 py-2.5">
            <LuShieldCheck className="text-[#059669] text-[16px] shrink-0" />
            <p className="text-[11px] text-[#059669] font-semibold font-roboto">
              End-to-end encrypted & HIPAA compliant
            </p>
          </div>

          {/* Action buttons */}
          <div className="w-full grid grid-cols-2 gap-3">
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 border border-brand-main text-brand-main font-bold rounded-full py-2.5 text-[13px] transition-colors hover:bg-[#333CF50D] cursor-pointer font-roboto"
            >
              <LuShare2 className="text-[15px]" />
              Share
            </button>
            <button
              className="flex items-center justify-center gap-2 bg-brand-main hover:bg-[#2830d4] text-white font-bold rounded-full py-2.5 text-[13px] transition-colors cursor-pointer font-roboto"
              onClick={downloadPDF}
            >
              <LuDownload className="text-[15px]" />
              Download PDF
            </button>
          </div>
        </div>

        {/* ══ Right: Details Column ══ */}
        <div className="flex flex-col gap-4">

          {/* What's inside */}
          <div className="bg-white rounded-[22px] border border-gray-100 shadow-sm p-5">
            <h3 className="text-[14px] font-bold text-black-main-text mb-4 font-roboto">
              What's inside your QR Code?
            </h3>
            <ul className="flex flex-col gap-2.5">
              {QR_CONTENTS.map(({ label, icon, color, bg }) => {
                const Comp = icon;
                return (
                  <li key={label} className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 text-[15px]"
                      style={{ background: bg, color }}
                    >
                      <Comp />
                    </span>
                    <span className="flex-1 text-[13px] text-[#010218B2] font-roboto">{label}</span>
                    <RiCheckFill className="text-[#00BC86] text-base shrink-0" />
                  </li>
                );
              })}
            </ul>
          </div>

          {/* How to use */}
          <div className="bg-white rounded-[22px] border border-gray-100 shadow-sm p-5">
            <h3 className="text-[14px] font-bold text-black-main-text mb-4 font-roboto">
              How to use
            </h3>
            <ol className="flex flex-col gap-3">
              {HOW_TO_STEPS.map(({ step, text }) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#333CF50D] text-brand-main text-[11px] font-bold flex items-center justify-center shrink-0 font-roboto">
                    {step}
                  </span>
                  <p className="text-[12px] text-gray-500 leading-relaxed pt-0.5 font-roboto">{text}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Tip gradient box */}
          <div
            className="rounded-[18px] p-5 flex flex-col gap-2"
            style={{ background: 'linear-gradient(160deg, #333CF5 0%, #070E92 100%)' }}
          >
            <div className="flex items-center gap-2">
              <HiOutlineLightBulb className="text-[#FFC500] text-[18px] shrink-0" />
              <span className="text-[13px] font-bold text-white font-roboto">Pro Tip</span>
            </div>
            <p className="text-[12px] text-[#FFFFFFCC] leading-relaxed font-roboto">
              Show this QR code to your doctor during appointments — it gives instant access to all your records securely and saves valuable consultation time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PatientQRCode;
