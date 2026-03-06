import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import EmptyState from "../shared/EmptyState/EmptyState";
import { Toast } from "../../../../components";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { FiSearch, FiUpload, FiPlus, FiEdit3, FiTrash2 } from "react-icons/fi";
import { MdManageAccounts } from "react-icons/md";
import { HiOutlineUsers } from "react-icons/hi2";
import { HiChevronLeft, HiChevronRight, HiChevronDown } from "react-icons/hi2";

const DUMMY_PATIENTS = [
  { id: 1,  fullName: "Nada Aql",           email: "nada.aql@gmail.com",           phone: "+201008205312", age: 29, gender: "Female", image: "https://randomuser.me/api/portraits/women/12.jpg" },
  { id: 2,  fullName: "Hazem Abdelmajid",   email: "hazem.abdelmajid@gmail.com",   phone: "+201012020766", age: 33, gender: "Male",   image: "https://randomuser.me/api/portraits/men/23.jpg"   },
  { id: 3,  fullName: "Hoda Bakry",         email: "hoda.bakry@gmail.com",         phone: "+201012020766", age: 59, gender: "Female", image: "https://randomuser.me/api/portraits/women/34.jpg" },
  { id: 4,  fullName: "Ola Ashour",         email: "ola.ashour@gmail.com",         phone: "+201122626940", age: 45, gender: "Female", image: "https://randomuser.me/api/portraits/women/45.jpg" },
  { id: 5,  fullName: "Hanaa Khalil",       email: "hanaa.khalil@gmail.com",       phone: "+201005521587", age: 37, gender: "Female", image: "https://randomuser.me/api/portraits/women/56.jpg" },
  { id: 6,  fullName: "Sajda Hafez",        email: "sajda.hafez@gmail.com",        phone: "+201006865699", age: 52, gender: "Female", image: "https://randomuser.me/api/portraits/women/67.jpg" },
  { id: 7,  fullName: "Mohamed Abdelkader", email: "mohamed.abdelkader@gmail.com", phone: "+201140092221", age: 30, gender: "Male",   image: "https://randomuser.me/api/portraits/men/8.jpg"    },
  { id: 8,  fullName: "Tarek El-Moghawry",  email: "tarek.moghawry@gmail.com",     phone: "+201111269301", age: 60, gender: "Male",   image: "https://randomuser.me/api/portraits/men/17.jpg"   },
  { id: 9,  fullName: "Reem Saleh",         email: "reem.saleh@gmail.com",         phone: "+201001842794", age: 48, gender: "Female", image: "https://randomuser.me/api/portraits/women/78.jpg" },
  { id: 10, fullName: "Abdelmohsen Salem",  email: "abdelmohsen.salem@gmail.com",  phone: "+201003738387", age: 27, gender: "Male",   image: "https://randomuser.me/api/portraits/men/29.jpg"   },
  { id: 11, fullName: "Amjad Hussein",      email: "amjad.hussein@gmail.com",      phone: "+201090986990", age: 40, gender: "Male",   image: "https://randomuser.me/api/portraits/men/38.jpg"   },
  { id: 12, fullName: "Sara Mohsen",        email: "sara.mohsen@gmail.com",        phone: "+201012345678", age: 31, gender: "Female", image: "https://randomuser.me/api/portraits/women/89.jpg" },
  { id: 13, fullName: "Khaled Nour",        email: "khaled.nour@gmail.com",        phone: "+201198765432", age: 44, gender: "Male",   image: "https://randomuser.me/api/portraits/men/47.jpg"   },
  { id: 14, fullName: "Mona Farouk",        email: "mona.farouk@gmail.com",        phone: "+201011223344", age: 38, gender: "Female", image: "https://randomuser.me/api/portraits/women/5.jpg"  },
  { id: 15, fullName: "Ahmed Saber",        email: "ahmed.saber@gmail.com",        phone: "+201055667788", age: 55, gender: "Male",   image: "https://randomuser.me/api/portraits/men/59.jpg"   },
  { id: 16, fullName: "Dina El-Sayed",      email: "dina.elsayed@gmail.com",       phone: "+201099887766", age: 26, gender: "Female", image: "https://randomuser.me/api/portraits/women/16.jpg" },
  { id: 17, fullName: "Omar Galal",         email: "omar.galal@gmail.com",         phone: "+201033445566", age: 34, gender: "Male",   image: "https://randomuser.me/api/portraits/men/71.jpg"   },
  { id: 18, fullName: "Yasmin Taha",        email: "yasmin.taha@gmail.com",        phone: "+201077889900", age: 42, gender: "Female", image: "https://randomuser.me/api/portraits/women/27.jpg" },
  { id: 19, fullName: "Mostafa Hamdy",      email: "mostafa.hamdy@gmail.com",      phone: "+201021343546", age: 50, gender: "Male",   image: "https://randomuser.me/api/portraits/men/82.jpg"   },
  { id: 20, fullName: "Nour Eldin Hassan",  email: "nour.hassan@gmail.com",        phone: "+201087654321", age: 36, gender: "Male",   image: "https://randomuser.me/api/portraits/men/93.jpg"   },
];

