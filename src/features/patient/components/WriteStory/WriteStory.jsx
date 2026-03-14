import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineCloudUpload, HiX, HiOutlinePencilAlt } from 'react-icons/hi';
import Toast from '../../../../components/Toast/Toast';

const CATEGORIES = ['Lifestyle', 'Health', 'Challenges', 'Recovery'];

const chipStyle = (cat, selected) => {
  // في حالة كان الـ Chip مختار (Selected)
  if (selected) {
    switch (cat) {
      case 'Lifestyle':
        return 'bg-[#FFA940] text-white border-[#FFA940] shadow-sm';
      case 'Health':
        return 'bg-[#155DFC] text-white border-[#155DFC] shadow-sm';
      case 'Challenges':
        return 'bg-[#7939FF] text-white border-[#7939FF] shadow-sm';
      case 'Recovery':
        return 'bg-[#00AC4F] text-white border-[#00AC4F] shadow-sm';
      default:
        return 'bg-brand-main text-white border-brand-main shadow-sm';
    }
  }

  // في حالة عدم الاختيار (Default State)
  return 'bg-white text-black-main-text border-[#E5E7EB] hover:border-brand-main hover:text-brand-main transition-all duration-200';
};

const WriteStory = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const editorRef   = useRef(null);

  const [title, setTitle] = useState('');
  const [selectedCats, setSelectedCats] = useState([]);
  const [story, setStory] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ visible: false, title: '', message: '' });

  /* ── hashtag highlight helpers ── */

  // Convert plain text → HTML with <span> for #tags
  const toHTML = (text) =>
    text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/(#[\w\u0600-\u06FF]+)/g,
        '<span style="color:#333CF5;font-weight:600">$1</span>');

  // Save + restore caret position inside contentEditable
  const saveCaret = (el) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return 0;
    const range = sel.getRangeAt(0);
    const pre   = range.cloneRange();
    pre.selectNodeContents(el);
    pre.setEnd(range.endContainer, range.endOffset);
    return pre.toString().length;
  };

  const restoreCaret = (el, offset) => {
    const walk = (node, remaining) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (remaining[0] <= node.length) {
          const range = document.createRange();
          const sel   = window.getSelection();
          range.setStart(node, remaining[0]);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
          return true;
        }
        remaining[0] -= node.length;
        return false;
      }
      for (const child of node.childNodes) {
        if (walk(child, remaining)) return true;
      }
      return false;
    };
    walk(el, [offset]);
  };

  const handleEditorInput = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const plainText = el.innerText;
    setStory(plainText);
    setErrors((er) => ({ ...er, story: '' }));

    const caret = saveCaret(el);
    el.innerHTML = toHTML(plainText);
    restoreCaret(el, caret);
  }, []);

  const toggleCat = (cat) =>
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = 'Story title is required.';
    if (!story.trim()) e.story = 'Story content cannot be empty.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePublish = () => {
    if (!validate()) return;
    setToast({
      visible: true,
      title: 'Story Published Successfully',
      message: 'Your story is now live and visible to others.',
    });
    setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
      navigate('/patient/stories');
    }, 3000);
  };

  return (
<>
      <Toast
        visible={toast.visible}
        title={toast.title}
        message={toast.message}
        duration={3000}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />

      <div className="w-full  bg-white p-5 flex rounded-full flex-col gap-7">

        {/* ── Header ── */}
        <div>
          <div className="flex items-center gap-2 ">
            <HiOutlinePencilAlt className="text-black-main-text text-xl" />
            <h1 className="text-[24px] font-bold text-black-main-text">Write Story</h1>
          </div>
          <p className="text-[18px] text-[#757575]">Share your personal health journey to inspire others.</p>
        </div>

        {/* ── Divider ── */}
        {/* <hr className="border-gray-100" /> */}

        {/* ── Story Title ── */}
        <div className="flex flex-col gap-2">
          <label className="text-lg font-semibold text-black-main-text">
            Story Title <span className="text-[#E7000B]">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setErrors((er) => ({ ...er, title: '' })); }}
            placeholder="Give your story a compelling title..."
            className={`w-full px-4 py-3 rounded-xl border  text-lg outline-none transition
              ${errors.title ? 'border-[#E7000B]' : 'border-[#E5E7EB]  focus:border-brand-main'}`}
          />
          {errors.title && <p className="text-xs text-[#E7000B]">{errors.title}</p>}
        </div>

        {/* ── Story Categories ── */}
        <div className="flex flex-col gap-3">
          <label className="text-lg font-semibold text-black-main-text">Story Categories</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const sel = selectedCats.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCat(cat)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition
                    ${chipStyle(cat, sel)}`}
                >
                  {cat}
                  {sel && <span className="text-xs">✓</span>}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-400">Select one or more categories that best describe your story</p>
        </div>

        {/* ── Divider ── */}
        <hr className="border-gray-100" />

        {/* ── Cover Image ── */}
        <div className="flex flex-col gap-2">
          <label className="text-lg font-semibold text-black-main-text">
            Cover Image <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <div
            onClick={() => fileInputRef.current.click()}
            className="relative h-[200px] rounded-xl border border-gray-200 bg-[#F9FAFB] cursor-pointer flex flex-col items-center justify-center overflow-hidden transition hover:border-brand-main"
          >
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Cover preview" className="w-full h-full object-cover" />
                <button
                  onClick={removeImage}
                  className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow transition"
                >
                  <HiX className="text-sm" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                  <HiOutlineCloudUpload className="text-xl text-gray-500" />
                </div>
                <p className="text-lg font-semibold text-black-main-text">Drag and drop your image here</p>
                <p className="text-xs text-gray-400">or click to browse files</p>
                <p className="text-xs text-gray-300 mt-1">Supported formats: JPG, PNG, GIF (Max 5MB)</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} hidden onChange={handleImageChange} accept="image/*" />
          </div>
        </div>

        {/* ── Divider ── */}
        <hr className="border-gray-100" />

        {/* ── Your Story ── */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-black-main-text">Your Story</label>
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleEditorInput}
            data-placeholder="Share your health journey in detail. What challenges did you face? How did you overcome them? What was your experience like?"
            className={`w-full min-h-[220px] px-4 py-3.5 rounded-xl border text-sm outline-none leading-relaxed transition bg-[#F6F7F8] whitespace-pre-wrap wrap-break-word
              empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none
              ${errors.story ? 'border-red-400' : 'border-[#E5E7EB] focus:border-brand-main'}`}
          />
          {errors.story && <p className="text-xs text-red-500">{errors.story}</p>}
          <p className="text-xs text-[#6A7282]">{story.length} characters</p>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => navigate('/patient/stories')}
            className="px-7 py-2.5 rounded-full  cursor-pointer border border-gray-300 text-sm font-semibold text-black-main-text bg-white hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            className="px-7 py-2.5 rounded-full cursor-pointer bg-brand-main text-white text-sm font-semibold hover:bg-[#2730d4] transition shadow-sm"
          >
            Publish Story
          </button>
        </div>

  
    </div></>
  );
};

export default WriteStory;