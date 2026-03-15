import React, { useState, useEffect } from 'react';
import {
  HiPlus, HiPencil, HiArrowRightOnRectangle,
  HiArrowLeftOnRectangle, HiTrash, HiMagnifyingGlass,
  HiChevronLeft, HiChevronRight, HiClipboardDocumentList
} from "react-icons/hi2";

const ICON_STYLES = {
  plus:   { bg: 'bg-[#EFF6FF]',  text: 'text-[#155dfc]' },
  pencil: { bg: 'bg-[#FFFBEB]',  text: 'text-[#D97706]' },
  login:  { bg: 'bg-[#F0FDF4]',  text: 'text-[#059669]' },
  logout: { bg: 'bg-[#FDF4FF]',  text: 'text-[#9333EA]' },
  trash:  { bg: 'bg-[#FEF2F2]',  text: 'text-[#EF4444]' },
};

export default function ActivityLogs() {
  const [logs, setLogs]           = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter]       = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      const mockData = Array.from({ length: 35 }, (_, i) => ({
        id: i + 1,
        type: ['Created', 'Updated', 'Deleted', 'Login', 'Logout'][i % 5],
        title: ['Added new patient', 'Doctor profile updated', 'User login', 'Appointment rescheduled', 'New prescription created', 'Appointment cancelled'][i % 6],
        description: `This is a detailed description for system activity #${i + 1} regarding patient records and updates.`,
        time: i === 0 ? '2 minutes ago' : `${i + 1} hours ago`,
        iconType: ['plus', 'pencil', 'login', 'pencil', 'plus', 'trash'][i % 6],
      }));
      setLogs(mockData);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const filteredData = logs.filter(log => {
    const matchesFilter = filter === 'All' || log.type === filter;
    const matchesSearch =
      log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages  = Math.ceil(filteredData.length / itemsPerPage);
  const currentLogs = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getIcon = (type) => {
    const icons = {
      plus:   <HiPlus className="text-base" />,
      pencil: <HiPencil className="text-base" />,
      login:  <HiArrowRightOnRectangle className="text-base" />,
      logout: <HiArrowLeftOnRectangle className="text-base" />,
      trash:  <HiTrash className="text-base" />,
    };
    return icons[type] ?? <HiPlus className="text-base" />;
  };

  const FILTERS = ['All', 'Created', 'Updated', 'Deleted', 'Login', 'Logout'];

  return (
    <section className="p-6 flex flex-col gap-6" aria-label="Activity Logs">

      {/* ── Header ── */}
      <div className="flex flex-col gap-1 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <HiClipboardDocumentList className="text-[22px] text-black-main-text " aria-hidden="true" />
          <h1 className="text-[24px] sm:text-[20px] font-bold text-black-main-text leading-none">
            Activity Logs
          </h1>
        </div>
        <p className="text-[16px] text-gray-text-dim2 ">Track recent changes, updates, and system activity.</p>
      </div>

      {/* ── Controls ── */}
      <div className="flex flex-col rounded-full p-6 border border-[#F3F4F6]  sm:flex-row gap-3">
        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 ">
          {FILTERS.map(btn => (
            <button
              key={btn}
              onClick={() => { setFilter(btn); setCurrentPage(1); }}
              className={`px-6 py-1 cursor-pointer text-[14px] font-normal rounded-full transition-colors ${
                filter === btn
                  ? 'bg-[#333CF5] text-white'
                  : 'bg-[#F6F7F8] text-gray-text-dim2 '
              }`}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative sm:ml-auto">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[15px]" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search logs…"
            aria-label="Search activity logs"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-9 pr-4 py-2.5 text-[13px] bg-[#00000000] border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#155dfc]/30 focus:border-[#155dfc] transition-colors w-full sm:w-[220px]"
          />
        </div>
      </div>

      {/* ── Log List ── */}
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-2 border-[#333CF5] border-t-transparent rounded-full animate-spin" />
            <p className="text-[13px] text-gray-400">Loading activities…</p>
          </div>
        ) : currentLogs.length > 0 ? (
          <ul className="list-none p-0 m-0 flex flex-col gap-2">
            {currentLogs.map(log => {
              const style = ICON_STYLES[log.iconType] ?? ICON_STYLES.plus;
              return (
                <li key={log.id} className="flex items-start gap-4 p-4  rounded-xl p-6 border border-[#F3F4F6] hover: transition-colors">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${style.bg} ${style.text}`}>
                    {getIcon(log.iconType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-[18px] font-semibold text-black-main-text leading-snug">{log.title}</h4>
                      <span className="text-[14px] text-gray-text-dim2 shrink-0 whitespace-nowrap">{log.time}</span>
                    </div>
                    <p className="text-[16px] text-[#4B5563] mt-0.5 line-clamp-2">{log.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex items-center justify-center py-16 text-[13px] text-gray-400">
            No logs found matching your criteria.
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-1 m-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <HiChevronLeft size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`cursor-pointer w-10 h-10 flex items-center justify-center rounded-full text-[14px] font-semibold transition-colors ${
                p === currentPage ? 'bg-[#333CF5] text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <HiChevronRight size={14} />
          </button>
        </div>
      )}
    </section>
  );
}
