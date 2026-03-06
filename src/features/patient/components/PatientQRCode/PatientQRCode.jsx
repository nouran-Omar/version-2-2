import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import { LuQrCode, LuCalendarDays } from 'react-icons/lu';
import { HiOutlineCheckCircle, HiOutlineLightBulb } from 'react-icons/hi2';
import { RiNumbersLine } from 'react-icons/ri';
import {RiCheckFill } from 'react-icons/ri';

const PatientQRCode = () => {
  const qrRef = useRef(null);

  const [userData] = useState({
    name: 'Nouran Omar',
    generatedDate: '19/10/2024',
    totalFiles: 8,
    medicalImages: [
      'https://images.unsplash.com/photo-1530026405186-ed1f1305b3c2?w=500',
      'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=500',
    ],
  });

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
      doc.text(`Generated on: ${userData.generatedDate}`, 20, 43);
      doc.text(`Total Files: ${userData.totalFiles}`, 20, 51);

      const qrImgData = canvas.toDataURL('image/png');
      doc.addImage(qrImgData, 'PNG', 80, 60, 50, 50);

      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text('Scan this QR code to access all medical records securely.', 105, 118, { align: 'center' });
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

  return (
    <section className="flex flex-col gap-6 p-5 ">
      {/* Header */}
 <header className="flex flex-col gap-2 pb-4 border-b border-gray-100 mb-6">
  
  {/* السطر الأول: الأيقونة + العنوان */}
  <div className="flex items-center gap-1">
    {/* حاوية الأيقونة - باللون الأزرق المريح */}
    <div className="w-10 h-10 flex items-center justify-center rounded-xltext-black-main-text text-[20px] shrink-0">
      <LuQrCode />
    </div>

    {/* العنوان H1 جنب الأيقونة */}
    <h1 className="text-[18px] font-bold text-black-main-text">
      Your Personal QR Code
    </h1>
  </div>

  {/* السطر الثاني: الوصف تحتهم */}
  <p className="text-[12px] text-gray-500 leading-relaxed max-w-2xl">
    Access all your medical records instantly by scanning this code.
  </p>
  
</header>


      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Card */}
        <div className="bg-white rounded-[22px] border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-5">
          <div ref={qrRef} className="p-4 bg-gray-50 rounded-[16px] border border-gray-100">
            <QRCodeSVG
              value={`https://pulsex-app.com/records/${userData.name}`}
              size={200}
              bgColor="#ffffff"
              fgColor="#010218"
              level="H"
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2 text-[13px] text-black-main-text">
              <LuCalendarDays className="text-brand-main" />
              <span>Generated on: {userData.generatedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-black-main-text">
              <RiNumbersLine className="text-brand-main" />
              <span>Total Files: {userData.totalFiles}</span>
            </div>
          </div>

          <button
            className="w-full bg-brand-main hover:bg-[#2830d4] text-white font-bold rounded-full py-2.5 text-[13px] transition-colors"
            onClick={downloadPDF}
          >
            Download PDF
          </button>
        </div>

        {/* Details Column */}
        <div className="flex flex-col gap-4">
          {/* What's inside */}
          <div className="bg-white rounded-[22px] border border-gray-100 shadow-sm p-5">
            <h3 className="text-[14px] font-bold text-black-main-text mb-3">What's inside your QR Code?</h3>
            <ul className="flex flex-col gap-2">
              {['Blood Test Results', 'Radiology Scans', 'Medication Reports'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-[13px] text-[#010218B2]">
                  <RiCheckFill className="text-[#00BC86] text-base shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Tip Box */}
          <div className="border border-blue-100 rounded-[18px] p-4 flex flex-col gap-2"
          
          style={{background: 'linear-gradient(180deg, var(--Blue-1, #333CF5) 0%, var(--Blue-3, #070E92) 100%)'}}
          >
            <div className="flex items-center gap-2">
              <HiOutlineLightBulb className="text-[#FFC500] text-lg" />
              <span className="text-[13px] font-bold text-white">Tip:</span>
            </div>
            <p className="text-[12px] text-[#FFFFFFCC] leading-relaxed">
              Show this QR code to your doctor during appointments — it gives instant access to all your records securely.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PatientQRCode;
