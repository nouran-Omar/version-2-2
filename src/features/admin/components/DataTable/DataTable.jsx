import React from 'react';
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

export default function DataTable({
  data,
  selectedItems,
  onToggle,
  onEdit,
  onDeleteIndividual,
  onBulkDelete,
  onClearSelection
}) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem  = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems     = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages       = Math.ceil(data.length / itemsPerPage);

  const allSelected = currentItems.length > 0 && currentItems.every(i => selectedItems.includes(i.id));

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      currentItems.forEach(item => { if (!selectedItems.includes(item.id)) onToggle(item.id); });
    } else {
      onClearSelection();
    }
  };

  return (
    /* الـ relative هنا ضروري عشان الـ Absolute بار يتسنتر عليه */
    <div className="relative flex flex-col gap-4">

      {/* Floating Bulk Bar - Absolute Position */}
      {selectedItems.length > 0 && (
        <div className="absolute top-15 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-3 py-2 bg-white border border-gray-100 rounded-xl shadow-[0px_10px_30px_rgba(0,0,0,0.15)] animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Badge: Number Selected */}
          <div className="px-3 py-2 bg-[#333CF5] text-white text-[12px] font-bold rounded-lg whitespace-nowrap">
            {selectedItems.length} Users Selected
          </div>
          
          {/* Action: Delete */}
          <button 
            onClick={onBulkDelete} 
            className="px-4 py-2 text-[12px] font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all active:scale-95 shadow-sm shadow-red-200"
          >
            Delete Selected
          </button>
          
          {/* Action: Cancel */}
          <button 
            onClick={onClearSelection} 
            className="px-4 py-2 text-[12px] font-bold text-neutral-500 bg-zinc-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-all active:scale-95"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-gray-200/70 bg-white">
        <table className="w-full min-w-[560px] border-collapse">
          <thead>
            <tr className="bg-[#333CF5] text-white text-left">
              <th className="w-10 px-4 py-4">
                <input 
                  type="checkbox" 
                  checked={allSelected} 
                  onChange={handleSelectAll} 
                  className="w-4 h-4 rounded accent-white cursor-pointer border-2 border-white/30" 
                />
              </th>
              <th className="px-4 py-4 text-[13px] font-semibold whitespace-nowrap">Full Name</th>
              <th className="px-4 py-4 text-[13px] font-semibold whitespace-nowrap">Email</th>
              <th className="px-4 py-4 text-[13px] font-semibold whitespace-nowrap">Price</th>
              <th className="px-4 py-4 text-[13px] font-semibold whitespace-nowrap">Joined Date</th>
              <th className="px-4 py-4 text-[13px] font-semibold text-center whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, idx) => {
              const isSelected = selectedItems.includes(item.id);
              return (
                <tr 
                  key={item.id} 
                  className={`border-b border-gray-100 transition-colors ${
                    isSelected ? 'bg-[#EFF6FF]' : idx % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'
                  } hover:bg-[#EFF6FF]/60`}
                >
                  <td className="px-4 py-3">
                    <input 
                      type="checkbox" 
                      checked={isSelected} 
                      onChange={() => onToggle(item.id)} 
                      className="w-4 h-4 rounded accent-[#155dfc] cursor-pointer" 
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.fullName)}`} 
                        alt={item.fullName} 
                        className="w-9 h-9 rounded-full object-cover shrink-0 border border-gray-100" 
                      />
                      <span className="text-[14px] font-semibold text-black-main-text truncate max-w-[150px]">
                        {item.fullName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] text-gray-text-dim2 truncate block max-w-[200px]">
                      {item.email}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-bold text-black-main-text">
                      ${item.price}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] text-gray-text-dim2 whitespace-nowrap">
                      {item.joinedDate}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => onEdit(item)} 
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-black-main-text hover:bg-[#EEF2FF] transition-all" 
                        title="Edit"
                      >
                        <FiEdit3 size={15} />
                      </button>
                      <button 
                        onClick={() => onDeleteIndividual(item)} 
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-[#DC3545] hover:bg-red-50 transition-all" 
                        title="Delete"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-2">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <FaAngleLeft size={14} />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentPage(i + 1)} 
              className={`w-8 h-8 flex items-center justify-center rounded-full text-[13px] font-bold transition-all ${
                currentPage === i + 1 ? 'bg-[#333CF5] text-white shadow-md shadow-blue-200' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <FaAngleRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}