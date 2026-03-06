import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DataTable from '../DataTable/DataTable';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import EmptyState from '../shared/EmptyState/EmptyState';
import { Toast } from '../../../../components';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { FiSearch, FiUpload, FiPlus } from "react-icons/fi";
import { FaUserDoctor } from "react-icons/fa6";
import { MdOutlineManageAccounts } from "react-icons/md";

/* ── Realistic dummy doctors with real avatar photos ── */
const DUMMY_DOCTORS = [
  { id: 1,  fullName: "Dr. Sarah Mitchell",   email: "sarah.mitchell@pulsex.com",   price: 300, joinedDate: "Jan 10, 2023",  image: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: 2,  fullName: "Dr. James Thornton",   email: "james.thornton@pulsex.com",   price: 450, joinedDate: "Feb 14, 2023",  image: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 3,  fullName: "Dr. Layla Hassan",     email: "layla.hassan@pulsex.com",     price: 200, joinedDate: "Mar 2, 2023",   image: "https://randomuser.me/api/portraits/women/68.jpg" },
  { id: 4,  fullName: "Dr. Omar Khalil",      email: "omar.khalil@pulsex.com",      price: 350, joinedDate: "Mar 20, 2023",  image: "https://randomuser.me/api/portraits/men/75.jpg" },
  { id: 5,  fullName: "Dr. Emily Carter",     email: "emily.carter@pulsex.com",     price: 500, joinedDate: "Apr 5, 2023",   image: "https://randomuser.me/api/portraits/women/21.jpg" },
  { id: 6,  fullName: "Dr. Ahmed Nasser",     email: "ahmed.nasser@pulsex.com",     price: 275, joinedDate: "Apr 18, 2023",  image: "https://randomuser.me/api/portraits/men/11.jpg" },
  { id: 7,  fullName: "Dr. Nora Williams",    email: "nora.williams@pulsex.com",    price: 400, joinedDate: "May 1, 2023",   image: "https://randomuser.me/api/portraits/women/55.jpg" },
  { id: 8,  fullName: "Dr. Karim Farouk",     email: "karim.farouk@pulsex.com",     price: 320, joinedDate: "May 22, 2023",  image: "https://randomuser.me/api/portraits/men/46.jpg" },
  { id: 9,  fullName: "Dr. Mia Johnson",      email: "mia.johnson@pulsex.com",      price: 480, joinedDate: "Jun 7, 2023",   image: "https://randomuser.me/api/portraits/women/33.jpg" },
  { id: 10, fullName: "Dr. Youssef Salem",    email: "youssef.salem@pulsex.com",    price: 230, joinedDate: "Jun 30, 2023",  image: "https://randomuser.me/api/portraits/men/60.jpg" },
  { id: 11, fullName: "Dr. Chloe Bennett",    email: "chloe.bennett@pulsex.com",    price: 370, joinedDate: "Jul 14, 2023",  image: "https://randomuser.me/api/portraits/women/10.jpg" },
  { id: 12, fullName: "Dr. Tarek Ibrahim",    email: "tarek.ibrahim@pulsex.com",    price: 290, joinedDate: "Jul 28, 2023",  image: "https://randomuser.me/api/portraits/men/83.jpg" },
  { id: 13, fullName: "Dr. Sophia Martinez",  email: "sophia.martinez@pulsex.com",  price: 420, joinedDate: "Aug 9, 2023",   image: "https://randomuser.me/api/portraits/women/79.jpg" },
  { id: 14, fullName: "Dr. Hassan Al-Amin",   email: "hassan.alamin@pulsex.com",    price: 260, joinedDate: "Aug 25, 2023",  image: "https://randomuser.me/api/portraits/men/27.jpg" },
  { id: 15, fullName: "Dr. Ava Thompson",     email: "ava.thompson@pulsex.com",     price: 510, joinedDate: "Sep 3, 2023",   image: "https://randomuser.me/api/portraits/women/62.jpg" },
  { id: 16, fullName: "Dr. Rami Azzam",       email: "rami.azzam@pulsex.com",       price: 340, joinedDate: "Sep 17, 2023",  image: "https://randomuser.me/api/portraits/men/54.jpg" },
  { id: 17, fullName: "Dr. Isabella Moore",   email: "isabella.moore@pulsex.com",   price: 390, joinedDate: "Oct 1, 2023",   image: "https://randomuser.me/api/portraits/women/47.jpg" },
  { id: 18, fullName: "Dr. Fady Mansour",     email: "fady.mansour@pulsex.com",     price: 215, joinedDate: "Oct 12, 2023",  image: "https://randomuser.me/api/portraits/men/19.jpg" },
  { id: 19, fullName: "Dr. Olivia Davis",     email: "olivia.davis@pulsex.com",     price: 460, joinedDate: "Nov 5, 2023",   image: "https://randomuser.me/api/portraits/women/88.jpg" },
  { id: 20, fullName: "Dr. Mostafa Gamal",    email: "mostafa.gamal@pulsex.com",    price: 310, joinedDate: "Nov 20, 2023",  image: "https://randomuser.me/api/portraits/men/36.jpg" },
  { id: 21, fullName: "Dr. Charlotte Wilson", email: "charlotte.wilson@pulsex.com", price: 430, joinedDate: "Dec 4, 2023",   image: "https://randomuser.me/api/portraits/women/25.jpg" },
  { id: 22, fullName: "Dr. Ali Sayed",        email: "ali.sayed@pulsex.com",        price: 250, joinedDate: "Dec 19, 2023",  image: "https://randomuser.me/api/portraits/men/70.jpg" },
  { id: 23, fullName: "Dr. Amelia Harris",    email: "amelia.harris@pulsex.com",    price: 475, joinedDate: "Jan 8, 2024",   image: "https://randomuser.me/api/portraits/women/14.jpg" },
  { id: 24, fullName: "Dr. Sameh Lotfy",      email: "sameh.lotfy@pulsex.com",      price: 280, joinedDate: "Jan 23, 2024",  image: "https://randomuser.me/api/portraits/men/90.jpg" },
  { id: 25, fullName: "Dr. Ella Robinson",    email: "ella.robinson@pulsex.com",    price: 395, joinedDate: "Feb 6, 2024",   image: "https://randomuser.me/api/portraits/women/72.jpg" },
  { id: 26, fullName: "Dr. Khaled Badawi",    email: "khaled.badawi@pulsex.com",    price: 335, joinedDate: "Feb 19, 2024",  image: "https://randomuser.me/api/portraits/men/41.jpg" },
  { id: 27, fullName: "Dr. Grace Lee",        email: "grace.lee@pulsex.com",        price: 520, joinedDate: "Mar 3, 2024",   image: "https://randomuser.me/api/portraits/women/37.jpg" },
  { id: 28, fullName: "Dr. Nader Shawky",     email: "nader.shawky@pulsex.com",     price: 245, joinedDate: "Mar 17, 2024",  image: "https://randomuser.me/api/portraits/men/64.jpg" },
  { id: 29, fullName: "Dr. Zoe Anderson",     email: "zoe.anderson@pulsex.com",     price: 415, joinedDate: "Apr 2, 2024",   image: "https://randomuser.me/api/portraits/women/92.jpg" },
  { id: 30, fullName: "Dr. Hany Ramadan",     email: "hany.ramadan@pulsex.com",     price: 270, joinedDate: "Apr 15, 2024",  image: "https://randomuser.me/api/portraits/men/22.jpg" },
  { id: 31, fullName: "Dr. Lily Thomas",      email: "lily.thomas@pulsex.com",      price: 445, joinedDate: "May 1, 2024",   image: "https://randomuser.me/api/portraits/women/57.jpg" },
  { id: 32, fullName: "Dr. Mahmoud Hegazy",   email: "mahmoud.hegazy@pulsex.com",   price: 300, joinedDate: "May 14, 2024",  image: "https://randomuser.me/api/portraits/men/49.jpg" },
  { id: 33, fullName: "Dr. Aria Jackson",     email: "aria.jackson@pulsex.com",     price: 380, joinedDate: "Jun 1, 2024",   image: "https://randomuser.me/api/portraits/women/4.jpg"  },
  { id: 34, fullName: "Dr. Walid Fouad",      email: "walid.fouad@pulsex.com",      price: 225, joinedDate: "Jun 20, 2024",  image: "https://randomuser.me/api/portraits/men/7.jpg"   },
  { id: 35, fullName: "Dr. Scarlett White",   email: "scarlett.white@pulsex.com",   price: 490, joinedDate: "Jul 5, 2024",   image: "https://randomuser.me/api/portraits/women/83.jpg" },
  { id: 36, fullName: "Dr. Amir Taha",        email: "amir.taha@pulsex.com",        price: 315, joinedDate: "Jul 22, 2024",  image: "https://randomuser.me/api/portraits/men/15.jpg" },
  { id: 37, fullName: "Dr. Luna Garcia",      email: "luna.garcia@pulsex.com",      price: 360, joinedDate: "Aug 8, 2024",   image: "https://randomuser.me/api/portraits/women/29.jpg" },
  { id: 38, fullName: "Dr. Sherif Darwish",   email: "sherif.darwish@pulsex.com",   price: 240, joinedDate: "Aug 25, 2024",  image: "https://randomuser.me/api/portraits/men/88.jpg" },
  { id: 39, fullName: "Dr. Penny Clark",      email: "penny.clark@pulsex.com",      price: 435, joinedDate: "Sep 10, 2024",  image: "https://randomuser.me/api/portraits/women/66.jpg" },
  { id: 40, fullName: "Dr. Sabry Al-Attar",   email: "sabry.alattar@pulsex.com",    price: 295, joinedDate: "Sep 28, 2024",  image: "https://randomuser.me/api/portraits/men/56.jpg" },
];

