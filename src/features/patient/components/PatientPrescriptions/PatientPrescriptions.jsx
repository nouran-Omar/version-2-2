import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuClipboardList, LuSearch, LuDownload, LuEye, LuFilter } from 'react-icons/lu';
import { FaRegUserCircle } from 'react-icons/fa';
import { HiOutlineCalendar } from 'react-icons/hi2';
import { jsPDF } from 'jspdf';

/* ── Shared prescription data (used by list + PDF + detail page) ── */
export const ALL_PRESCRIPTIONS = [
  {
    id: 'RX-2026-0210-4523', doc: 'Dr. Sarah Mitchell', spec: 'Internal Medicine',
    date: 'February 10, 2026', time: '10:00 AM', status: 'Active',
    patientName: 'John Anderson', patientID: 'PX-2024-7891',
    medications: [
      { name: 'Amoxicillin 500mg', dose: '500mg',   freq: '3 times daily (after meals)', dur: '7 days'  },
      { name: 'Paracetamol',       dose: '500mg',   freq: 'Every 6 hours as needed',     dur: '5 days'  },
      { name: 'Vitamin D3',        dose: '1000 IU', freq: 'Once daily',                  dur: '30 days' },
    ],
    instructions: 'Take all medications as prescribed. Complete the full course of antibiotics even if you feel better.',
    labs: [
      { id: 'l1', name: 'Complete Blood Count (CBC)', note: 'Fasting required - 8-12 hours' },
      { id: 'l2', name: 'Lipid Profile',              note: 'Fasting required'               },
    ],
    labInstructions: 'Please visit the lab with this prescription. Bring your ID and insurance card.',
    clinicalNotes: 'Patient presents with mild upper respiratory infection. Ensure adequate rest and hydration. Follow up in 1 week if symptoms persist.',
  },
  {
    id: 'RX-2026-0205-3891', doc: 'Dr. Michael Chen', spec: 'Cardiology',
    date: 'February 5, 2026', time: '9:15 AM', status: 'Active',
    patientName: 'John Anderson', patientID: 'PX-2024-7891',
    medications: [
      { name: 'Atorvastatin 20mg', dose: '20mg', freq: 'Once daily at bedtime', dur: '90 days' },
      { name: 'Aspirin 81mg',      dose: '81mg', freq: 'Once daily with food',  dur: '90 days' },
    ],
    instructions: 'Do not stop medication without consulting your cardiologist. Monitor blood pressure daily.',
    labs: [
      { id: 'l1', name: 'Echocardiogram', note: 'Schedule appointment at cardiac unit' },
    ],
    labInstructions: 'Bring all previous cardiac reports to the appointment.',
    clinicalNotes: 'Patient with elevated LDL and mild hypertension. Started on statins. Lifestyle modification advised — low sodium diet and 30 min daily walk.',
  },
  {
    id: 'RX-2026-0128-2147', doc: 'Dr. Emily Rodriguez', spec: 'Dermatology',
    date: 'January 28, 2026', time: '3:00 PM', status: 'Completed',
    patientName: 'John Anderson', patientID: 'PX-2024-7891',
    medications: [
      { name: 'Hydrocortisone Cream 1%', dose: 'Topical', freq: 'Apply twice daily on affected area', dur: '14 days' },
    ],
    instructions: 'Avoid direct sun exposure on treated areas. Do not use on face unless directed.',
    labs: [],
    labInstructions: '',
    clinicalNotes: 'Mild eczema flare-up on forearms. Topical corticosteroid prescribed. Follow up in 2 weeks or earlier if condition worsens.',
  },
  {
    id: 'RX-2026-0115-1623', doc: 'Dr. James Anderson', spec: 'Orthopedics',
    date: 'January 15, 2026', time: '11:30 AM', status: 'Completed',
    patientName: 'John Anderson', patientID: 'PX-2024-7891',
    medications: [
      { name: 'Ibuprofen 400mg',   dose: '400mg', freq: 'Every 8 hours with food',       dur: '10 days' },
      { name: 'Calcium + Vit D',   dose: '600mg', freq: 'Once daily with breakfast',     dur: '60 days' },
      { name: 'Muscle Relaxant',   dose: '5mg',   freq: 'At bedtime',                    dur: '7 days'  },
      { name: 'Topical Diclofenac',dose: 'Topical',freq: 'Apply 3 times daily on knee', dur: '14 days' },
    ],
    instructions: 'Avoid strenuous activity. Use knee brace when walking. Ice the knee 20 min twice daily.',
    labs: [
      { id: 'l1', name: 'Knee X-Ray (AP & Lateral)',  note: '' },
      { id: 'l2', name: 'MRI Right Knee',             note: 'No metal implants' },
      { id: 'l3', name: 'Bone Density Scan (DEXA)',   note: 'Fasting not required' },
    ],
    labInstructions: 'Bring referral letter. MRI appointment must be booked in advance.',
    clinicalNotes: 'Patient with right knee pain following sports injury. Moderate joint effusion noted. Conservative management initiated. Surgery evaluation if no improvement in 6 weeks.',
  },
  {
    id: 'RX-2025-1220-8934', doc: 'Dr. Lisa Thompson', spec: 'Neurology',
    date: 'December 20, 2025', time: '2:00 PM', status: 'Completed',
    patientName: 'John Anderson', patientID: 'PX-2024-7891',
    medications: [
      { name: 'Sumatriptan 50mg', dose: '50mg',  freq: 'At onset of migraine, max 2/day', dur: '30 days' },
      { name: 'Propranolol 40mg', dose: '40mg',  freq: 'Twice daily',                     dur: '60 days' },
    ],
    instructions: 'Keep a migraine diary. Avoid known triggers (bright lights, stress, certain foods).',
    labs: [
      { id: 'l1', name: 'MRI Brain with contrast', note: 'No metal implants' },
      { id: 'l2', name: 'EEG',                     note: 'Avoid caffeine 24h before test' },
    ],
    labInstructions: 'Schedule MRI and EEG on separate days. Bring previous imaging if available.',
    clinicalNotes: 'Recurrent migraines with visual aura, 3-4 episodes per month. Prophylactic beta-blocker therapy started. Patient educated on trigger avoidance.',
  },
  {
    id: 'RX-2025-1210-7421', doc: 'Dr. Robert Kumar', spec: 'General Practice',
    date: 'December 10, 2025', time: '8:45 AM', status: 'Completed',
    patientName: 'John Anderson', patientID: 'PX-2024-7891',
    medications: [
      { name: 'Cetirizine 10mg',  dose: '10mg', freq: 'Once daily at night',        dur: '14 days' },
      { name: 'Fluticasone Spray',dose: '50mcg',freq: '2 sprays each nostril/day',  dur: '30 days' },
    ],
    instructions: 'Avoid allergens. Use nasal spray consistently even if symptoms improve.',
    labs: [
      { id: 'l1', name: 'Allergy Panel (IgE)',  note: 'Fasting not required' },
    ],
    labInstructions: 'Blood draw — no special preparation needed.',
    clinicalNotes: 'Seasonal allergic rhinitis. Antihistamine and nasal corticosteroid prescribed. Allergen testing ordered to identify specific triggers.',
  },
];

