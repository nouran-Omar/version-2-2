import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineFlag,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineTrash,
  HiOutlineEye,
  HiExclamationTriangle,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineBookOpen,
  HiArrowPath,
} from 'react-icons/hi2';
import { FiCheckCircle } from "react-icons/fi";
import { HiOutlineX } from "react-icons/hi";
import Toast from '../../../../components/Toast/Toast';
import { MOCK_REPORTS } from './reportsMockData';

// ── Delete Content Modal ────────────────────────────────────────
function DeleteContentModal({ report, onConfirm, onCancel }) {
  if (!report) return null;
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-white rounded-[20px] shadow-xl p-6 w-full max-w-[400px] flex flex-col gap-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-2xl mx-auto">
          <HiExclamationTriangle />
        </div>
        <div className="text-center">
          <h2 className="text-[16px] font-bold text-black-main-text">Delete Content</h2>
          <p className="text-[12px] text-gray-400 mt-0.5">This action cannot be undone</p>
        </div>
        <div className="bg-[#F6F7F8] rounded-xl p-4 flex flex-col gap-1.5">
          <p className="text-[12px] text-gray-600"><strong>Type:</strong> {report.contentType.toLowerCase()}</p>
          <p className="text-[12px] text-gray-600"><strong>Author:</strong> {report.contentAuthor}</p>
          <p className="text-[12px] text-gray-500 italic line-clamp-3">"{report.contentText}"</p>
        </div>
        <p className="text-[12px] text-gray-500 text-center">
          Are you sure you want to permanently delete this content? This will remove it from the platform and notify the author.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 cursor-pointer py-2.5 text-[13px] font-semibold text-gray-600 bg-[#F6F7F8] rounded-[10px] hover:bg-gray-200 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 cursor-pointer py-2.5 text-[13px] font-semibold text-white bg-red-500 rounded-[10px] hover:bg-red-600 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────
export default function ReportsManagement() {
  const navigate = useNavigate();
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState({ visible: false, title: '', message: '' });

  const showToast = (title, message) => {
    setToast({ visible: true, title, message });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  };

  const stats = useMemo(() => ({
    total:     reports.length,
    pending:   reports.filter(r => r.status === 'Pending').length,
    reviewed:  reports.filter(r => r.status === 'Reviewed').length,
    dismissed: reports.filter(r => r.status === 'Dismissed').length,
  }), [reports]);

  const handleMarkReviewed = (id) => { setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Reviewed' } : r)); showToast('Marked as Reviewed', 'The report has been marked as reviewed.'); };
  const handleDismiss      = (id) => { setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Dismissed' } : r)); showToast('Report Dismissed', 'The report has been dismissed successfully.'); };
  const handleReopen       = (id) => { setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Pending' } : r)); showToast('Report Reopened', 'The report has been moved back to Pending.'); };
  const handleDeleteConfirm = () => { setReports(prev => prev.filter(r => r.id !== deleteTarget.id)); setDeleteTarget(null); showToast('Content Deleted', 'The reported content has been permanently removed.'); };
  const handleViewContent   = (report) => { if (report.storyId) navigate(`/admin/stories/${report.storyId}`); };

  return (
    <section className="flex flex-col gap-6 p-6 " aria-label="Reports Management">
      <Toast visible={toast.visible} title={toast.title} message={toast.message} type="success" onClose={() => setToast(t => ({ ...t, visible: false }))} />
      <DeleteContentModal report={deleteTarget} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} />

      {/* ── Header ── */}
    <div className="flex flex-col gap-1.5">
  {/* العنوان والأيقونة في سطر واحد */}
  <div className="flex items-center gap-2.5 text-black-main-text">
    <HiOutlineFlag className="text-[24px]  shrink-0" aria-hidden="true" />
    <h1 className="text-[14px] sm:text-[20px] font-bold leading-tight">
      Reports Management
    </h1>
  </div>
  
  {/* الوصف يبدأ تحت العنوان مباشرة (تمت إزاحة النص بمقدار حجم الأيقونة + Gap) */}
  <p className="text-[18px] text-gray-text-dim2  leading-relaxed">
    Review and manage reported content from the community.
  </p>
</div>
      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 px-8 py-6 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Reports',  value: stats.total,     icon: <HiOutlineFlag />,   bg: 'from-blue-500 to-blue-600' },
          { label: 'Pending Review', value: stats.pending,   icon: <HiOutlineClock />,  bg: 'from-orange-500 to-orange-600' },
          { label: 'Reviewed',       value: stats.reviewed,  icon: <FiCheckCircle />,   bg: 'from-green-500 to-green-600' },
          { label: 'Dismissed',      value: stats.dismissed, icon: <HiOutlineXCircle />,bg: 'from-gray-500 to-gray-600 ' },
        ].map(({ label, value, icon, bg }) => (
          <div key={label} className={`bg-gradient-to-br ${bg} rounded-[16px] p-8 text-white flex flex-col gap-2`}>
            <div className="text-2xl opacity-80">{icon}</div>
            <p className="text-[14px] font-semibold opacity-80 uppercase tracking-wide">{label}</p>
            <p className="text-[30px] font-bold leading-none">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Reports List ── */}
      <div className="flex flex-col gap-4">
        {reports.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-[13px] text-gray-400">No reports found.</div>
        ) : (
          reports.map(report => (
            <ReportCard
              key={report.id}
              report={report}
              onMarkReviewed={() => handleMarkReviewed(report.id)}
              onDismiss={() => handleDismiss(report.id)}
              onReopen={() => handleReopen(report.id)}
              onDelete={() => setDeleteTarget(report)}
              onView={() => handleViewContent(report)}
            />
          ))
        )}
      </div>
    </section>
  );
}

// ── Badge helpers (Figma exact) ─────────────────────────────────
const STATUS_BADGE = {
  Pending:   'bg-orange-100 text-orange-700 outline outline-[0.8px] outline-orange-200',
  Reviewed:  'bg-green-100  text-green-700  outline outline-[0.8px] outline-green-200',
  Dismissed: 'bg-gray-100   text-gray-700   outline outline-[0.8px] outline-gray-200',
};

const CATEGORY_BADGE = {
  Spam:                 'bg-purple-100    text-purple-700  outline outline-[0.8px] outline-red-200',
  Misinformation:       'bg-yellow-200 text-yellow-700  outline outline-[0.8px] outline-orange-200',
  Harassment:           'bg-red-100    text-red-700 outline outline-[0.8px] outline-red-200',
  'Inappropriate Content': 'bg-red-100 text-[#C10007]  outline outline-[0.8px] outline-red-200',
  Other:                'bg-blue-100   text-[#155DFC]  outline outline-[0.8px] outline-blue-200',
};

// ── ReportCard ──────────────────────────────────────────────────
function ReportCard({ report, onMarkReviewed, onDismiss, onReopen, onDelete, onView }) {
  const isPending   = report.status === 'Pending';
  const isReviewed  = report.status === 'Reviewed';
  const isDismissed = report.status === 'Dismissed';

  const contentTypeIcon =
    report.contentType === 'Comment' || report.contentType === 'Reply'
      ? <HiOutlineChatBubbleOvalLeft size={13} />
      : <HiOutlineBookOpen size={13} />;

  const statusBadge   = STATUS_BADGE[report.status]   ?? STATUS_BADGE.Dismissed;
  const categoryBadge = CATEGORY_BADGE[report.category] ?? 'bg-gray-100 text-gray-600 outline outline-[0.8px] outline-gray-200';

  return (
    <article className="bg-white rounded-2xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10),0px_1px_2px_-1px_rgba(0,0,0,0.10)] outline outline-[0.8px] outline-gray-200 px-6 pt-6 pb-5 flex flex-col gap-4">

      {/* ── Reporter Row ── */}
      <div className="flex flex-wrap items-start gap-4">
        {/* Avatar */}
        {report.reporterAvatar ? (
          <img
            src={report.reporterAvatar}
            alt={report.reportedBy}
            className="w-12 h-12 rounded-full object-cover shrink-0 border border-gray-200"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-[#E7000B] shrink-0">
            <HiOutlineFlag size={20} />
          </div>
        )}

        {/* Name + badges */}
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          {/* Name + time */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[16px] font-semibold text-black-main-text leading-6">
              Reported by {report.reportedBy}
            </span>
            <span className="text-[12px] text-gray-500 font-normal">{report.reporterTime}</span>
          </div>
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center px-3 py-[4px] text-[12px] font-medium rounded-full leading-4 ${statusBadge}`}>
              {report.status}
            </span>
            <span className={`inline-flex items-center px-3 py-[4px] text-[12px] font-medium rounded-full leading-4 ${categoryBadge}`}>
              {report.category}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-[4px] text-[12px] font-medium rounded-full leading-4 bg-gray-100 text-gray-700 outline outline-[0.8px] outline-gray-200">
              {contentTypeIcon}
              {report.contentType}
            </span>
          </div>
        </div>
      </div>

      {/* ── Story ref ── */}
      <p className="text-[14px] text-gray-600">
        In story: <em className="not-italic font-medium text-gray-700">"{report.storyTitle}"</em>
      </p>

      {/* ── Content Box (red-tinted, Figma exact) ── */}
      <div className="bg-[#FEF2F2] border border-[#FFC9C9] rounded-xl px-4 py-3 flex flex-col gap-1.5">
        <p className="flex items-center gap-1.5 text-[14px] font-semibold text-red-700">
          <HiExclamationTriangle className='text-red-600' size={14} />
          Content by {report.contentAuthor}:
        </p>
        <p className="text-[14px] text-gray-700 leading-relaxed italic">
          "{report.contentText}"
        </p>
      </div>

      {/* ── Report Reason Box ── */}
      <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-3 flex flex-col gap-1">
        <p className="text-[14px] font-semibold text-black-main-text ">Report Reason:</p>
        <p className="text-[14px] text-gray-700 leading-relaxed">{report.reportReason}</p>
      </div>

      {/* ── Action Buttons (Figma pill-style) ── */}
      <div className="flex flex-wrap gap-2 pt-1">
        {/* View — always shown */}
        <button
          onClick={onView}
          className="flex cursor-pointer items-center gap-1.5 px-4 py-2 text-[14px] font-semibold text-white bg-[#155DFC] rounded-lg hover:bg-[#0913C3] transition-colors"
        >
          <HiOutlineEye size={14} /> View Content
        </button>

        {/* Pending actions */}
        {isPending && (
          <>
            <button
              onClick={onDelete}
              className="flex cursor-pointer items-center gap-1.5 px-4 py-2 text-[14px] font-semibold text-white bg-[#E7000B] rounded-lg hover:bg-[#C10007] transition-colors"
            >
              <HiOutlineTrash size={14} /> Delete Content
            </button>
            <button
              onClick={onMarkReviewed}
              className="flex cursor-pointer items-center gap-1.5 px-4 py-2 text-[14px] font-semibold text-white bg-[#00A63E] rounded-lg hover:bg-[#008236] transition-colors"
            >
              <HiOutlineCheckCircle size={14} /> Mark Reviewed
            </button>
            <button
              onClick={onDismiss}
              className="flex cursor-pointer items-center gap-1.5 px-4 py-2 text-[14px] font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <HiOutlineXCircle size={14} /> Dismiss
            </button>
          </>
        )}

        {/* Reviewed actions */}
        {isReviewed && (
          <>
            <button
              onClick={onDelete}
              className="flex cursor-pointer items-center gap-1.5 px-4 py-2 text-[14px] font-semibold text-white bg-[#E7000B] rounded-lg hover:bg-[#C10007] transition-colors"
            >
              <HiOutlineTrash size={14} /> Delete Content
            </button>
            <button
              onClick={onDismiss}
              className="flex cursor-pointer items-center gap-1.5 px-4 py-2 text-[14px] font-semibold text-[#4A5565] bg-[#F3F4F6] rounded-lg hover:bg-[#E5E7EB] transition-colors"
            >
              <HiOutlineXCircle size={14} /> Dismiss
            </button>
            <button
              onClick={onReopen}
              className="flex cursor-pointer items-center gap-1.5 px-4 py-2 text-[12px] font-semibold text-[#CA3500] bg-[#FFEDD4] rounded-lg hover:bg-orange-200 transition-colors"
            >
              <HiArrowPath size={14} /> Reopen
            </button>
          </>
        )}

        {/* Dismissed actions */}
        {isDismissed && (
          <button
            onClick={onReopen}
            className="flex cursor-pointer items-center gap-1.5 px-4 py-2 text-[12px] font-semibold text-[#CA3500] bg-[#FFEDD4] rounded-lg hover:bg-orange-200 transition-colors"
          >
            <HiArrowPath size={14} /> Re-open
          </button>
        )}
      </div>
    </article>
  );
}
