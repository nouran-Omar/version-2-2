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
import { motion } from 'framer-motion';

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
    icon:        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
<path d="M2.66797 14.6668V8.00016C2.66797 7.26683 2.9293 6.63927 3.45197 6.1175C3.97463 5.59572 4.60219 5.33438 5.33463 5.3335H26.6679C27.4012 5.3335 28.0292 5.59483 28.5519 6.1175C29.0746 6.64016 29.3356 7.26772 29.3347 8.00016V16.4668C28.9569 16.3113 28.5737 16.1948 28.1853 16.1175C27.7968 16.0402 27.4021 16.0011 27.0012 16.0002C26.4901 16.0002 25.979 16.0668 25.4679 16.2002C24.9568 16.3335 24.4679 16.5224 24.0012 16.7668C23.8012 16.6557 23.5901 16.5557 23.3679 16.4668C23.1457 16.3779 22.9124 16.3002 22.6679 16.2335V14.6668H18.1679L15.8679 10.0668C15.7568 9.84461 15.5901 9.67794 15.3679 9.56683C15.1457 9.45572 14.9124 9.40016 14.6679 9.40016C14.4235 9.40016 14.1901 9.45572 13.9679 9.56683C13.7457 9.67794 13.579 9.84461 13.4679 10.0668L9.33463 18.3335L7.86797 15.4002C7.75685 15.1557 7.59019 14.9722 7.36797 14.8495C7.14574 14.7268 6.91241 14.6659 6.66797 14.6668H2.66797ZM5.33463 26.6668C4.6013 26.6668 3.97374 26.4059 3.45197 25.8842C2.93019 25.3624 2.66885 24.7344 2.66797 24.0002V17.3335H5.83463L8.13463 21.9335C8.24574 22.1779 8.41241 22.3615 8.63463 22.4842C8.85685 22.6068 9.09019 22.6677 9.33463 22.6668C9.57908 22.6659 9.81241 22.6051 10.0346 22.4842C10.2568 22.3633 10.4235 22.1797 10.5346 21.9335L14.6679 13.6668L16.1346 16.6002C16.2457 16.8002 16.3848 16.9615 16.5519 17.0842C16.719 17.2068 16.9132 17.2899 17.1346 17.3335C16.379 17.9113 15.779 18.6335 15.3346 19.5002C14.8901 20.3668 14.6679 21.3113 14.6679 22.3335C14.6679 23.2668 14.807 24.0504 15.0852 24.6842C15.3635 25.3179 15.8132 25.9788 16.4346 26.6668H5.33463ZM21.0012 18.6668C21.6012 18.6668 22.1568 18.8002 22.6679 19.0668C23.1791 19.3335 23.6235 19.7224 24.0012 20.2335C24.379 19.7224 24.8235 19.3335 25.3347 19.0668C25.8458 18.8002 26.4012 18.6668 27.0012 18.6668C28.0236 18.6668 28.8901 19.0224 29.6013 19.7335C30.3124 20.4446 30.6679 21.3113 30.6679 22.3335C30.6679 23.1335 30.379 23.9059 29.8013 24.6508C29.2235 25.3957 27.9569 26.6011 26.0012 28.2668L24.0012 30.0002L22.0012 28.2668C20.0457 26.6002 18.7791 25.3948 18.2013 24.6508C17.6236 23.9068 17.3347 23.1344 17.3347 22.3335C17.3347 21.3113 17.6901 20.4446 18.4012 19.7335C19.1124 19.0224 19.979 18.6668 21.0012 18.6668Z" fill="white"/>
</svg>,
    description: 'Keep track of your latest ECG results (Optional)',
    color:       '#333CF5',
    bg:          '#EEF0FF',
    accept:      '.jpeg,.jpg,.png',
    formats:     'JPEG, PNG',
  },
  Radiology: {
    label:       'Radiology',
    icon:        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
<path d="M25.3333 4H6.66667C5.18667 4 4 5.18667 4 6.66667V25.3333C4 26.8133 5.18667 28 6.66667 28H25.3333C26.8133 28 28 26.8133 28 25.3333V6.66667C28 5.18667 26.8133 4 25.3333 4ZM22.8 17.3333H17.3333V18.6667H22.6667C22.6667 18.6667 22.5867 22.6667 20.6667 22.6667C18.8667 22.6667 19.3333 20.6267 17.3333 20V22.6667C17.3333 23.4 16.7333 24 16 24C15.2667 24 14.6667 23.4 14.6667 22.6667V20C12.6667 20.6267 13.1333 22.6667 11.3333 22.6667C9.41333 22.6667 9.33333 18.6667 9.33333 18.6667H14.6667V17.3333H9.2C9.13333 16.92 9.12 16.4667 9.06667 16H14.6667V14.6667H9.08C9.10667 14.2267 9.21333 13.7733 9.33333 13.3333H14.6667V12H9.78667C10 11.5333 10.2 11.08 10.44 10.6667H14.6667V9.33333C14.6667 8.6 15.2667 8 16 8C16.7333 8 17.3333 8.6 17.3333 9.33333V10.6667H21.56C21.8 11.08 22 11.5333 22.2133 12H17.3333V13.3333H22.6667C22.8 13.7733 22.8933 14.2267 22.92 14.6667H17.3333V16H22.9333C22.88 16.4667 22.8667 16.92 22.8 17.3333Z" fill="white"/>
</svg>,
    description: 'Upload your X-rays or CT (Optional)',
    color:       '#333CF5',
    bg:          '#EEF0FF',
    accept:      '.jpeg,.jpg,.png',
    formats:     'JPEG, PNG',
  },
  'Medical File': {
    label:       'Other Medical Files',
    icon:        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M23.7487 4.16667C23.7487 4.05616 23.7048 3.95018 23.6267 3.87204C23.5485 3.7939 23.4425 3.75 23.332 3.75H11.6654C10.4498 3.75 9.284 4.23289 8.42446 5.09243C7.56492 5.95197 7.08203 7.11776 7.08203 8.33333V31.6667C7.08203 32.8822 7.56492 34.048 8.42446 34.9076C9.284 35.7671 10.4498 36.25 11.6654 36.25H28.332C29.5476 36.25 30.7134 35.7671 31.5729 34.9076C32.4325 34.048 32.9154 32.8822 32.9154 31.6667V15.245C32.9154 15.1345 32.8715 15.0285 32.7933 14.9504C32.7152 14.8722 32.6092 14.8283 32.4987 14.8283H24.9987C24.6672 14.8283 24.3492 14.6966 24.1148 14.4622C23.8804 14.2278 23.7487 13.9099 23.7487 13.5783V4.16667ZM24.9987 20.4167C25.3302 20.4167 25.6482 20.5484 25.8826 20.7828C26.117 21.0172 26.2487 21.3351 26.2487 21.6667C26.2487 21.9982 26.117 22.3161 25.8826 22.5505C25.6482 22.785 25.3302 22.9167 24.9987 22.9167H14.9987C14.6672 22.9167 14.3492 22.785 14.1148 22.5505C13.8804 22.3161 13.7487 21.9982 13.7487 21.6667C13.7487 21.3351 13.8804 21.0172 14.1148 20.7828C14.3492 20.5484 14.6672 20.4167 14.9987 20.4167H24.9987ZM24.9987 27.0833C25.3302 27.0833 25.6482 27.215 25.8826 27.4494C26.117 27.6839 26.2487 28.0018 26.2487 28.3333C26.2487 28.6649 26.117 28.9828 25.8826 29.2172C25.6482 29.4516 25.3302 29.5833 24.9987 29.5833H14.9987C14.6672 29.5833 14.3492 29.4516 14.1148 29.2172C13.8804 28.9828 13.7487 28.6649 13.7487 28.3333C13.7487 28.0018 13.8804 27.6839 14.1148 27.4494C14.3492 27.215 14.6672 27.0833 14.9987 27.0833H24.9987Z" fill="#F6F7F8"/>
  <path d="M26.25 4.70643C26.25 4.39976 26.5717 4.20477 26.81 4.39643C27.0122 4.55977 27.1917 4.74977 27.3483 4.96643L32.37 11.9614C32.4833 12.1214 32.36 12.3281 32.1633 12.3281H26.6667C26.5562 12.3281 26.4502 12.2842 26.372 12.2061C26.2939 12.1279 26.25 12.0219 26.25 11.9114V4.70643Z" fill="#F6F7F8"/>
</svg>,
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
  { key: 'ecg',     label: 'ECG Files',             icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M18.3385 9.99984H16.2719C15.9077 9.99906 15.5533 10.1176 15.2628 10.3373C14.9724 10.557 14.7619 10.8658 14.6635 11.2165L12.7052 18.1832C12.6926 18.2264 12.6663 18.2645 12.6302 18.2915C12.5941 18.3186 12.5503 18.3332 12.5052 18.3332C12.4601 18.3332 12.4163 18.3186 12.3802 18.2915C12.3441 18.2645 12.3178 18.2264 12.3052 18.1832L7.70521 1.8165C7.69259 1.77323 7.66627 1.73522 7.63021 1.70817C7.59415 1.68112 7.55029 1.6665 7.50521 1.6665C7.46013 1.6665 7.41627 1.68112 7.38021 1.70817C7.34415 1.73522 7.31783 1.77323 7.30521 1.8165L5.34687 8.78317C5.24893 9.13247 5.03969 9.44027 4.75093 9.65985C4.46216 9.87943 4.10964 9.9988 3.74687 9.99984H1.67188" stroke="#00C950" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>, iconBg: '#DCFCE7', iconColor: '#00C950',  valueColor: '#00C950'  },
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
            className="w-12 h-12 rounded-[14px] flex items-center justify-center text-lg shrink-0"
            style={{ background: cfg.color, color: '#fff' }}
          >
            {cfg.icon}
          </span>
          <div>
            <p className="text-lg font-bold" style={{ color: BRAND.dark }}>{cfg.label}</p>
            <p className="text-sm text-neutral-500 mt-0.5">{cfg.description}</p>
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
      className="flex flex-col gap-6 p-[24px] rounded-full min-h-screen bg-[#FFFFFFE5] "
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
    <header className="flex flex-col gap-1 pb-4 ">
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
    className="text-[18px] text-neutral-500 font-normal leading-tight ml-3 " 
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
<div   className=" overflow-hidden p-5" >
<div 
  className="bg-white rounded-[22px] overflow-hidden py-12" 
>
  {/* List Header */}
  <div className="flex items-center justify-between px-6 py-8 ">
    
    {/* الجزء الشمال: العنوان والوصف */}
    <div className="flex flex-col gap-1">
      {/* الصف الأول: الأيقونة والعنوان جنب بعض */}
      <div className="flex items-center gap-3">
        {/* <LuFileText className="text-[20px]" style={{ color: BRAND.main }} /> */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M16.5196 16.5009C16.6946 16.3649 16.8536 16.2059 17.1706 15.8889L21.1276 11.9309C21.2236 11.8359 21.1796 11.6709 21.0526 11.6259C20.4329 11.4111 19.8706 11.0574 19.4086 10.5919C18.9431 10.1299 18.5894 9.5676 18.3746 8.94792C18.3296 8.82092 18.1646 8.77692 18.0696 8.87292L14.1106 12.8299C13.7936 13.1469 13.6346 13.3059 13.4986 13.4809C13.3366 13.6882 13.1993 13.9103 13.0866 14.1469C12.9916 14.3469 12.9206 14.5609 12.7786 14.9869L12.5946 15.5369L12.3026 16.4119L12.0296 17.2319C11.9956 17.3347 11.9908 17.4449 12.0158 17.5503C12.0407 17.6556 12.0945 17.7519 12.171 17.8285C12.2476 17.905 12.3439 17.9588 12.4493 17.9838C12.5546 18.0088 12.6648 18.004 12.7676 17.9699L13.5876 17.6969L14.4626 17.4049L15.0126 17.2209C15.4386 17.0789 15.6526 17.0089 15.8526 16.9129C16.0893 16.7996 16.3123 16.6622 16.5196 16.5009ZM22.3676 10.6919C22.7733 10.2861 23.0011 9.73583 23.001 9.16206C23.0009 8.5883 22.7729 8.03807 22.3671 7.63242C21.9613 7.22677 21.411 6.99893 20.8373 6.99902C20.2635 6.99912 19.7133 7.22714 19.3076 7.63292L19.1816 7.76092C19.1208 7.8204 19.0755 7.89391 19.0497 7.97498C19.0239 8.05605 19.0184 8.14222 19.0336 8.22592C19.0536 8.33292 19.0886 8.49092 19.1536 8.67792C19.2836 9.05292 19.5296 9.54492 19.9926 10.0079C20.4556 10.4709 20.9476 10.7169 21.3226 10.8469C21.5106 10.9119 21.6676 10.9469 21.7746 10.9669C21.8583 10.9813 21.9442 10.9754 22.0252 10.9496C22.1061 10.9239 22.1796 10.879 22.2396 10.8189L22.3676 10.6919Z" fill="#333CF5"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M4.172 3.172C3 4.343 3 6.229 3 10V14C3 17.771 3 19.657 4.172 20.828C5.344 21.999 7.229 22 11 22H13C16.771 22 18.657 22 19.828 20.828C20.981 19.676 21 17.832 21 14.18L18.182 16.998C17.912 17.268 17.691 17.489 17.442 17.684C17.1499 17.9128 16.8333 18.1083 16.498 18.267C16.1911 18.4051 15.8758 18.5236 15.554 18.622L13.242 19.393C12.875 19.5154 12.4811 19.5332 12.1046 19.4443C11.728 19.3554 11.3837 19.1635 11.1101 18.8899C10.8365 18.6163 10.6446 18.272 10.5557 17.8954C10.4668 17.5189 10.4846 17.125 10.607 16.758L10.881 15.938L11.356 14.512L11.377 14.446C11.498 14.084 11.597 13.788 11.733 13.502C11.893 13.166 12.0873 12.8517 12.316 12.559C12.511 12.309 12.732 12.089 13.002 11.819L17.008 7.812L18.12 6.7L18.247 6.573C18.5868 6.23215 18.9907 5.96188 19.4353 5.77773C19.88 5.59358 20.3567 5.49919 20.838 5.5C20.687 4.47 20.394 3.737 19.828 3.172C18.657 2 16.771 2 13 2H11C7.229 2 5.343 2 4.172 3.172ZM7.25 9C7.25 8.80109 7.32902 8.61032 7.46967 8.46967C7.61032 8.32902 7.80109 8.25 8 8.25H14.5C14.6989 8.25 14.8897 8.32902 15.0303 8.46967C15.171 8.61032 15.25 8.80109 15.25 9C15.25 9.19891 15.171 9.38968 15.0303 9.53033C14.8897 9.67098 14.6989 9.75 14.5 9.75H8C7.80109 9.75 7.61032 9.67098 7.46967 9.53033C7.32902 9.38968 7.25 9.19891 7.25 9ZM7.25 13C7.25 12.8011 7.32902 12.6103 7.46967 12.4697C7.61032 12.329 7.80109 12.25 8 12.25H10.5C10.6989 12.25 10.8897 12.329 11.0303 12.4697C11.171 12.6103 11.25 12.8011 11.25 13C11.25 13.1989 11.171 13.3897 11.0303 13.5303C10.8897 13.671 10.6989 13.75 10.5 13.75H8C7.80109 13.75 7.61032 13.671 7.46967 13.5303C7.32902 13.3897 7.25 13.1989 7.25 13ZM7.25 17C7.25 16.8011 7.32902 16.6103 7.46967 16.4697C7.61032 16.329 7.80109 16.25 8 16.25H9.5C9.69891 16.25 9.88968 16.329 10.0303 16.4697C10.171 16.6103 10.25 16.8011 10.25 17C10.25 17.1989 10.171 17.3897 10.0303 17.5303C9.88968 17.671 9.69891 17.75 9.5 17.75H8C7.80109 17.75 7.61032 17.671 7.46967 17.5303C7.32902 17.3897 7.25 17.1989 7.25 17Z" fill="#333CF5"/>
</svg>
        <h2 className="text-[20px] font-normal" style={{ color: BRAND.dark, fontFamily: 'Roboto, sans-serif' }}>
          Document List
        </h2>
      </div>
      
      {/* الصف الثاني: الوصف تحتهم مع إزاحة بسيطة للمحاذاة */}
      <p 
        className="text-[14px] text-neutral-500 font-normal leading-tight" 
        style={{ fontFamily: 'Roboto, sans-serif'}}
      >
        Manage and operate your document files.
      </p>
    </div>

    {/* زر الحذف الجماعي (Bulk delete) يفضل على اليمين كما هو */}
    {selected.length > 0 && (
      <button
        className="flex items-center gap-1.5 text-white rounded-xl px-4 py-2 text-[12px] font-bold transition-all hover:opacity-90 active:scale-95"
        style={{ background: '#E7000B' }}
        onClick={() => openConfirm(selected, '')}
      >
        <LuTrash2 className='w-4 h-4' /> Delete Selected ({selected.length})
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
                <th className="px-4 py-5 text-left text-[14px] font-semibold text-gray-500 tracking-wide">File name</th>
                <th className="px-4 py-5 text-left text-[14px] font-semibold text-gray-500 tracking-wide">Type</th>
                <th className="px-4 py-5 text-left text-[14px] font-semibold text-gray-500 tracking-wide">Size</th>
                <th className="px-4 py-5 text-left text-[14px] font-semibold text-gray-500 tracking-wide">Uploaded Date</th>
                <th className="px-4 py-5 text-left text-[14px] font-semibold text-gray-500 tracking-wide">Record Type</th>
                <th className="pr-6 pl-2 py-5 text-center w-14">
                  <LuTrash2 className="text-red-500 text-[24px] mx-auto" />
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
                      <span className="font-bold text-[14px]" style={{ color: BRAND.dark }}>{doc.type}</span>
                    </td>
                    <td className="px-4 py-5 text-[14px] text-gray-400 font-medium">{doc.size}</td>
                    <td className="px-4 py-5 text-[14px] text-gray-400 font-medium">{doc.date}</td>
                    <td className="px-4 py-5 text-[14px] text-gray-500 font-medium">{doc.category}</td>
                    <td className="pr-6 pl-2 py-5 text-center">
                      <button
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        onClick={() => openConfirm([doc.id], doc.name)}
                        title="Delete"
                      >
                        <LuTrash2 className="text-[24px]" />
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
      {/* Container باستخدام Flexbox لتوزيع العناصر على الأطراف */}
<div className="flex flex-col lg:flex-row items-center justify-between w-full gap-8 mt-10">

<div className="flex flex-col items-center text-center gap-8 max-w-2xl mx-auto py-10">
  
  <div className="flex flex-col items-center gap-6">
    {/* العنوان مع الأيقونة محاذية له تماماً كما طلبت */}
    <h3 className="text-[24px] md:text-[28px] font-bold text-black-main-text flex items-center justify-center gap-4">
      <motion.img 
        src={Qrcodepatiant} 
        alt="QR Icon" 
        className="w-18 h-18 object-contain shrink-0"
        // أنميشن الطفو للصورة وهي في مكانها بجانب النص
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      All your medical files are ready!
    </h3>

    {/* الفقرات */}
    <div className="flex flex-col gap-2 items-center">
      <p className="text-[17px] text-gray-text-dim2 leading-relaxed">
        Your reports are now organized.
      </p>
      <p className="text-[17px] text-gray-text-dim2 leading-relaxed font-medium">
        Generate your personal QR code to access them anytime.
      </p>
    </div>
  </div>

  {/* زر التوليد مع أنميشن انطلاق الصاروخ عند الضغط */}
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.98 }}
    className="relative flex items-center gap-3 rounded-[32px] px-10 py-4 text-[15px] font-bold text-white shadow-lg overflow-hidden"
    style={{
      background: 'linear-gradient(90deg, #2B7FFF, #E7000B)',
      boxShadow: '0px 10px 20px rgba(43, 127, 255, 0.2)',
    }}
  >
    {/* أيقونة الصاروخ مع أنميشن الانطلاق */}
    <motion.div
      variants={{
        tap: { 
          x: 100, 
          y: -100, 
          opacity: 0,
          transition: { duration: 0.8, ease: "easeIn" } 
        }
      }}
      whileTap="tap"
    >
      <RiRocketLine className="text-xl" />
    </motion.div>

    <span className="relative z-10">Generate QR Code</span>
    
    <motion.span 
      className="text-lg"
      animate={{ x: [0, 5, 0] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
    >
      →
    </motion.span>
  </motion.button>

</div>

  {/* ── RIGHT SIDE: Statistics Card ── */}
  <div
    className="bg-white rounded-[28px] overflow-hidden w-full max-w-[380px] shrink-0"
    style={{ 
      boxShadow: '0px 15px 35px rgba(0,0,0,0.05)', 
      border: '1px solid #F3F4F6' 
    }}
  >
    {/* Stats Header */}
    <div className="flex items-center gap-4 px-8 py-5 border-b border-gray-50 bg-[#FAFBFF]">
      <div
        className="w-11 h-11 rounded-[15px] flex items-center justify-center text-white shadow-inner"
        style={{ background: '#155DFC' }}
      >
        <MdOutlineBarChart className="text-xl" />
      </div>
      <span className="text-[18px] font-black tracking-tight" style={{ color: '#010218' }}>
        Statistics
      </span>
    </div>

    {/* Stats Items */}
    <div className="flex flex-col p-4 gap-2">
      {STAT_ITEMS.map((s) => (
        <div
          key={s.key}
          className="flex items-center justify-between px-5 py-4 rounded-[20px] hover:bg-gray-50 transition-colors cursor-default"
          style={{ background: '#FFFFFF' }}
        >
          <div className="flex items-center gap-4">
            <span
              className="w-11 h-11 rounded-[12px] flex items-center justify-center text-lg"
              style={{ background: s.iconBg, color: s.iconColor }}
            >
              {s.icon}
            </span>
            <span className="text-[15px] font-semibold text-gray-500">{s.label}</span>
          </div>
          <span className="text-[26px] font-black" style={{ color: s.valueColor }}>
            {stats[s.key]}
          </span>
        </div>
      ))}
    </div>
  </div>
</div>
      </div>

    </section>
  );
};

export default PatientMedicalRecords;