/* ─────────────────────────────────────────────────────────────
   PDF generator  (full medications + labs from real data)
───────────────────────────────────────────────────────────── */
async function generatePrescriptionPDF(item) {
  const BLUE   = [51, 60, 245];
  const DKBLUE = [1, 2, 24];
  const GRAY   = [107, 114, 128];
  const LGRAY  = [243, 244, 246];
  const WHITE  = [255, 255, 255];
  const GREEN  = [22, 163, 74];
  const isActive = item.status === 'Active';

  // Load logo
  let logoDataUrl = null;
  try {
    const res  = await fetch('/logo/logo.svg');
    const blob = await res.blob();
    logoDataUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (_) { /* skip */ }

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W   = doc.internal.pageSize.getWidth();
  const H   = doc.internal.pageSize.getHeight();
  const ML  = 12;

  // ── Header ──────────────────────────────────────────────
  doc.setFillColor(...BLUE);
  doc.rect(0, 0, W, 38, 'F');

  if (logoDataUrl) {
    try { doc.addImage(logoDataUrl, 'SVG', ML, 7, 24, 24); } catch (_) {}
  }
  doc.setFontSize(17); doc.setFont('helvetica', 'bold');   doc.setTextColor(...WHITE);
  doc.text('PulseX', ML + 28, 18);
  doc.setFontSize(8);  doc.setFont('helvetica', 'normal'); doc.setTextColor(200, 210, 255);
  doc.text('Your Trusted Health Platform', ML + 28, 25);

  doc.setFontSize(10); doc.setFont('helvetica', 'bold');   doc.setTextColor(...WHITE);
  doc.text('MEDICAL PRESCRIPTION', W - ML, 16, { align: 'right' });
  doc.setFontSize(8);  doc.setFont('helvetica', 'normal'); doc.setTextColor(200, 210, 255);
  doc.text(`Ref: ${item.id}`, W - ML, 23, { align: 'right' });

  // Status badge
  doc.setFillColor(...(isActive ? GREEN : GRAY));
  doc.roundedRect(W - ML - 30, 28, 30, 7, 2, 2, 'F');
  doc.setFontSize(7); doc.setFont('helvetica', 'bold'); doc.setTextColor(...WHITE);
  doc.text(item.status.toUpperCase(), W - ML - 15, 33, { align: 'center' });

  let y = 46;

  // ── Doctor / Patient info box ────────────────────────────
  doc.setFillColor(...LGRAY);
  doc.roundedRect(ML, y, W - ML * 2, 28, 3, 3, 'F');

  doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');    doc.setTextColor(...GRAY);
  doc.text('PRESCRIBING PHYSICIAN', ML + 4, y + 7);
  doc.setFontSize(12);  doc.setFont('helvetica', 'bold');    doc.setTextColor(...BLUE);
  doc.text(item.doc, ML + 4, y + 14);
  doc.setFontSize(8);   doc.setFont('helvetica', 'normal');  doc.setTextColor(...GRAY);
  doc.text(item.spec, ML + 4, y + 21);

  const mid = W / 2 + 4;
  doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');    doc.setTextColor(...GRAY);
  doc.text('PATIENT', mid, y + 7);
  doc.setFontSize(11);  doc.setFont('helvetica', 'bold');    doc.setTextColor(...DKBLUE);
  doc.text(item.patientName || 'John Anderson', mid, y + 14);
  doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');  doc.setTextColor(...GRAY);
  doc.text(`ID: ${item.patientID || 'PX-2024-7891'}  •  ${item.date}  •  ${item.time || ''}`, mid, y + 21);

  y += 36;

  // ── Medications ──────────────────────────────────────────
  if (item.medications && item.medications.length > 0) {
    doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...DKBLUE);
    doc.text('Prescribed Medications', ML, y);
    y += 3;

    doc.setFillColor(168, 85, 247);
    doc.rect(ML, y, 2, item.medications.length * 18 + 4, 'F');
    y += 5;

    item.medications.forEach((med, i) => {
      if (y > H - 40) { doc.addPage(); y = 16; }
      doc.setFillColor(250, 245, 255);
      doc.roundedRect(ML + 4, y, W - ML * 2 - 4, 16, 2, 2, 'F');

      doc.setFillColor(168, 85, 247);
      doc.roundedRect(ML + 7, y + 4, 7, 7, 1, 1, 'F');
      doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(...WHITE);
      doc.text(String(i + 1), ML + 10.5, y + 9, { align: 'center' });

      doc.setFontSize(9);   doc.setFont('helvetica', 'bold');    doc.setTextColor(...DKBLUE);
      doc.text(med.name, ML + 17, y + 7);
      doc.setFontSize(7.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(...GRAY);
      doc.text(`Dose: ${med.dose}  •  Freq: ${med.freq}  •  Duration: ${med.dur}`, ML + 17, y + 13);
      y += 18;
    });

    if (item.instructions) {
      if (y > H - 30) { doc.addPage(); y = 16; }
      doc.setFillColor(255, 251, 235);
      doc.roundedRect(ML, y, W - ML * 2, 13, 2, 2, 'F');
      doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');   doc.setTextColor(180, 83, 9);
      doc.text('Note:', ML + 4, y + 5.5);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(180, 100, 20);
      doc.text(item.instructions, ML + 22, y + 5.5, { maxWidth: W - ML * 2 - 26 });
      y += 15;
    }
    y += 4;
  }

  // ── Labs ─────────────────────────────────────────────────
  if (item.labs && item.labs.length > 0) {
    if (y > H - 40) { doc.addPage(); y = 16; }
    doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...DKBLUE);
    doc.text('Lab & Radiology Requests', ML, y);
    y += 3;

    doc.setFillColor(...GREEN);
    doc.rect(ML, y, 2, item.labs.length * 14 + 4, 'F');
    y += 5;

    item.labs.forEach((lab, i) => {
      if (y > H - 40) { doc.addPage(); y = 16; }
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(ML + 4, y, W - ML * 2 - 4, 12, 2, 2, 'F');

      doc.setFillColor(...GREEN);
      doc.roundedRect(ML + 7, y + 2.5, 7, 7, 1, 1, 'F');
      doc.setFontSize(7); doc.setFont('helvetica', 'bold'); doc.setTextColor(...WHITE);
      doc.text(String(i + 1), ML + 10.5, y + 7.5, { align: 'center' });

      doc.setFontSize(9);   doc.setFont('helvetica', 'bold');    doc.setTextColor(...DKBLUE);
      doc.text(lab.name, ML + 17, y + 6.5);
      if (lab.note) {
        doc.setFontSize(7.5); doc.setFont('helvetica', 'italic'); doc.setTextColor(...GRAY);
        doc.text(`Note: ${lab.note}`, ML + 17, y + 11);
      }
      y += 14;
    });

    if (item.labInstructions) {
      if (y > H - 30) { doc.addPage(); y = 16; }
      doc.setFillColor(239, 246, 255);
      doc.roundedRect(ML, y, W - ML * 2, 12, 2, 2, 'F');
      doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');   doc.setTextColor(37, 99, 235);
      doc.text('Lab Note:', ML + 4, y + 5);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(59, 130, 246);
      doc.text(item.labInstructions, ML + 26, y + 5, { maxWidth: W - ML * 2 - 30 });
      y += 14;
    }
    y += 4;
  }

  // ── Clinical Notes ───────────────────────────────────────
  if (item.clinicalNotes) {
    if (y > H - 50) { doc.addPage(); y = 16; }
    doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...DKBLUE);
    doc.text('Clinical Notes', ML, y);
    y += 4;

    const noteLines = doc.splitTextToSize(item.clinicalNotes, W - ML * 2 - 8);
    const noteH = noteLines.length * 5 + 8;
    doc.setFillColor(...LGRAY);
    doc.roundedRect(ML, y, W - ML * 2, noteH, 2, 2, 'F');
    doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(...GRAY);
    doc.text(noteLines, ML + 4, y + 6);
    y += noteH + 4;
  }

  // ── Footer ───────────────────────────────────────────────
  doc.setFillColor(...BLUE);
  doc.rect(0, H - 18, W, 18, 'F');
  doc.setFontSize(8);   doc.setFont('helvetica', 'bold');   doc.setTextColor(...WHITE);
  doc.text('PulseX — Your Trusted Health Platform', W / 2, H - 10, { align: 'center' });
  doc.setFontSize(6.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(200, 210, 255);
  doc.text('Auto-generated document • Valid only with authorized physician signature', W / 2, H - 4, { align: 'center' });

  doc.save(`prescription-${item.id}.pdf`);
}