const ROWS_OPTIONS = [5, 10, 20, 50];

export default function PatientManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  const [patients,    setPatients]    = useState(DUMMY_PATIENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showRPPMenu, setShowRPPMenu] = useState(false);
  const [modal,       setModal]       = useState({ open: false, type: "single", targetId: null });
  const [toast,       setToast]       = useState({ visible: false, title: "", message: "" });

  useEffect(() => {
    if (location.state?.success) {
      setToast({
        visible: true,
        title:   location.state.title   || "Done Successfully",
        message: location.state.message || "Your changes have been saved.",
      });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const filtered = patients.filter((p) =>
    p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery)
  );

  const totalRows  = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const safePage   = Math.min(currentPage, totalPages);
  const pageStart  = (safePage - 1) * rowsPerPage;
  const pageItems  = filtered.slice(pageStart, pageStart + rowsPerPage);

  const allPageSelected =
    pageItems.length > 0 && pageItems.every((p) => selectedIds.includes(p.id));

  const toggleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleSelectAll = (chk) => {
    if (chk) setSelectedIds((prev) => [...new Set([...prev, ...pageItems.map((p) => p.id)])]);
    else     setSelectedIds((prev) => prev.filter((id) => !pageItems.find((p) => p.id === id)));
  };

  const openSingleDeleteModal = (patient) =>
    setModal({ open: true, type: "single", targetId: patient.id });

  const openBulkDeleteModal = () =>
    setModal({ open: true, type: "bulk", targetId: null });

  const handleDeleteConfirm = () => {
    if (modal.type === "single") {
      setPatients((prev) => prev.filter((p) => p.id !== modal.targetId));
      setSelectedIds((prev) => prev.filter((id) => id !== modal.targetId));
      setToast({
        visible: true,
        title: "Deleted Successfully",
        message: "Patient has been removed from the platform.",
      });
    } else {
      const count = selectedIds.length;
      setPatients((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      setSelectedIds([]);
      setToast({
        visible: true,
        title: "Deleted Successfully",
        message: `${count} patients have been removed.`,
      });
    }
    setModal({ open: false, type: "single", targetId: null });
  };

  const handleExport = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Patients");
      sheet.columns = [
        { header: "Full Name", key: "fullName", width: 30 },
        { header: "Email",     key: "email",    width: 35 },
        { header: "Phone",     key: "phone",    width: 20 },
        { header: "Age",       key: "age",      width: 10 },
        { header: "Gender",    key: "gender",   width: 12 },
      ];
      patients.forEach((p) => sheet.addRow(p));
      saveAs(new Blob([await workbook.xlsx.writeBuffer()]), "PulseX_Patients.xlsx");
    } catch (e) {
      console.error("Export failed", e);
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 4) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (safePage <= 2)   return [1, 2, 3, 4];
    if (safePage >= totalPages - 1)
      return [totalPages - 3, totalPages - 2, totalPages - 1, totalPages].filter((n) => n > 0);
    return [safePage - 1, safePage, safePage + 1, safePage + 2];
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <section className="relative flex flex-col gap-6 p-5 min-h-screen" aria-label="Patient Management">

      <Toast
        visible={toast.visible}
        title={toast.title}
        message={toast.message}
        type="success"
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />

      {/* ── Page Header ── */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-2">
          <MdManageAccounts className="text-[22px] text-black-main-text" aria-hidden="true" />
          <h1 className="text-[18px] sm:text-[20px] font-bold text-black-main-text leading-none">
            Patient Management
          </h1>
        </div>
        <p className="text-[12px] text-[#757575]">View, edit, and manage all registered patients.</p>
      </div>

      {/* ── Search + Actions ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[15px]" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search patients…"
            aria-label="Search patients"
            value={searchQuery}
            onChange={handleSearch}
            className=" pl-9 pr-4 py-2.5 text-[13px] bg-[#F6F7F8] border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#333CF5]/30 focus:border-[#333CF5] transition-colors"
          />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
            <FiUpload className="text-[14px]" /> Export
          </button>
          <button onClick={() => navigate("/admin/AddPatientBtn")} className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-white bg-[#333CF5] rounded-full hover:bg-[#0913C3] transition-colors">
            <FiPlus className="text-[14px]" /> Add Patient
          </button>
        </div>
      </div>

      {/* ── Floating Bulk Bar - Pixel Perfect Style ── */}
      {selectedIds.length > 0 && (
        <div className="absolute top-[221px] left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-3 py-2 bg-white border border-gray-100 rounded-xl shadow-[0px_10px_30px_rgba(0,0,0,0.15)] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-3 py-2 bg-[#333CF5] text-white text-[12px] font-bold rounded-lg whitespace-nowrap">
            {selectedIds.length} Patients Selected
          </div>
          <button 
            onClick={openBulkDeleteModal} 
            className="px-4 py-2 text-[12px] font-bold text-white bg-red-600 rounded-lg hover:bg-red-600 transition-all active:scale-95 shadow-sm shadow-red-200"
          >
            Delete Selected
          </button>
          <button 
            onClick={() => setSelectedIds([])} 
            className="px-4 py-2 text-[12px] font-bold text-neutral-500 bg-zinc-100 border border-gray-200 rounded-lg hover: text-neutral-500 bg-zinc-100 transition-all active:scale-95"
          >
            Cancel
          </button>
        </div>
      )}

      {/* ── Table Area ── */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<HiOutlineUsers />}
          title="No Patients Found"
          description="No patients have been registered on the platform yet."
          buttonLabel="+ Add Patient"
          onAction={() => navigate("/admin/AddPatientBtn")}
          accentColor="#F0FDF4"
          iconColor="#059669"
        />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="overflow-x-auto rounded-xl border border-gray-200/70 bg-white">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="bg-[#333CF5] text-white text-left">
                  <th className="w-10 px-4 py-4">
                    <input 
                      type="checkbox" 
                      checked={allPageSelected} 
                      onChange={(e) => toggleSelectAll(e.target.checked)} 
                      className="w-4 h-4 rounded accent-white cursor-pointer border-2 border-white/30" 
                    />
                  </th>
                  <th className="px-4 py-4 text-[13px] font-semibold whitespace-nowrap">Full Name</th>
                  <th className="px-4 py-4 text-[13px] font-semibold whitespace-nowrap">Email</th>
                  <th className="px-4 py-4 text-[13px] font-semibold whitespace-nowrap">Phone</th>
                  <th className="px-4 py-4 text-[13px] font-semibold text-center whitespace-nowrap">Age</th>
                  <th className="px-4 py-4 text-[13px] font-semibold text-center whitespace-nowrap">Gender</th>
                  <th className="px-4 py-4 text-[13px] font-semibold text-center whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((patient, idx) => {
                  const isMale = patient.gender?.toLowerCase() === "male";
                  const isSelected = selectedIds.includes(patient.id);
                  return (
                    <tr key={patient.id} className={`border-b border-gray-100 transition-colors ${isSelected ? "bg-[#EFF6FF]" : idx % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"} hover:bg-[#EFF6FF]/60`}>
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(patient.id)} className="w-4 h-4 rounded accent-[#155dfc] cursor-pointer" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={patient.image} alt={patient.fullName} className="w-9 h-9 rounded-full object-cover shrink-0 border border-gray-100" />
                          <span className="text-[14px] font-semibold text-black-main-text truncate max-w-[160px]">{patient.fullName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className="text-[13px] text-gray-text-dim2 truncate block max-w-[180px]">{patient.email}</span></td>
                      <td className="px-4 py-3"><span className="text-[13px] text-gray-text-dim2 whitespace-nowrap">{patient.phone}</span></td>
                      <td className="px-4 py-3 text-center"><span className="text-[13px] text-[#757575]">{patient.age}</span></td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-3 py-1 text-[11px] font-bold rounded-full ${isMale ? "bg-[#28A745] text-white" : "bg-[#FD7E14] text-white"}`}>{patient.gender}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button onClick={() => navigate(`/admin/edit-patient/${patient.id}`)} className="w-8 h-8 flex items-center justify-center rounded-lg text-black-main-text hover:bg-[#EEF2FF] transition-all" title="Edit"><FiEdit3 size={15} /></button>
                          <button onClick={() => openSingleDeleteModal(patient)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#DC3545] hover:bg-red-50 transition-all" title="Delete"><FiTrash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Pagination / Rows Per Page ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="relative flex items-center gap-2 text-[12px] text-[#333CF5]">
              <span>Rows per page</span>
              <div className="relative">
                <button 
                  onClick={() => setShowRPPMenu((v) => !v)} 
                  className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-full bg-white hover:bg-gray-50 text-[12px] font-bold text-[#333CF5] transition-all"
                >
                  {rowsPerPage}<HiChevronDown size={14} />
                </button>
                {showRPPMenu && (
                  <ul className="absolute left-0 bottom-full mb-2 z-40 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden min-w-[80px] list-none p-1 border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                    {ROWS_OPTIONS.map((opt) => (
                      <li key={opt} onClick={() => { setRowsPerPage(opt); setCurrentPage(1); setShowRPPMenu(false); }} className={`px-3 py-2 text-[12px] cursor-pointer rounded-lg transition-colors ${opt === rowsPerPage ? "bg-[#EFF6FF] text-[#333CF5] font-bold" : "hover:bg-gray-50 text-gray-700"}`}>{opt}</li>
                    ))}
                  </ul>
                )}
              </div>
              <span className="font-medium">of {totalRows} rows</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button disabled={safePage === 1} onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <HiChevronLeft size={16} />
              </button>
              {getPageNumbers().map((n) => (
                <button key={n} onClick={() => setCurrentPage(n)} className={`w-8 h-8 flex items-center justify-center rounded-full text-[13px] font-bold transition-all ${n === safePage ? "bg-[#333CF5] text-white shadow-md shadow-blue-200" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{n}</button>
              ))}
              <button disabled={safePage === totalPages} onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <HiChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={modal.open}
        title={modal.type === "bulk" ? `Delete ${selectedIds.length} Patients?` : "Delete Patient?"}
        desc={modal.type === "bulk" ? `Are you sure you want to delete ${selectedIds.length} patients? This action is permanent.` : "Are you sure you want to delete this patient? This action is permanent."}
        onCancel={() => setModal({ open: false, type: "single", targetId: null })}
        onConfirm={handleDeleteConfirm}
      />
    </section>
  );
}