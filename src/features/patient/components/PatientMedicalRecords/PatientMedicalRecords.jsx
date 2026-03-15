import React, { useState, useRef, useCallback } from 'react';
import {
  LuClipboardList, LuTrash2, LuFileText, LuQrCode,
} from 'react-icons/lu';
import { HiOutlineUpload } from 'react-icons/hi';
import { RiRocketLine } from 'react-icons/ri';
import { FaRegFileAlt, FaCalendarAlt, FaXRay, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { TbActivityHeartbeat } from 'react-icons/tb';
import { IoClose } from 'react-icons/io5';
import { MdOutlineBarChart } from 'react-icons/md';
import Qrcodepatiant from '../../../../assets/Images/Qrcodepatiant.svg'
// ─── Config ────────────────────────────────────────────────────────────────────
const BRAND = {
  main:  '#333CF5',   // Blue-1
  blue2: '#2B7FFF',   // Blue-2 / bg-blue-500
  dark:  '#010218',   // Black-Main-Text
  bg:    '#FFFFFFE5',   // BG-Main
};

const CATEGORY_CONFIG = {
  ECG: {
    label:       'ECG',
    icon:        <TbActivityHeartbeat />,
    description: 'Keep track of your latest ECG results (Optional)',
    color:       '#333CF5',
    bg:          '#EEF0FF',
    accept:      '.jpeg,.jpg,.png',
    formats:     'JPEG, PNG',
  },
  Radiology: {
    label:       'Radiology',
    icon:        <FaXRay />,
    description: 'Upload your X-rays or CT (Optional)',
    color:       '#333CF5',
    bg:          '#EEF0FF',
    accept:      '.jpeg,.jpg,.png',
    formats:     'JPEG, PNG',
  },
  'Medical File': {
    label:       'Other Medical Files',
    icon:        <LuFileText />,
    description: 'Upload any additional medical reports, lab results, or scans.',
    color:       '#333CF5',
    bg:          '#EEF0FF',
    accept:      '.jpeg,.jpg,.png,.pdf',
    formats:     'JPEG, PNG, PDF',
  },
};

const TYPE_COLORS = {
  PNG:  { bg: '#fff', color: '#010218' },
  PDF:  { bg: '#FFF', color: '#010218' },
  JPEG: { bg: '#fff', color: '#010218' },
  JPG:  { bg: '#fff', color: '#010218' },
};

const STAT_ITEMS = [
  { key: 'total',    label: 'Total Files Uploaded', icon: <MdOutlineBarChart />,  iconBg: '#DBEAFE', iconColor: '#2B7FFF',  valueColor: '#2B7FFF'  },
  { key: 'ecg',     label: 'ECG Files',             icon: <TbActivityHeartbeat />, iconBg: '#DCFCE7', iconColor: '#00C950',  valueColor: '#00C950'  },
  { key: 'xray',    label: 'X-rays Files',          icon: <FaXRay />,             iconBg: '#F3E8FF', iconColor: '#AD46FF',  valueColor: '#AD46FF'  },
  { key: 'medical', label: 'Medical files',         icon: <FaRegFileAlt />,       iconBg: '#FEF9C2', iconColor: '#F0B100',  valueColor: '#F0B100'  },
  { key: 'lastDate',label: 'Last Upload',           icon: <FaCalendarAlt />,      iconBg: '#FFEDD4', iconColor: '#FF6900',  valueColor: '#FF6900', isDate: true },
];

let nextId = 10;


const formatFileSize = (bytes) => {
  if (bytes < 1024)            return `${bytes} B`;
  if (bytes < 1024 * 1024)    return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getExt = (filename) => filename.split('.').pop().toUpperCase();

const todayStr = () => new Date().toLocaleDateString('en-GB');
const PatientMedicalRecords = () => {
  const [documents, setDocuments] = useState([
    { id: 1, name: 'BloodT', type: 'PNG',  size: '29 KB', date: '18/10/2025', category: 'ECG' },
    { id: 2, name: 'BPdf',   type: 'PDF',  size: '1 MB',  date: '1/9/2025',  category: 'ECG' },
    { id: 3, name: 'BPdf',   type: 'PDF',  size: '1 MB',  date: '1/9/2025',  category: 'Medical File' },
    { id: 4, name: 'Scan',   type: 'JPEG', size: '26 KB', date: '18/8/2025', category: 'Radiology' },
    { id: 5, name: 'Photo',  type: 'PNG',  size: '2 KB',  date: '16/8/2025', category: 'Radiology' },
  ]);

  const [selected, setSelected]     = useState([]);
  const [dragOver, setDragOver]     = useState(null);
  const fileInputRefs               = useRef({});

  // Confirm delete modal
  const [confirmModal, setConfirmModal] = useState({ open: false, ids: [], label: '' });
  // Success toast
  const [successToast, setSuccessToast] = useState({ open: false, message: '' });

  // ── Toast helper ──────────────────────────────────────────────────────────────
  const showSuccess = (message) => {
    setSuccessToast({ open: true, message });
    setTimeout(() => setSuccessToast({ open: false, message: '' }), 3000);
  };

  // ── Delete helpers ────────────────────────────────────────────────────────────
  const openConfirm  = (ids, label) => setConfirmModal({ open: true, ids, label });
  const closeConfirm = ()           => setConfirmModal({ open: false, ids: [], label: '' });

  const confirmDelete = () => {
    const count = confirmModal.ids.length;
    setDocuments((prev) => prev.filter((d) => !confirmModal.ids.includes(d.id)));
    setSelected((prev)  => prev.filter((s)  => !confirmModal.ids.includes(s)));
    closeConfirm();
    showSuccess(count === 1 ? 'File deleted successfully.' : `${count} files deleted successfully.`);
  };

  // ── Upload helpers ────────────────────────────────────────────────────────────
  const addFiles = useCallback((files, category) => {
    const newDocs = Array.from(files).map((file) => ({
      id:       nextId++,
      name:     file.name.replace(/\.[^.]+$/, ''),
      type:     getExt(file.name),
      size:     formatFileSize(file.size),
      date:     todayStr(),
      category,
    }));
    setDocuments((prev) => [...prev, ...newDocs]);
    showSuccess(`${newDocs.length} file${newDocs.length > 1 ? 's' : ''} uploaded successfully.`);
  }, []);

  const handleFileInput = (e, category) => {
    if (e.target.files?.length) addFiles(e.target.files, category);
    e.target.value = '';
  };

  const handleDrop = (e, category) => {
    e.preventDefault();
    setDragOver(null);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files, category);
  };

  // ── Selection helpers ─────────────────────────────────────────────────────────
  const toggleSelect = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  const toggleAll = () =>
    setSelected(selected.length === documents.length ? [] : documents.map((d) => d.id));

  // ── Stats ─────────────────────────────────────────────────────────────────────
  const stats = {
    total:    documents.length,
    ecg:      documents.filter((d) => d.category === 'ECG').length,
    xray:     documents.filter((d) => d.category === 'Radiology').length,
    medical:  documents.filter((d) => d.category === 'Medical File').length,
    lastDate: documents.length
      ? [...documents].sort((a, b) => {
          // parse dd/mm/yyyy for comparison
          const parse = (s) => { const [d, m, y] = s.split('/'); return new Date(y, m - 1, d); };
          return parse(b.date) - parse(a.date);
        })[0].date
      : '—',
  };

  // ── Upload Zone ───────────────────────────────────────────────────────────────
  const renderUploadZone = (categoryKey) => {
    const cfg      = CATEGORY_CONFIG[categoryKey];
    const isActive = dragOver === categoryKey;

return (
      <div
        key={categoryKey}
        className="bg-white rounded-[22px] border border-gray-200 shadow-sm p-5 flex flex-col gap-4 transition-all w-full max-w-[465px]"
        style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.10), 0px 1px 2px -1px rgba(0,0,0,0.10)' }}
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <span
            className="w-12 h-12 rounded-[14px] flex items-center justify-center text-xl shrink-0"
            style={{ background: cfg.color, color: '#fff' }}
          >
            {cfg.icon}
          </span>
          <div>
            <p className="text-[16px] font-bold" style={{ color: BRAND.dark }}>{cfg.label}</p>
            <p className="text-[13px] text-neutral-500 mt-0.5">{cfg.description}</p>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          className="border-2 border-dashed rounded-[14px] p-8 flex flex-col items-center cursor-pointer transition-colors"
          style={{
            borderColor: isActive ? BRAND.main : '#D1D5DC',
            background: isActive ? '#EEF0FF' : 'transparent',
          }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(categoryKey); }}
          onDragLeave={() => setDragOver(null)}
          onDrop={(e) => handleDrop(e, categoryKey)}
          onClick={() => fileInputRefs.current[categoryKey]?.click()}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
            style={{ background: 'linear-gradient(135deg, #DBEAFE, #EEF2FF)' }}
          >
            <HiOutlineUpload className="text-2xl" style={{ color: BRAND.main }} />
          </div>
          <p className="text-[13px] text-gray-700 text-center">
            Drag &amp; drop {cfg.label} files or{' '}
            <span className="font-bold underline" style={{ color: '#155DFC' }}>Browse</span>
          </p>
          <p className="text-[11px] text-neutral-500 mt-1">Supported formats: {cfg.formats}</p>
        </div>

        <input
          type="file"
          accept={cfg.accept}
          multiple
          hidden
          ref={(el) => (fileInputRefs.current[categoryKey] = el)}
          onChange={(e) => handleFileInput(e, categoryKey)}
        />
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <section
      className="flex flex-col gap-6 p-[18px] min-h-screen bg-[#FFFFFFE5] "
      style={{ background: BRAND.bg, fontFamily: 'Roboto, sans-serif' }}
    >

      {/* ── Success Toast ───────────────────────────────────────────────────────── */}
      {successToast.open && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-white border border-green-200 rounded-[16px] shadow-lg px-5 py-3">
          <FaCheckCircle className="text-green-500 text-lg shrink-0" />
          <span className="text-[13px] font-semibold" style={{ color: BRAND.dark }}>{successToast.message}</span>
          <button
            className="text-gray-400 hover:text-gray-600 ml-2"
            onClick={() => setSuccessToast({ open: false, message: '' })}
          >
            <IoClose />
          </button>
        </div>
      )}

      {/* ── Confirm Delete Modal ────────────────────────────────────────────────── */}
      {confirmModal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(1,2,24,0.45)' }}
          onClick={closeConfirm}
        >
          <div
            className="bg-white rounded-[22px] shadow-xl p-6 max-w-sm w-full flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <FaExclamationTriangle className="text-red-600 text-xl" />
            </div>
            <h3 className="text-[16px] font-bold" style={{ color: BRAND.dark }}>
              Delete {confirmModal.ids.length > 1 ? `${confirmModal.ids.length} Files` : 'File'}?
            </h3>
            <p className="text-[13px] text-neutral-500 text-center leading-relaxed">
              {confirmModal.ids.length > 1
                ? `Are you sure you want to delete ${confirmModal.ids.length} selected files? This action cannot be undone.`
                : `Are you sure you want to delete "${confirmModal.label}"? This action cannot be undone.`}
            </p>
            <div className="flex gap-3 w-full">
              <button
                className="flex-1 border border-gray-200 rounded-xl py-2.5 text-[13px] font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={closeConfirm}
              >
                Cancel
              </button>
              <button
                className="flex-1 text-white rounded-xl py-2.5 text-[13px] font-bold flex items-center justify-center gap-2 transition-colors"
                style={{ background: '#E7000B' }}
                onClick={confirmDelete}
              >
                <LuTrash2 /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page Header ─────────────────────────────────────────────────────────── */}
    <header className="flex flex-col gap-1 pb-4 border-b border-gray-100">
  {/* الصف الأول: الأيقونة والـ Title جنب بعض */}
  <div className="flex items-center gap-1">
    <div className="w-10 h-10 flex items-center justify-center text-[24px] shrink-0" style={{ color: BRAND.dark }}>
      <LuClipboardList />
    </div>
    <h1 
      className="text-[24px] font-semibold tracking-tight" 
      style={{ color: BRAND.dark, fontFamily: 'Roboto, sans-serif' }}
    >
      Medical Records
    </h1>
  </div>

  {/* الصف الثاني: الـ Paragraph تحتهم */}
  <p 
    className="text-[18px] text-neutral-500 font-normal leading-tight" 
    style={{ fontFamily: 'Roboto, sans-serif'}} // المسافة دي عشان يبدأ من تحت كلمة Medical بالظبط
  >
    Upload and view your medical health easily.
  </p>
</header>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-items-center mb-16">
  
  <div className="w-full flex justify-center lg:justify-end">
    {renderUploadZone('ECG')}
  </div>

  <div className="w-full flex justify-center lg:justify-start">
    {renderUploadZone('Radiology')}
  </div>
  <div className="lg:col-span-2 w-full flex justify-center mt-4">
    <div className="w-full max-w-[465px]">
       {renderUploadZone('Medical File')}
    </div>
  </div>

</div>
<div 
  className="bg-white rounded-[22px] overflow-hidden p-5" 
>
  {/* List Header */}
  <div className="flex items-center justify-between px-6 py-4 ">
    
    {/* الجزء الشمال: العنوان والوصف */}
    <div className="flex flex-col gap-1">
      {/* الصف الأول: الأيقونة والعنوان جنب بعض */}
      <div className="flex items-center gap-3">
        <LuFileText className="text-[20px]" style={{ color: BRAND.main }} />
        <h2 className="text-[16px] font-medium" style={{ color: BRAND.dark, fontFamily: 'Roboto, sans-serif' }}>
          Document List
        </h2>
      </div>
      
      {/* الصف الثاني: الوصف تحتهم مع إزاحة بسيطة للمحاذاة */}
      <p 
        className="text-[13px] text-neutral-500 font-normal leading-tight" 
        style={{ fontFamily: 'Roboto, sans-serif'}}
      >
        “Manage and operate your document files.”
      </p>
    </div>

    {/* زر الحذف الجماعي (Bulk delete) يفضل على اليمين كما هو */}
    {selected.length > 0 && (
      <button
        className="flex items-center gap-1.5 text-white rounded-xl px-4 py-2 text-[12px] font-bold transition-all hover:opacity-90 active:scale-95"
        style={{ background: '#E7000B' }}
        onClick={() => openConfirm(selected, '')}
      >
        <LuTrash2 /> Delete Selected ({selected.length})
      </button>
    )}
  </div>
  


        {/* Table */}
        <div className="overflow-x-auto rounded-[20px] border border-gray-200" style={{ boxShadow: '0px 1px 3px rgba(0,0,0,0.06)' }}>
          <table className="w-full text-[14px] min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                <th className="pl-6 pr-2 py-5 text-left w-14">
                  <input
                    type="checkbox"
                    checked={selected.length === documents.length && documents.length > 0}
                    onChange={toggleAll}
                    className="w-[18px] h-[18px] rounded-[5px] border-2 border-gray-300 accent-[#333CF5] cursor-pointer"
                  />
                </th>
                <th className="px-4 py-5 text-left text-[13px] font-semibold text-gray-500 tracking-wide">File name</th>
                <th className="px-4 py-5 text-left text-[13px] font-semibold text-gray-500 tracking-wide">Type</th>
                <th className="px-4 py-5 text-left text-[13px] font-semibold text-gray-500 tracking-wide">Size</th>
                <th className="px-4 py-5 text-left text-[13px] font-semibold text-gray-500 tracking-wide">Uploaded Date</th>
                <th className="px-4 py-5 text-left text-[13px] font-semibold text-gray-500 tracking-wide">Record Type</th>
                <th className="pr-6 pl-2 py-5 text-center w-14">
                  <LuTrash2 className="text-red-500 text-[16px] mx-auto" />
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-[14px] text-neutral-400">
                    No documents yet. Upload your first file above.
                  </td>
                </tr>
              )}
              {documents.map((doc, idx) => {
                const isChecked = selected.includes(doc.id);
                const isLast = idx === documents.length - 1;
                return (
                  <tr
                    key={doc.id}
                    className={`transition-colors hover:bg-gray-50/60 ${!isLast ? 'border-b border-gray-100' : ''}`}
                    style={{ background: isChecked ? '#EEF0FF' : undefined }}
                  >
                    <td className="pl-6 pr-2 py-5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelect(doc.id)}
                        className="w-[18px] h-[18px] rounded-[5px] border-2 border-gray-300 accent-[#333CF5] cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-2.5">
                        <LuFileText className="text-[16px] shrink-0" style={{ color: BRAND.main }} />
                        <span className="font-semibold text-[14px]" style={{ color: BRAND.dark }}>{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <span className="font-bold text-[13px]" style={{ color: BRAND.dark }}>{doc.type}</span>
                    </td>
                    <td className="px-4 py-5 text-[13px] text-gray-400 font-medium">{doc.size}</td>
                    <td className="px-4 py-5 text-[13px] text-gray-400 font-medium">{doc.date}</td>
                    <td className="px-4 py-5 text-[13px] text-gray-500 font-medium">{doc.category}</td>
                    <td className="pr-6 pl-2 py-5 text-center">
                      <button
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        onClick={() => openConfirm([doc.id], doc.name)}
                        title="Delete"
                      >
                        <LuTrash2 className="text-[16px]" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Bottom Row: CTA + Stats ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* QR Code CTA */}
        <div
          className="rounded-[24px] p-8 flex flex-col items-center text-center gap-4"
          style={{
            background: 'linear-gradient(135deg, #EEF2FF 0%, #DBEAFE 60%, #EFF6FF 100%)',
            boxShadow: '0px 4px 20px 0px rgba(51,60,245,0.10)',
          }}
        >
      {/* الجزء الخاص بالـ QR Code Message */}
<div className="flex flex-col items-center text-center gap-3">
  
  {/* العنوان مع الأيقونة محاذير تماماً */}
  <h3 className="text-[20px] font-medium text-black-main-text flex items-center justify-center gap-3">
    <img 
      src={Qrcodepatiant} 
      alt="QR Icon" 
      className="w-12 h-12 object-contain"
      style={{ animation: 'float-qr 3s ease-in-out infinite' }}
    />
    All your medical files are ready!
  </h3>

  {/* الفقرات مع المسافات المظبوطة */}
  <div className="flex flex-col gap-1">
    <p className="text-[16px] text-gray-text-dim2 leading-tight">
      Your reports are now organized
    </p>
    <p className="text-[16px] text-gray-text-dim2 leading-tight">
      Generate your personal QR code to access them anytime.
    </p>
  </div>
</div>
          <button
            className="flex items-center gap-2 rounded-[32px] px-8 py-4 text-[13px] font-bold transition-colors hover:opacity-90"
            style={{
              background: 'linear-gradient(90deg, #2B7FFF, #E7000B)',
              color: '#fff',
              boxShadow: '0px 5px 15px 0px rgba(37,44,97,0.15), 0px 2px 4px 0px rgba(136,144,194,0.20)',
            }}
          >
            <RiRocketLine className="text-lg" />
            Generate QR Code
            <span>→</span>
          </button>
        </div>

        {/* Statistics Card */}
        <div
          className="bg-white rounded-[24px] overflow-hidden"
          style={{ boxShadow: '0px 4px 12px 0px rgba(0,0,0,0.12)', outline: '0.8px solid #E5E7EB' }}
        >
          {/* Stats Header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
            <div
              className="w-10 h-10 rounded-[14px] flex items-center justify-center text-white"
              style={{ background: '#155DFC' }}
            >
              <MdOutlineBarChart className="text-lg" />
            </div>
            <span className="text-[15px] font-bold" style={{ color: BRAND.dark }}>Statistics</span>
          </div>

          {/* Stats Items */}
          <div className="flex flex-col divide-y divide-gray-50 px-2 py-2">
            {STAT_ITEMS.map((s) => (
              <div
                key={s.key}
                className="flex items-center justify-between px-4 py-3 rounded-[14px]"
                style={{ background: s.isDate ? '#FFFFFFE5' : '#FFFFFFE5' }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-10 h-10 rounded-[10px] flex items-center justify-center text-sm"
                    style={{ background: s.iconBg, color: s.iconColor }}
                  >
                    {s.icon}
                  </span>
                  <span className="text-[13px] text-gray-600">{s.label}</span>
                </div>
                <span className="text-[20px] font-bold" style={{ color: s.valueColor }}>
                  {stats[s.key]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default PatientMedicalRecords;