/* ─────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────── */
const FILTER_OPTIONS = ['All', 'Active Only', 'Completed Only'];

const PatientPrescriptions = () => {
  const navigate = useNavigate();
  const [search,     setSearch]     = useState('');
  const [filter,     setFilter]     = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);
  const [visible,    setVisible]    = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const getActiveTabClass = (opt) => {
    if (filter !== opt) return 'bg-[#F3F4F6] text-[#364153] hover:bg-[#e5e7eb]';
    switch (opt) {
      case 'Active Only':    return 'bg-[#00A63E] text-white shadow-md';
      case 'Completed Only': return 'bg-[#4A5565] text-white shadow-md';
      default:               return 'bg-brand-main text-white shadow-md';
    }
  };

  const filtered = ALL_PRESCRIPTIONS.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = p.doc.toLowerCase().includes(q) || p.date.toLowerCase().includes(q);
    const matchFilter =
      filter === 'All' ||
      (filter === 'Active Only'    && p.status === 'Active') ||
      (filter === 'Completed Only' && p.status === 'Completed');
    return matchSearch && matchFilter;
  });

  const total     = ALL_PRESCRIPTIONS.length;
  const active    = ALL_PRESCRIPTIONS.filter((p) => p.status === 'Active').length;
  const completed = ALL_PRESCRIPTIONS.filter((p) => p.status === 'Completed').length;

  return (
    <div
      className="min-h-screen p-5   font-[Inter,sans-serif]"
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0)' : 'translateY(18px)',
        transition: 'opacity 0.45s ease, transform 0.45s ease',
      }}
    >
      {/* ── Page Header ── */}
      <div className="flex items-center gap-3 mb-6">
       
        <div>
          <h1 className="text-[20px] font-bold text-black-main-text m-0 leading-tight flex items-center "> <LuClipboardList className="text-[30px] text-black-main-text mr-2" />Prescription History</h1>
          <p className="text-[13px] text-gray-text-dim2 mt-[2px] m-0">View and manage all your medical prescriptions</p>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Prescriptions" value={total}     accent="#333CF5" text="#010218" delay={0}   visible={visible} />
        <StatCard label="Active"               value={active}    accent="#00C950" text="#00A63E" delay={80}  visible={visible} />
        <StatCard label="Completed"            value={completed} accent="#99A1AF" text="#4A5565" delay={160} visible={visible} />
      </div>

      {/* ── Search + Filter Bar ── */}
      <div className="bg-white rounded-2xl px-5 py-4 mb-4 shadow-sm flex flex-col gap-3 transition-all duration-500 ease-in-out">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-[10px]">
            <LuSearch className="text-[#9ca3af] text-[17px] shrink-0" />
            <input
              type="text"
              placeholder="Search by Doctor or Date..."
              className="w-full bg-transparent outline-none text-[14px] text-black-main-text placeholder-[#9ca3af]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setFilterOpen((o) => !o)}
            className="flex items-center gap-2 bg-brand-main text-white font-semibold text-[13px] px-4 py-[10px] rounded-xl cursor-pointer border-none shadow-[0_4px_14px_rgba(51,60,245,0.3)] transition-transform active:scale-95"
          >
            <LuFilter className="text-[15px]" />
            Filter
            <span className={`text-[11px] ml-1 transition-transform duration-300 inline-block ${filterOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>
        </div>

        {filterOpen && (
          <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-gray-100">
            {FILTER_OPTIONS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-[7px] rounded-xl text-[13px] font-semibold cursor-pointer border-none transition-all duration-300 ${getActiveTabClass(f)}`}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Count ── */}
      <p className="text-[13px] text-[#4A5565] font-medium mb-4">
        Showing <span className="font-bold text-black-main-text">{filtered.length}</span> prescription{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* ── Cards Grid ── */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-[#9ca3af] text-[14px] shadow-sm">
          No prescriptions found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, idx) => (
            <PrescriptionCard
              key={p.id}
              item={p}
              index={idx}
              visible={visible}
              onView={() => navigate(`/patient/prescription/${p.id}`, { state: { prescription: p } })}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Stat Card ── */
const StatCard = ({ label, value, accent,text ,delay, visible }) => (
  <div
    className="bg-white rounded-2xl p-6 shadow-sm border-l-4"
    style={{
      borderLeftColor: accent,
      opacity:         visible ? 1 : 0,
      transform:       visible ? 'translateY(0)' : 'translateY(20px)',
      transition:      `opacity 0.45s ease ${delay}ms, transform 0.45s ease ${delay}ms`,
    }}
  >
    <p className="text-[13px] text-[#4A5565] mb-2 m-0">{label}</p>
    <h3 className="text-[32px] font-extrabold m-0 leading-none"
    
      style={{
      color: text}}
    >{value}</h3>
  </div>
);

/* ── Prescription Card ── */
const PrescriptionCard = ({ item, index, visible, onView }) => {
  const [loading, setLoading] = useState(false);
  const isActive   = item.status === 'Active';
  const medsCount  = item.medications?.length ?? 0;
  const testsCount = item.labs?.length        ?? 0;
  const delay      = 200 + index * 80;

  const handleDownload = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await generatePrescriptionPDF(item);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-white  rounded-3xl overflow-hidden shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-1"
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.97)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      {/* header */}
<div className={`px-5 py-4 flex items-start justify-between ${isActive ? 'bg-[#F0FDF4]' : 'bg-[#F9FAFB]'}`}>
  
  {/* الجزء الأيسر: يحتوي على بيانات الدكتور والتاريخ تحتها */}
  <div className="flex flex-col gap-3">
    
    {/* صف الدكتور: الأيقونة والاسم والتخصص */}
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-full bg-brand-main text-white flex items-center justify-center text-[20px] shrink-0">
        <FaRegUserCircle />
      </div>
      <div>
        <h4 className="text-[15px] font-bold text-black-main-text m-0 leading-tight">{item.doc}</h4>
        <p className="text-[12px] text-[#4A5565] m-0 flex items-center gap-1 mt-[2px]">
          <span className="text-[11px]">⚕</span> {item.spec}
        </p>
      </div>
    </div>

    {/* صف التاريخ: يظهر الآن تحت الدكتور مباشرة داخل الخلفية الملونة */}
    <div className="flex items-center gap-2 text-[12px] text-[#4A5565] ml-1">
      <HiOutlineCalendar className="text-[14px] shrink-0 text-[#4A5565]" />
      <span>Issued: <b className="text-black-main-text">{item.date}</b></span>
    </div>
    
  </div>

  {/* الجزء الأيمن: حالة الروشتة فقط */}
  <span className={`px-3 py-[3px] rounded-full text-[11px] font-bold shrink-0 ${isActive ? 'bg-[#00C950] text-white' : 'bg-[#99A1AF] text-white'}`}>
    {item.status}
  </span>
  
</div>

      {/* body */}
      <div className="px-5 py-4">

        <div className="flex justify-between text-[13px] mb-2">
          <span className="text-[#4A5565]">Medications</span>
          <strong className="text-black-main-text">{medsCount} item{medsCount !== 1 ? 's' : ''}</strong>
        </div>
        <div className="flex justify-between text-[13px] mb-3">
          <span className="text-[#4A5565]">Tests Requested</span>
          <strong className="text-black-main-text">{testsCount} item{testsCount !== 1 ? 's' : ''}</strong>
        </div>
        <p className="text-[11px] text-gray-text-dim2 border-t border-[#f3f4f6] pt-3 m-0">ID: {item.id}</p>
        <div className="flex gap-3 mt-4">
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-2 bg-brand-main text-white font-semibold text-[13px] py-[10px] rounded-xl cursor-pointer border-none transition-opacity hover:opacity-90"
          >
            <LuEye className="text-[15px]" /> View
          </button>
          <button
            onClick={handleDownload}
            disabled={loading}
            className="w-11 h-10 flex items-center justify-center bg-white border border-[#e5e7eb] rounded-xl text-[#364153] text-[18px] cursor-pointer transition-colors hover:bg-[#f9fafb] hover:text-brand-main"
          >
            {loading
              ? <div className="w-5 h-5 border-2 border-brand-main border-t-transparent rounded-full animate-spin" />
              : <LuDownload />
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientPrescriptions;