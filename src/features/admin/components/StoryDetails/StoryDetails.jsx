import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  HiArrowLeft,
  HiOutlineHeart,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineShare,
  HiOutlineEyeSlash,
  HiOutlineEye,
  HiOutlineTrash,
} from 'react-icons/hi2';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import Toast from '../../../../components/Toast/Toast';
import { MOCK_STORIES, MOCK_COMMENTS } from '../StoriesManagement/storiesMockData';

export default function StoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [stories, setStories] = useState(MOCK_STORIES);
  const story = stories.find(s => String(s.id) === String(id));

  const [comments, setComments] = useState(MOCK_COMMENTS[id] || []);
  const [deleteModal, setDeleteModal] = useState(false);
  const [hideModal, setHideModal]     = useState(false);
  const [toast, setToast] = useState({ visible: false, title: '', message: '' });

  const showToast = (title, message) => {
    setToast({ visible: true, title, message });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  };

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <h2 className="text-[18px] font-semibold text-black-main-text">Story not found.</h2>
        <button onClick={() => navigate('/admin/stories-management')} className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-[#155dfc] bg-[#EFF6FF] rounded-[10px] hover:bg-[#dbeafe] transition-colors">
          <HiArrowLeft /> Back to Stories
        </button>
      </div>
    );
  }

  const handleDeleteConfirm = () => {
    setStories(prev => prev.map(s => s.id === story.id ? { ...s, status: 'Deleted' } : s));
    setDeleteModal(false);
    showToast('Story Deleted Successfully', 'Your changes have been saved successfully.');
    setTimeout(() => navigate('/admin/stories-management'), 1500);
  };

  const handleHideConfirm = () => {
    const newStatus = story.status === 'Hidden' ? 'Published' : 'Hidden';
    setStories(prev => prev.map(s => s.id === story.id ? { ...s, status: newStatus } : s));
    setHideModal(false);
    showToast(
      newStatus === 'Hidden' ? 'Story Hidden Successfully' : 'Story Unhidden Successfully',
      'Your changes have been saved successfully.'
    );
  };

  const previewComments = comments.slice(0, 2);
  const totalComments   = comments.length;

  const statusClass = story.status === 'Published'
    ? 'bg-[#DCFCE7] text-[#059669]'
    : story.status === 'Hidden'
    ? 'bg-[#FEF9C3] text-[#CA8A04]'
    : 'bg-red-100 text-red-600';

  return (
    <section className="flex flex-col gap-6 p-5 " aria-label="Story Details">

      {/* Toast */}
      <Toast visible={toast.visible} title={toast.title} message={toast.message} type="success" onClose={() => setToast(t => ({ ...t, visible: false }))} />

      {/* Delete Modal */}
      <ConfirmModal isOpen={deleteModal} title="Delete Story?" desc="Are you sure you want to delete this story? This action is permanent and cannot be undone." onConfirm={handleDeleteConfirm} onCancel={() => setDeleteModal(false)} />

      {/* Hide/Unhide Modal */}
      <ConfirmModal isOpen={hideModal} title={story.status === 'Hidden' ? 'Unhide Story?' : 'Hide Story?'} desc={story.status === 'Hidden' ? 'This story will become visible to the public again.' : 'This story will be hidden from public view.'} onConfirm={handleHideConfirm} onCancel={() => setHideModal(false)} />

      {/* Page Header */}
      <div className="flex flex-col gap-0.5">
        <h1 className="text-[20px] font-bold text-black-main-text flex items-center gap-2">
          <span>📖</span> Patient Story Details
        </h1>
        <p className="text-[13px] text-[#757575]">Read full patient journey and shared experiences.</p>
      </div>

      {/* Author Card */}
      <div className="flex items-start gap-4 p-5 shadow-[0px_2px_3px_0px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1px] outline-gray-100 rounded-[16px]">
        <img src={story.avatar} alt={story.author} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-bold text-black-main-text">{story.author}</h3>
          <p className="text-[12px] text-gray-text-dim2 mt-0.5">Shared publicly to inspire other patients</p>
          <p className="text-[12px] text-gray-600 mt-0.5">{story.date}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {(story.tags?.length ? story.tags : ['Success Story', 'Lifestyle', 'Health']).map((tag, i) => (
              <span key={tag} className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${i === 0 ? 'bg-[#DCFCE7] text-[#059669]' : i === 1 ? 'bg-[#EFF6FF] text-[#155dfc]' : 'bg-red-100 text-red-600'}`}>{tag}</span>
            ))}
          </div>
        </div>
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${statusClass}`}>{story.status}</span>
      </div>

      {/* Story Content */}
      <div className="bg-white border border-gray-100 rounded-[16px] p-5 sm:p-6 flex flex-col gap-4">
        <h2 className="text-[18px] font-bold text-black-main-text leading-snug">{story.title}</h2>
        <div className="flex flex-col gap-3">
          {(story.content || story.desc).split('\n\n').map((paragraph, i) =>
            paragraph.trim() ? <p key={i} className="text-[14px] text-gray-600 leading-relaxed">{paragraph.trim()}</p> : null
          )}
        </div>
        {story.coverFull && (
          <img src={story.coverFull} alt={story.title} className="w-full rounded-xl object-cover max-h-[360px] mt-2" />
        )}
      </div>

      {/* Engagement Bar */}
      <div className="flex items-center gap-6 px-5 py-3.5  rounded-[14px]">
        <div className="flex items-center gap-2 text-[13px] font-semibold bg-red-50 text-gray-600 rounded-2xl p-1.5">
          <HiOutlineHeart className="text-[18px] text-red-700 rounded-full " />
          <span>{story.likes || 132}</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] font-semibold text-blue-600 bg-blue-50 rounded-2xl p-1.5">
          <HiOutlineChatBubbleOvalLeft className="text-[18px]" />
          <span>{totalComments}</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-600">
          <HiOutlineShare className="text-[18px]" />
          <span>{story.shares || 24}</span>
        </div>
      </div>

      {/* Comments Preview */}
      <div className="bg-white border border-gray-100 rounded-[16px] p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-black-main-text">Comments ({totalComments})</h3>
          <button onClick={() => navigate(`/admin/stories/${id}/comments`)} className="text-[12px] font-semibold text-[#155dfc] hover:underline">View All →</button>
        </div>
        <ul className="flex flex-col gap-3 list-none p-0 m-0">
          {previewComments.length === 0 ? (
            <li className="text-[13px] text-gray-400">No comments yet.</li>
          ) : (
            previewComments.map(comment => (
              <li key={comment.id} className="flex items-start gap-3 py-3  bg-gray-50 rounded-2xl outline outline-[0.80px] outline-offset-[-0.80px] outline-gray-200 p-5 last:border-0">
                {comment.avatar ? (
                  <img src={comment.avatar} alt={comment.author} className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-100" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-brand-main to-[#9810fa] flex items-center justify-center text-white font-bold text-[13px] shrink-0">
                    {comment.author[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-[13px] font-semibold text-black-main-text">{comment.author}</span>
                    <span className="text-[11px] text-gray-500">{comment.time}</span>
                  </div>
                  <p className="text-[13px] text-gray-700 leading-relaxed">{comment.text}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Action Buttons Footer */}
      <div className="flex items-center justify-between gap-3 bg-white rounded-3xl shadow-[0px_2px_3px_0px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1px] p-5 outline-gray-100 flex-wrap pt-2">
        <button onClick={() => navigate('/admin/stories-management')} className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-black-main-text  ">
          <HiArrowLeft /> Back to Stories
        </button>
        <div className="flex items-center gap-3">
          <button onClick={() => setHideModal(true)} disabled={story.status === 'Deleted'} className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-black-main-text bg-gray-200 rounded-full hover:bg-yellow-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            {story.status === 'Hidden' ? <><HiOutlineEye /> Unhide Story</> : <><HiOutlineEyeSlash /> Hide Story</>}
          </button>
          <button onClick={() => setDeleteModal(true)} disabled={story.status === 'Deleted'} className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white bg-red-700 rounded-full hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            <HiOutlineTrash /> Delete Story
          </button>
        </div>
      </div>
    </section>
  );
}
