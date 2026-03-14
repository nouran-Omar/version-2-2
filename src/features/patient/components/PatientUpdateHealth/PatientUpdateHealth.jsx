import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LuHeartPulse, LuDroplet, LuActivity, LuRuler,
  LuBeaker, LuCheck, LuChevronDown,
} from 'react-icons/lu';
import { FaHeartPulse } from 'react-icons/fa6';
import { HiOutlineCog6Tooth } from 'react-icons/hi2';
import Toast from '../../../../components/Toast/Toast';

/* ── Dropdown options ─────────────────────────────── */
const HEART_RATE_OPTIONS = [
  { label: 'Below Normal  (< 60 bpm)', value: '<60' },
  { label: 'Normal  (60 – 100 bpm)',   value: '60-100' },
  { label: 'Elevated  (> 100 bpm)',    value: '>100' },
];
const BP_OPTIONS = [
  { label: 'Low  (< 90/60 mmHg)',         value: 'low' },
  { label: 'Normal  (90/60 – 120/80)',     value: 'normal' },
  { label: 'Elevated  (120/80 – 130/80)',  value: 'elevated' },
  { label: 'High  (> 130/80 mmHg)',        value: 'high' },
];
const BLOOD_COUNT_OPTIONS = [
  { label: 'Low  (< 12 g/dL)',      value: 'low' },
  { label: 'Normal  (12 – 17 g/dL)', value: 'normal' },
  { label: 'High  (> 17 g/dL)',      value: 'high' },
];

/* ── SelectField ──────────────────────────────────── */
function SelectField({ label, icon, value, onChange, options, placeholder, required }) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <div className="flex flex-col gap-1.5 relative ">
      <label className="text-xs font-bold text-black-main-text">
        {label}
        {required && <span className="text-[#DC2626] ml-0.5">*</span>}
      </label>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between bg-[#f9fafb] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#155DFC] transition-colors w-full"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-gray-400 text-[14px]">{icon}</span>
          <span className={selected ? 'text-black-main-text' : 'text-gray-400'}>
            {selected ? selected.label : placeholder}
          </span>
        </div>
        <LuChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[#EEF2FF] hover:text-brand-main
                ${value === opt.value ? 'bg-[#EEF2FF] text-brand-main font-semibold' : 'text-gray-700'}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── NumberField ──────────────────────────────────── */
function NumberField({ label, icon, value, onChange, placeholder, unit, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="flex items-center bg-[#f9fafb] border border-gray-200 rounded-xl px-4 py-3 gap-2.5 focus-within:border-[#155DFC] transition-colors">
        <span className="text-gray-400 text-[14px] shrink-0">{icon}</span>
        <input
          type="number"
          min="0"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent outline-none w-full text-sm text-black-main-text placeholder-gray-400"
        />
        {unit && <span className="text-gray-400 text-xs shrink-0">{unit}</span>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PatientUpdateHealth  —  /patient/update-health
═══════════════════════════════════════════════════ */
export default function PatientUpdateHealth() {
  const navigate = useNavigate();

  const [toast, setToast] = useState({ visible: false, title: '', msg: '' });
  const showToast = (title, msg) => {
    setToast({ visible: true, title, msg });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3500);
  };

  const [form, setForm] = useState({
    heartRate:     '',
    bloodPressure: '',
    bloodCount:    '',
    height:        '',
    bloodSugar:    '',
    weight:        '',
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.heartRate)     e.heartRate     = 'Required';
    if (!form.bloodPressure) e.bloodPressure = 'Required';
    if (!form.bloodCount)    e.bloodCount    = 'Required';
    if (!form.height)        e.height        = 'Required';
    if (!form.bloodSugar)    e.bloodSugar    = 'Required';
    if (!form.weight)        e.weight        = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    showToast('Health Data Updated', 'Your health information has been saved successfully.');
    setTimeout(() => navigate('/patient/settings'), 2000);
  };

  return (
    <div className="flex flex-col gap-6 font-roboto p-5">

      {/* Toast */}
      <Toast
        visible={toast.visible}
        title={toast.title}
        message={toast.msg}
        type="success"
        onClose={() => setToast(t => ({ ...t, visible: false }))}
      />

      {/* ── Page header ─────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2 text-black-main-text">
          <HiOutlineCog6Tooth className="text-black-main-text" />
          Settings &amp; Profile
        </h1>
        <p className="text-sm text-gray-text-dim2 mt-1">
          Manage your personal details, health data, and account preferences.
        </p>
      </div>

      {/* ── Form Card ───────────────────────────────── */}
      <div className="overflow-hidden">

        {/* Card header */}
        <div
          className="flex items-center justify-center mx-8 my-6"
        >
        
          <span className="text-[#101828]  font-bold text-3xl">Updating Health Data</span>
        </div>

        <div className="p-6 sm:p-8">
      {/* تغيير عدد الأعمدة لـ 3 في الشاشات الكبيرة */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

  {/* Heart Rate — خليناه ياخد مساحة عمودين */}
  <div className="sm:col-span-2">
    <SelectField
      label="Heart Rate"
      icon={<FaHeartPulse />}
      value={form.heartRate}
      onChange={v => set('heartRate', v)}
      options={HEART_RATE_OPTIONS}
      placeholder="Select your heart rate range"
      required
    />
    {errors.heartRate && (
      <p className="text-[#DC2626] text-xs mt-1">{errors.heartRate}</p>
    )}
  </div>

  {/* Height — هياخد العمود التالت اللي فاضي */}
  <div>
    <NumberField
      label="Height"
      icon={<LuRuler />}
      value={form.height}
      onChange={v => set('height', v)}
      placeholder="cm"
      unit="cm"
      required
    />
    {errors.height && (
      <p className="text-red-500 text-xs mt-1">{errors.height}</p>
    )}
  </div>

  {/* Blood Pressure — برضه هياخد عمودين عشان يبقا تحت الـ Heart Rate بنفس الحجم */}
  <div className="sm:col-span-2">
    <SelectField
      label="Blood Pressure"
      icon={<LuDroplet />}
      value={form.bloodPressure}
      onChange={v => set('bloodPressure', v)}
      options={BP_OPTIONS}
      placeholder="Select your blood pressure range"
      required
    />
    {errors.bloodPressure && (
      <p className="text-red-500 text-xs mt-1">{errors.bloodPressure}</p>
    )}
  </div>

  {/* Blood Sugar — هياخد العمود التالت */}
  <div>
    <NumberField
      label="Blood Sugar"
      icon={<LuActivity />}
      value={form.bloodSugar}
      onChange={v => set('bloodSugar', v)}
      placeholder="mg/dL"
      unit="mg/dL"
      required
    />
    {errors.bloodSugar && (
      <p className="text-red-500 text-xs mt-1">{errors.bloodSugar}</p>
    )}
  </div>

  {/* Blood Count — هياخد عمودين */}
  <div className="sm:col-span-2">
    <SelectField
      label="Blood Count"
      icon={<LuActivity />}
      value={form.bloodCount}
      onChange={v => set('bloodCount', v)}
      options={BLOOD_COUNT_OPTIONS}
      placeholder="Select your blood count range"
      required
    />
    {errors.bloodCount && (
      <p className="text-red-500 text-xs mt-1">{errors.bloodCount}</p>
    )}
  </div>

  {/* Weight — هياخد العمود التالت */}
  <div>
    <NumberField
      label="Weight"
      icon={<LuActivity />}
      value={form.weight}
      onChange={v => set('weight', v)}
      placeholder="kg"
      unit="kg"
      required
    />
    {errors.weight && (
      <p className="text-red-500 text-xs mt-1">{errors.weight}</p>
    )}
  </div>

</div>

          {/* Save button */}
          <div className="flex justify-center mt-10">
            <button
              onClick={handleSave}
              className="bg-brand-main hover:bg-blue-700 text-white px-12 py-3 rounded-full font-bold flex items-center gap-2 transition-colors text-sm shadow-md shadow-blue-200 mt-4"
            >
              Save  Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