export default function DoctorManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const [doctors, setDoctors] = useState(DUMMY_DOCTORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  /* modal stores: open, type ('single'|'bulk'), and targetId for single delete */
  const [modal, setModal] = useState({ open: false, type: 'single', targetId: null });
  const [toast, setToast] = useState({ visible: false, title: '', message: '' });

  /* ── Filtered doctors based on search ── */
  const filteredDoctors = doctors.filter((d) =>
    d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e) => setSearchQuery(e.target.value);

  /* ── Show toast if redirected from AddDoctorBtn / EditDoctor with success state ── */
  useEffect(() => {
    if (location.state?.success) {
      setToast({
        visible: true,
        title: location.state.title || 'Done Successfully',
        message: location.state.message || 'Your changes have been saved successfully',
      });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ── Delete Handlers ── */
  const openSingleDeleteModal = (item) => {
    setModal({ open: true, type: 'single', targetId: item.id });
  };

  const openBulkDeleteModal = () => {
    setModal({ open: true, type: 'bulk', targetId: null });
  };

  const handleDeleteConfirm = () => {
    if (modal.type === 'single') {
      setDoctors((prev) => prev.filter((d) => d.id !== modal.targetId));
      setSelectedIds((prev) => prev.filter((id) => id !== modal.targetId));
      setToast({ visible: true, title: 'Deleted Successfully', message: 'Doctor has been removed from the platform.' });
    } else {
      setDoctors((prev) => prev.filter((d) => !selectedIds.includes(d.id)));
      setSelectedIds([]);
      setToast({ visible: true, title: 'Deleted Successfully', message: `${selectedIds.length} doctors have been removed.` });
    }
    setModal({ open: false, type: 'single', targetId: null });
  };

  const handleExport = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Doctors');
      sheet.columns = [
        { header: 'Full Name',   key: 'fullName',    width: 30 },
        { header: 'Email',       key: 'email',       width: 35 },
        { header: 'Price ($)',   key: 'price',       width: 15 },
        { header: 'Joined Date', key: 'joinedDate',  width: 20 },
      ];
      doctors.forEach((d) => sheet.addRow(d));
      const finalBuf = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([finalBuf]), 'PulseX_Doctors.xlsx');
    } catch (e) { console.error("Export failed", e); }
  };

  return (
    <section className="flex flex-col gap-6 p-5 " aria-label="Doctor Management">

      {/* ── Global Toast ── */}
      <Toast
        visible={toast.visible}
        title={toast.title}
        message={toast.message}
        type="success"
        onClose={() => setToast(t => ({ ...t, visible: false }))}
      />

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-2">
            <MdOutlineManageAccounts className="text-[22px] text-black-main-text" aria-hidden="true" />
            <h1 className="text-[18px] sm:text-[20px] font-bold text-black-main-text leading-none">
              Doctor Management
            </h1>
          </div>
          <p className="text-[12px] text-gray-text-dim2 ">View, edit, and manage all platform doctors.</p>
        </div>
      </div>

      {/* ── Search + Actions Bar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[15px]" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search doctors…"
            aria-label="Search doctors"
            value={searchQuery}
            onChange={handleSearch}
            className=" pl-9 pr-4 py-2.5 text-[13px] bg-[#F6F7F8] border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#155dfc]/30 focus:border-[#155dfc] transition-colors"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
          >
            <FiUpload className="text-[14px]" /> Export
          </button>
          <button
            onClick={() => navigate('/admin/AddDoctorBtn')}
            className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-white bg-[#333CF5] rounded-full hover:bg-[#0913C3] transition-colors"
          >
            <FiPlus className="text-[14px]" /> Add Doctor
          </button>
        </div>
      </div>

      {/* ── Table / Empty State ── */}
      {filteredDoctors.length === 0 ? (
        <EmptyState
          icon={<FaUserDoctor />}
          title="No Doctors Found"
          description="No doctors have been added to the platform yet. Start building your medical team."
          buttonLabel="+ Add Doctor"
          onAction={() => navigate('/admin/AddDoctorBtn')}
          accentColor="#EFF6FF"
          iconColor="#2563EB"
        />
      ) : (
        <DataTable
          data={filteredDoctors}
          selectedItems={selectedIds}
          onToggle={toggleSelect}
          onDeleteIndividual={openSingleDeleteModal}
          onEdit={(item) => navigate(`/admin/edit-doctor/${item.id}`)}
          onBulkDelete={openBulkDeleteModal}
          onClearSelection={() => setSelectedIds([])}
        />
      )}

      <ConfirmModal
        isOpen={modal.open}
        title={modal.type === 'bulk' ? `Delete ${selectedIds.length} Doctors?` : 'Delete Doctor?'}
        desc={
          modal.type === 'bulk'
            ? `Are you sure you want to delete ${selectedIds.length} doctors? This action is permanent.`
            : 'Are you sure you want to delete this doctor? This action is permanent.'
        }
        onCancel={() => setModal({ open: false, type: 'single', targetId: null })}
        onConfirm={handleDeleteConfirm}
      />
    </section>
  );
}