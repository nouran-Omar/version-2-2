import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineArrowUpTray, HiOutlineCalendar, HiOutlineUser, HiOutlineClock, HiOutlineTrash } from 'react-icons/hi2';
import { TbStethoscope, TbCapsule, TbClipboardText, TbFileText } from 'react-icons/tb';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import { ALL_PRESCRIPTIONS } from '../PatientPrescriptions/PatientPrescriptions';

/* ─────────────────────────────────────────────────────────────────── */
const PrescriptionDetail = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const location     = useLocation();
  const fileInputRefs = useRef({});

  const [data, setData]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [labUploads, setLabUploads] = useState({});

  useEffect(() => {
    setLoading(true);
    // 1. prefer data passed via navigation state (already have it)
    // 2. fall back to lookup from shared ALL_PRESCRIPTIONS array
    const fromState = location.state?.prescription;
    const found     = fromState || ALL_PRESCRIPTIONS.find((p) => p.id === id) || ALL_PRESCRIPTIONS[0];
    const t = setTimeout(() => { setData(found); setLoading(false); }, 400);
    return () => clearTimeout(t);
  }, [id, location.state]);

  const handleFileUpload = (e, labId) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLabUploads((prev) => ({
      ...prev,
      [labId]: { url, name: file.name, size: (file.size / 1024 / 1024).toFixed(2) },
    }));
  };

  const handleRemove = (labId) => {
    setLabUploads((prev) => {
      const copy = { ...prev };
      delete copy[labId];
      return copy;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7f8] flex items-center justify-center">
        <p className="text-brand-main font-bold text-[16px] animate-pulse">Loading prescription…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">

  

      {/* ── Main Card ─────────────────────────────────── */}
      <div className=" rounded-[24px] overflow-hidden  mx-auto w-full">

        {/* ── Blue Header ─────────────────────────────── */}
      <div 
  className="px-8 py-7 w-full" 
  style={{ background: "linear-gradient(90deg, #155DFC 0%, #1447E6 100%)" }}
><div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            {/* Doctor */}
            <div className="flex items-center gap-3 text-white">
              <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center text-[22px] shrink-0">
                <TbStethoscope />
              </div>
              <div>
                <span className="text-[12px] opacity-80 block">Prescribed by</span>
                <h4 className="text-[17px] font-bold m-0 leading-tight">{data.doc}</h4>
                <p className="text-[12px] opacity-80 m-0">{data.spec}</p>
              </div>
            </div>
            {/* Patient */}
            <div className="flex items-center gap-3 text-white">
              <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center text-[22px] shrink-0">
                <HiOutlineUser />
              </div>
              <div>
                <span className="text-[12px] opacity-80 block">Patient</span>
                <h4 className="text-[17px] font-bold m-0 leading-tight">{data.patientName}</h4>
                <p className="text-[12px] opacity-80 m-0">ID: {data.patientID}</p>
              </div>
            </div>
            {/* Date */}
            <div className="flex items-center gap-3 text-white">
              <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center text-[22px] shrink-0">
                <HiOutlineCalendar />
              </div>
              <div>
                <span className="text-[12px] opacity-80 block">Date Issued</span>
                <h4 className="text-[17px] font-bold m-0 leading-tight">{data.date}</h4>
                <p className="text-[12px] opacity-80 m-0 flex items-center gap-1">
                  <HiOutlineClock className="text-[13px]" /> {data.time}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Scroll Body ───────────────────────────────── */}
        <div className="p-6 sm:p-10 flex flex-col gap-8">

          {/* ── Medications ─────────────────────────────── */}
          <section>
         <div 
  className="flex items-center gap-2 text-black-main-text font-bold text-[14px] px-4 py-4 rounded-xl mb-5"
  style={{ background: 'linear-gradient(90deg, #FAF5FF 0%, #F3E8FF 100%)' }}
>

            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M8.75082 17.0832L17.0841 8.74984C17.4735 8.36823 17.7834 7.91322 17.9959 7.41111C18.2083 6.90899 18.3191 6.36975 18.3219 5.82454C18.3246 5.27934 18.2193 4.739 18.0119 4.23477C17.8046 3.73054 17.4993 3.27242 17.1138 2.8869C16.7282 2.50137 16.2701 2.1961 15.7659 1.98873C15.2617 1.78136 14.7213 1.67601 14.1761 1.67876C13.6309 1.68152 13.0917 1.79232 12.5895 2.00478C12.0874 2.21723 11.6324 2.52711 11.2508 2.91651L2.91748 11.2498C2.52809 11.6314 2.21821 12.0865 2.00575 12.5886C1.7933 13.0907 1.68249 13.6299 1.67974 14.1751C1.67699 14.7203 1.78234 15.2607 1.98971 15.7649C2.19708 16.2691 2.50235 16.7273 2.88787 17.1128C3.27339 17.4983 3.73151 17.8036 4.23575 18.0109C4.73998 18.2183 5.28032 18.3237 5.82552 18.3209C6.37072 18.3182 6.90997 18.2074 7.41208 17.9949C7.91419 17.7824 8.36921 17.4726 8.75082 17.0832Z" stroke="#9810FA" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M7.07812 7.0835L12.9115 12.9168" stroke="#9810FA" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg> Prescribed Medications
            </div>
            <div className="flex flex-col gap-4">
              {data.medications.map((med, i) => (
                <div
                  key={i}
                  className="border border-[#f3f4f6] border-l-4 border-l-[#AD46FF] rounded-2xl p-5 flex gap-4 bg-white"
                >
                  <div className="w-8 h-8 bg-[#AD46FF] text-white rounded-lg flex items-center justify-center font-bold text-[14px] shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h5 className="text-[16px] font-bold text-black-main-text m-0 mb-1">{med.name}</h5>
                    <p className="text-[13px] text-[#4A5565] m-0 mb-4">Dosage: {med.dose}</p>
                    <div className="flex gap-4 flex-wrap">
                      <div className="flex-1 min-w-[120px] bg-[#fafafa] border border-[#f3f4f6] rounded-xl p-3">
                        <span className="text-[11px] text-[#4A5565] block mb-1">Frequency</span>
                        <strong className="text-[13px] text-black-main-text font-semibold">{med.freq}</strong>
                      </div>
                      <div className="flex-1 min-w-[100px] bg-[#fafafa] border border-[#f3f4f6] rounded-xl p-3">
                        <span className="text-[11px] text-[#4A5565] block mb-1">Duration</span>
                        <strong className="text-[13px] text-black-main-text] font-semibold">{med.dur}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Important Instructions */}
            <div className="flex items-start gap-3 bg-[#FFFBEB] border border-[#FEE685] rounded-xl p-4 mt-5">
              <FaExclamationCircle className="text-[#E17100] text-[18px] shrink-0 mt-[2px]" />
              <div>
                <p className="text-[13px] font-bold text-[#7B3306] m-0 mb-1">Important Instructions</p>
                <p className="text-[13px] text-[#973C00] m-0 leading-relaxed">{data.instructions}</p>
              </div>
            </div>
          </section>

          {/* ── Labs & Radiology ────────────────────────── */}
          <section>
          <div 
  className="flex items-center gap-2 text-black-main-text font-bold text-[14px] px-4 py-3 rounded-xl mb-5"
  style={{ background: 'linear-gradient(90deg, #F0FDF4 0%, #DCFCE7 100%)' }}
>
              <TbClipboardText className="text-[18px] text-[#00A63E]" />
              Lab &amp; Radiology Requests
            </div>
            <div className="flex flex-col gap-3">
              {data.labs.map((lab, i) => (
                <div
                  key={lab.id}
                  className="bg-white border border-[#00c9503a] border-l-4 border-l-[#00C950] rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div className="w-7 h-7 bg-[#00C950] text-white rounded-lg flex items-center justify-center text-[13px] font-bold shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <h6 className="text-[15px] font-semibold text-black-main-text m-0">{lab.name}</h6>
                        {lab.note && <p className="text-[12px] text-[#4A5565] m-0 mt-[2px]">Note: {lab.note}</p>}
                      </div>
                    </div>
                    <button
                      onClick={() => fileInputRefs.current[lab.id]?.click()}
                      className="flex items-center gap-2 bg-brand-main text-white font-semibold text-[13px] px-5 py-[9px] rounded-xl border-none cursor-pointer transition-opacity hover:opacity-90 shrink-0"
                    >
                      <HiOutlineArrowUpTray className="text-[15px]" /> Upload Result
                    </button>
                    <input
                      type="file"
                      hidden
                      accept="image/*,.pdf"
                      ref={(el) => (fileInputRefs.current[lab.id] = el)}
                      onChange={(e) => handleFileUpload(e, lab.id)}
                    />
                  </div>

                  {/* Upload Preview */}
                  {labUploads[lab.id] && (
                    <div className="mt-4 bg-[#f0fdf4] border border-[#dcfce7] rounded-xl p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={labUploads[lab.id].url}
                          alt="Result"
                          className="w-14 h-14 rounded-xl object-cover border-2 border-[#10b981]"
                        />
                        <div className="flex flex-col gap-1">
                          <span className="text-[14px] font-bold text-black-main-text">{labUploads[lab.id].name}</span>
                          <span className="text-[12px] text-[#6b7280]">{labUploads[lab.id].size} MB • Attached</span>
                          <span className="text-[12px] text-[#00a63e] font-bold flex items-center gap-1">
                            <FaCheckCircle /> Verified Result
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemove(lab.id)}
                        className="text-[#ef4444] text-[20px] bg-none border-none cursor-pointer p-1 hover:opacity-75 transition-opacity"
                      >
                        <HiOutlineTrash />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Lab Visit Instructions */}
            <div className="flex items-start gap-3 bg-[#eff6ff] border border-[#dbeafe] rounded-xl p-4 mt-4">
              <FaInfoCircle className="text-[#155DFC] text-[17px] shrink-0 mt-[2px]" />
              <div>
                <p className="text-[13px] font-bold text-[#1C398E] m-0 mb-1">Lab Visit Instructions</p>
                <p className="text-[13px] text-[#193CB8] m-0 leading-relaxed">{data.labInstructions}</p>
              </div>
            </div>
          </section>

          {/* ── Clinical Notes ───────────────────────────── */}
          <section>
         <div 
  className="flex items-center gap-2 text-black-main-text font-bold text-[14px] px-4 py-3 rounded-xl mb-5"
  style={{ background: 'linear-gradient(90deg, #FFF7ED 0%, #FFEDD4 100%)' }}
>
              <TbFileText className="text-[18px] text-[#F54900]" />
              Clinical Notes &amp; Instructions
            </div>
            <div className="bg-[#f9fafb] border border-[#f3f4f6] rounded-xl p-5 text-[14px] text-[#364153] leading-relaxed">
              {data.clinicalNotes}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrescriptionDetail;