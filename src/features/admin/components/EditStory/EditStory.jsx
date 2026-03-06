import React, { useState } from 'react';
import { HiOutlineXMark, HiOutlinePhoto } from 'react-icons/hi2';

const TAG_OPTIONS    = ['Recovery', 'Mental Health', 'Lifestyle', 'Cancer', 'Heart', 'Health'];
const STATUS_OPTIONS = ['Published', 'Hidden'];

const inputBase    = "w-full px-3 py-2 text-[13px] rounded-[10px] border border-gray-200 bg-white text-black-main-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc]/30 focus:border-[#155dfc] transition-colors";
const textareaBase = "w-full px-3 py-2 text-[13px] rounded-[10px] border border-gray-200 bg-white text-black-main-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc]/30 focus:border-[#155dfc] transition-colors resize-none";
const selectBase   = "w-full px-3 py-2 text-[13px] rounded-[10px] border border-gray-200 bg-white text-black-main-text focus:outline-none focus:ring-2 focus:ring-[#155dfc]/30 focus:border-[#155dfc] transition-colors";

export default function EditStory({ story, onSave, onClose }) {
  const [form, setForm] = useState({
    title:  story.title  || '',
    desc:   story.desc   || '',
    status: story.status === 'Deleted' ? 'Published' : (story.status || 'Published'),
    tags:   story.tags   || [],
  });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const toggleTag = (tag) => {
    setForm(prev => {
      const exists = prev.tags.includes(tag);
      return { ...prev, tags: exists ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag] };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({ ...story, ...form });
  };

  return (
    <div className="fixed inset-0 p-5  bg-black/50 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-full max-w-[520px] max-h-[90vh] overflow-y-auto flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-[16px] font-bold text-black-main-text">Edit Story</h2>
            <p className="text-[12px] text-gray-500 mt-0.5">Update story information and settings</p>
          </div>
          <button onClick={onClose} type="button" className="w-8 h-8 flex items-center justify-center rounded-[8px] text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            <HiOutlineXMark className="text-[18px]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">

          {/* Cover Preview */}
          <div className="relative w-full h-[140px] rounded-xl overflow-hidden bg-gray-100">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${story.coverFull || story.cover})` }} />
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-1 text-white">
              <HiOutlinePhoto className="text-[24px]" />
              <span className="text-[12px] font-semibold">Story Cover</span>
            </div>
          </div>

          {/* Author row */}
          <div className="flex items-center gap-3 p-3 bg-[#F6F7F8] rounded-xl">
            <img src={story.avatar} alt={story.author} className="w-9 h-9 rounded-full object-cover border border-gray-100 shrink-0" />
            <div>
              <p className="text-[13px] font-semibold text-black-main-text">{story.author}</p>
              <p className="text-[11px] text-gray-500">Author · {story.date}</p>
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#364153]">Story Title <span className="text-red-500">*</span></label>
            <input type="text" name="title" value={form.title} onChange={handleChange} className={inputBase} placeholder="Enter story title…" required />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#364153]">Short Description</label>
            <textarea name="desc" value={form.desc} onChange={handleChange} className={textareaBase} placeholder="Brief description shown in the story list…" rows={3} />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#364153]">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className={selectBase}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#364153]">Tags</label>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map(tag => (
                <button key={tag} type="button" onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 text-[12px] font-semibold rounded-full border transition-colors ${form.tags.includes(tag) ? 'bg-[#155dfc] text-white border-[#155dfc]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#155dfc] hover:text-[#155dfc]'}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 mt-1">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[13px] font-semibold text-gray-600 bg-[#F6F7F8] rounded-[10px] hover:bg-gray-200 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-[13px] font-semibold text-white bg-[#155dfc] rounded-[10px] hover:bg-[#0913C3] transition-colors">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
