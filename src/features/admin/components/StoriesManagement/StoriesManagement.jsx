import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from "react-icons/fa";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineEye,
  HiOutlineTrash,
  HiOutlinePencilSquare,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineEyeSlash,
} from 'react-icons/hi2';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { MdOutlineAutoStories } from 'react-icons/md';
import { FaBookOpen } from 'react-icons/fa6';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import Toast from '../../../../components/Toast/Toast';
import EmptyState from '../shared/EmptyState/EmptyState';
import {
  MOCK_STORIES as INITIAL_STORIES,
  TAG_OPTIONS,
  STATUS_OPTIONS,
  SORT_OPTIONS,
} from './storiesMockData';

const PAGE_SIZE_REAL =3;
const MAX_VISIBLE_PAGES = 5;

export default function StoriesManagement() {
  const navigate = useNavigate();

  const [stories, setStories]   = useState(INITIAL_STORIES);
  const [tag, setTag]           = useState('All');
  const [status, setStatus]     = useState('All');
  const [sort, setSort]         = useState('Normal');
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(1);

  // Modals
  const [deleteModal, setDeleteModal] = useState({ open: false, story: null });

  // Toast
  const [toast, setToast] = useState({ visible: false, title: '', message: '' });

  const showToast = (title, message) => {
    setToast({ visible: true, title, message });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  };

  // ── Derived lists ──────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...stories];
    if (status !== 'All') list = list.filter(s => s.status === status);
    if (search.trim())    list = list.filter(s =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.author.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === 'Newest') list = list.reverse();
    if (sort === 'Oldest') list = [...list].reverse();
    return list;
  }, [stories, status, search, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE_REAL);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE_REAL, page * PAGE_SIZE_REAL);

  const handlePageChange = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  // ── Smart pagination: show first 5 pages, then "..." then last page
  const buildPageNums = () => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = Array.from({ length: MAX_VISIBLE_PAGES }, (_, i) => i + 1);
    if (page > MAX_VISIBLE_PAGES && totalPages > MAX_VISIBLE_PAGES) {
      return [...pages, '...', totalPages];
    }
    return [...pages, '...', totalPages];
  };
  const pageNums = buildPageNums();

  // ── Actions ────────────────────────────────────────────────
  const handleRowClick = (story) => {
    navigate(`/admin/stories/${story.id}`);
  };

  const handleToggleHide = (e, story) => {
    e.stopPropagation();
    const newStatus = story.status === 'Hidden' ? 'Published' : 'Hidden';
    setStories(prev => prev.map(s => s.id === story.id ? { ...s, status: newStatus } : s));
    if (newStatus === 'Hidden') {
      showToast('Story Hidden Successfully', 'Your changes have been saved successfully.');
    } else {
      showToast('Story Unhidden Successfully', 'Your changes have been saved successfully.');
    }
  };

  const handleDeleteClick = (e, story) => {
    e.stopPropagation();
    setDeleteModal({ open: true, story });
  };

  const handleDeleteConfirm = () => {
    const story = deleteModal.story;
    setStories(prev => prev.map(s => s.id === story.id ? { ...s, status: 'Deleted' } : s));
    setDeleteModal({ open: false, story: null });
    showToast('Story Deleted Successfully', 'Your changes have been saved successfully.');
  };

  // Live stat counts from state
  const liveStats = useMemo(() => ({
    total:     stories.length,
    published: stories.filter(s => s.status === 'Published').length,
    hidden:    stories.filter(s => s.status === 'Hidden').length,
    deleted:   stories.filter(s => s.status === 'Deleted').length,
  }), [stories]);

  return (
    <section className="flex flex-col gap-6 p-6 " aria-label="Stories Management">

      <Toast visible={toast.visible} title={toast.title} message={toast.message} type="success" onClose={() => setToast(t => ({ ...t, visible: false }))} />
      <ConfirmModal isOpen={deleteModal.open} title="Delete Story?" desc="Are you sure you want to delete this story? This action is permanent." onConfirm={handleDeleteConfirm} onCancel={() => setDeleteModal({ open: false, story: null })} />

      {/* ── Header ── */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-2">
          <HiOutlinePencilSquare className="text-[22px] text-black-main-text " aria-hidden="true" />
          <h1 className="text-[24px] sm:text-[24px] font-bold text-black-main-text leading-none">Patient Stories</h1>
        </div>
        <p className="text-[18px] text-gray-text-dim2 ">Read and share inspiring patient journeys.</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Stories"     value={liveStats.total}     icon={<FaBookOpen />} iconBg="#EEF2FF" iconColor="#333CF5" />
        <StatCard label="Published Stories" value={liveStats.published} icon={<FaEye />}       iconBg="#ECFDF5" iconColor="#16A34A" />
        <StatCard label="Hidden Stories"    value={liveStats.hidden}    icon={<FaEyeSlash />}  iconBg="#FFF7ED" iconColor="#757575" />
        <StatCard label="Deleted Stories"   value={liveStats.deleted}   icon={<FaTrash />}     iconBg="#FEF2F2" iconColor="#EF4444" />
      </div>

      {/* ── Filters Bar ── */}
      <div className="flex flex-col rounded-xl bg-[#F1F2F5] p-3 sm:flex-row flex-wrap gap-3 items-start sm:items-center">
        {[
          { label: 'Tags:', val: tag, setter: setTag, opts: TAG_OPTIONS },
          { label: 'Status:', val: status, setter: setStatus, opts: STATUS_OPTIONS },
          { label: 'Sort By:', val: sort, setter: setSort, opts: SORT_OPTIONS },
        ].map(({ label, val, setter, opts }) => (
          <div key={label} className="flex items-center gap-2 px-6">
            <label className="text-[14px font-normal text-gray-500 whitespace-nowrap">{label}</label>
            <select
              value={val}
              onChange={e => { setter(e.target.value); setPage(1); }}
              className="text-[12px] border border-gray-200 rounded-full px-2.5 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#155dfc]/30 cursor-pointer"
            >
              {opts.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <div className="relative sm:ml-auto">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[14px]" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search stories…"
            aria-label="Search stories"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 pr-4 py-2 text-[14px] border border-gray-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-[#155dfc]/30 w-full sm:w-[200px]"
          />
        </div>
      </div>

{/* ── Table Area ── */}
<div className="overflow-x-auto border border-gray-200/70 rounded-[20px] bg-white">
  <table className="w-full min-w-[700px] border-collapse">
    <thead>
      <tr className="bg-[#333CF5] text-white">
        {/* أول خلية left والباقي center */}
        <th className="px-6 py-5 text-[12px] font-normal text-center whitespace-nowrap uppercase tracking-wider">Story</th>
        <th className="px-4 py-5 text-[12px] font-normal text-center whitespace-nowrap uppercase tracking-wider">Author</th>
        <th className="px-4 py-5 text-[12px] font-normal text-center whitespace-nowrap uppercase tracking-wider">Date Published</th>
        <th className="px-4 py-5 text-[12px] font-normal text-center whitespace-nowrap uppercase tracking-wider">Status</th>
        <th className="px-4 py-5 text-[12px] font-normal text-center whitespace-nowrap uppercase tracking-wider">Actions</th>
      </tr>
    </thead>
    
    <tbody>
      {paginated.map((story, idx) => (
        <tr
          key={story.id}
          onClick={() => handleRowClick(story)}
          className={`border-b border-gray-100 transition-colors cursor-pointer ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'} hover:bg-[#EFF6FF]/60`}
        >
          {/* 1. القصة: محاذاة لليسار مع صورة مطولة */}
          <td className="px-6 py-8 text-left">
            <div className="flex items-start gap-4">
              {/* الصورة خليناها مطولة (w-16 h-20) عشان تملى الـ Row وتكون واضحة */}
              <img 
                src={story.cover} 
                alt={story.title} 
                className="w-16 h-20 rounded-[12px] object-cover shrink-0 border border-gray-100 shadow-sm" 
              />
              <div className="flex flex-col gap-2 min-w-0">
                <h3 className="text-[17px] font-bold text-black-main-text leading-tight">
                  {story.title}
                </h3>
                <p className="text-[14px] text-gray-text-dim2 leading-relaxed max-w-[350px]">
                  {story.desc}
                </p>
              </div>
            </div>
          </td>

          {/* 2. الكاتب: في النص */}
        <td className="px-4 py-8">
  <div className="flex items-center justify-center gap-3"> {/* شيلنا flex-col وخليناها flex بس */}
    <img 
      src={story.avatar} 
      alt={story.author} 
      className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0" 
    />
    <span className="text-[16px] font-semibold text-black-main-text whitespace-nowrap">
      {story.author}
    </span>
  </div>
</td>

          {/* 3. التاريخ: في النص */}
          <td className="px-4 py-8 text-center text-[14px] text-gray-500 font-medium">
            {story.date}
          </td>

          {/* 4. الحالة: في النص */}
          <td className="px-4 py-8 text-center">
            <span className={`inline-block px-4 py-1.5 text-[12px] font-bold rounded-full ${
              story.status === 'Published' ? 'bg-[#DCFCE7] text-[#15803D]' :
              story.status === 'Hidden'    ? 'bg-gray-100 text-[#757575]' :
              'bg-[#FEF2F2] text-[#EF4444]'
            }`}>
              {story.status}
            </span>
          </td>

          {/* 5. الأزرار: في النص */}
          <td className="px-4 py-8 text-center" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-center gap-3">
              <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/stories/${story.id}`); }} className="w-10 h-10 cursor-pointer flex items-center justify-center rounded-xl bg-gray-50 text-[#333CF5] hover:bg-[#333CF5] hover:text-white transition-all shadow-sm">
                <HiOutlineEye size={20} />
              </button>
              <button
                onClick={(e) => handleToggleHide(e, story)}
                title={story.status === 'Hidden' ? 'Unhide Story' : 'Hide Story'}
                className={`w-10 h-10 cursor-pointer flex items-center justify-center rounded-xl transition-all shadow-sm
                  ${story.status === 'Hidden'
                    ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-500 hover:text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-400 hover:text-white'
                  }`}
              >
                {story.status === 'Hidden' ? <HiOutlineEyeSlash size={20} /> : <HiOutlineEyeSlash size={20} />}
              </button>
              <button onClick={(e) => handleDeleteClick(e, story)} className="w-10 h-10 cursor-pointer flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                <HiOutlineTrash size={20} />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

      

        {/* Pagination */}
        <div className="flex mt-3 flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100">
          <span className="text-[14px] text-gray-400">
            Showing {paginated.length === 0 ? 0 : (page - 1) * PAGE_SIZE_REAL + 1}–{Math.min(page * PAGE_SIZE_REAL, filtered.length)} of {filtered.length} stories
          </span>
          <div className="flex items-center gap-1">
            <button disabled={page === 1} onClick={() => handlePageChange(page - 1)} className="w-10 h-10  flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><HiChevronLeft size={14} /></button>
            {pageNums.map((n, idx) =>
              n === '...' ? (
                <span key={`ellipsis-${idx}`} className="px-1 text-[14px] text-gray-400">…</span>
              ) : (
                <button key={n} onClick={() => handlePageChange(n)} className={`w-10 h-10 cursor-pointer flex items-center justify-center rounded-full text-[12px] font-semibold transition-colors ${page === n ? 'bg-[#155dfc] text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{n}</button>
              )
            )}
            <button disabled={page === totalPages || totalPages === 0} onClick={() => handlePageChange(page + 1)} className="w-10 h-10  flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><HiChevronRight size={14} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── StatCard sub-component ────────────────────────────────────
function StatCard({ label, value, icon, iconBg, iconColor }) {
  return (
    <div className="flex items-center justify-between shadow-xl rounded-[14px] border-gray-text-dim2 py-8 px-4">
      <div className="flex flex-col gap-1">
        <p className="text-[14px] font-normal text-gray-text-dim2  tracking-wide mb-2">{label}</p>
        <p className="text-[30px] font-bold text-black-main-text leading-none">{value.toLocaleString()}</p>
      </div>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px] shrink-0" style={{ background: iconBg, color: iconColor }}>
        {icon}
      </div>
    </div>
  );
}
