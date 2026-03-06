import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  HiArrowLeft,
  HiOutlineTrash,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineHandThumbUp,
  HiOutlineArrowUturnLeft,
  HiOutlineExclamationTriangle,
} from 'react-icons/hi2';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import Toast from '../../../../components/Toast/Toast';
import { MOCK_STORIES, MOCK_COMMENTS } from '../StoriesManagement/storiesMockData';

export default function StoryAllComments() {
  const { id } = useParams();
  const navigate = useNavigate();

  const story = MOCK_STORIES.find(s => String(s.id) === String(id));
  const seedComments = MOCK_COMMENTS[id] || MOCK_COMMENTS[1] || [];
  const [comments, setComments] = useState(seedComments);
  const [deleteModal, setDeleteModal] = useState({ open: false, commentId: null });
  const [toast, setToast] = useState({ visible: false, title: '', message: '' });

  const showToast = (title, message) => {
    setToast({ visible: true, title, message });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  };

  const handleDeleteClick  = (commentId) => setDeleteModal({ open: true, commentId });
  const handleDeleteConfirm = () => {
    setComments(prev => prev.filter(c => c.id !== deleteModal.commentId));
    setDeleteModal({ open: false, commentId: null });
    showToast('Comment Deleted', 'The comment has been removed successfully.');
  };

  if (!story) {
    return (
      <div className="flex flex-col items-center p-5  justify-center gap-4 py-20">
        <h2 className="text-[18px] font-semibold text-black-main-text">Story not found.</h2>
        <button onClick={() => navigate('/admin/stories-management')} className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-[#155dfc] bg-[#EFF6FF] rounded-[10px] hover:bg-[#dbeafe] transition-colors">
          <HiArrowLeft /> Back to Stories
        </button>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-6 p-5" aria-label="All Comments">

      {/* Toast */}
      <Toast visible={toast.visible} title={toast.title} message={toast.message} type="success" onClose={() => setToast(t => ({ ...t, visible: false }))} />

      {/* Delete Confirm Modal */}
      <ConfirmModal isOpen={deleteModal.open} title="Delete Comment?" desc="Are you sure you want to delete this comment? This action cannot be undone." onConfirm={handleDeleteConfirm} onCancel={() => setDeleteModal({ open: false, commentId: null })} />

      {/* Back button */}
      <button onClick={() => navigate(`/admin/stories/${id}`)} className="self-start flex items-center gap-2 px-4 text-[13px] font-semibold text-[#4A5565] hover:transition-colors">
        <HiArrowLeft /> Back to Story
      </button>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5 text-black-main-text">
          <HiOutlineChatBubbleOvalLeft className="text-[22px] " />
          <h1 className="text-[20px] font-bold text-black-main-text">All Comments</h1>
        </div>
        <p className="text-[13px] text-gray-text-dim2 ">
          {comments.length} comments on &ldquo;{story.title}&rdquo;
        </p>
      </div>

      {/* Comments List */}
      <ul className="flex flex-col gap-3 list-none p-0 m-0">
        {comments.length === 0 ? (
          <li className="text-center py-12 text-[14px] text-gray-400">No comments yet.</li>
        ) : (
          comments.map(comment => (
            <li key={comment.id} className={`rounded-[14px] border  p-4   rounded-2xl overflow-hidden transition-all ${comment.flagged ? 'border-[#FFA2A2] bg-white' : 'border-[#E5E7EB] bg-white'}`}>

              {/* Flagged Banner */}
              {comment.flagged && (
                <div className="flex items-center gap-2 px-4 py-2 bg-[#FFE2E2] text-[#C10007] text-[12px] font-semibold border rounded-2xl border-[#FFA2A2]">
                  <HiOutlineExclamationTriangle className="text-[15px] shrink-0" />
                  Flagged for Review – Potentially Inappropriate Content
                </div>
              )}

              {/* Comment Body */}
              <div className="flex items-start gap-3 p-4">
                {/* Avatar */}
                {comment.avatar ? (
                  <img src={comment.avatar} alt={comment.author} className="w-9 h-9 rounded-full object-cover shrink-0 border border-gray-100" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-linear-to-br from-brand-main to-[#9810fa] flex items-center justify-center text-white font-bold text-[14px] shrink-0">
                    {comment.author[0]}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col gap-1.5 p-2 border-none rounded-2xl">
                  {/* Top row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-semibold text-black-main-text">{comment.author}</span>
                      {comment.role && (
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${comment.role === 'Doctor' ? 'bg-[#DBEAFE] text-brand-main' : 'bg-[#F3F4F6] text-[#364153]'}`}>
                          {comment.role}
                        </span>
                      )}
                    </div>
                    <button onClick={() => handleDeleteClick(comment.id)} title="Delete comment" className="w-7 h-7 flex items-center justify-center rounded-[7px]  text-[#E7000B] hover:bg-red-100 transition-colors shrink-0">
                      <HiOutlineTrash className="text-[14px]" />
                    </button>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-1 text-[11px] text-[#6A7282]">
                    <span>📅</span>
                    {comment.time}
                  </div>

                  {/* Comment text */}
                  <p className="text-[13px] text-[#364153] leading-relaxed">{comment.text}</p>

                  {/* Likes + Replies */}
                  <div className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1.5 text-[12px] text-[#4A5565]">
                      <HiOutlineHandThumbUp className="text-[14px]" />
                      {comment.likes}
                    </span>
                    <span className="flex items-center gap-1.5 text-[12px] text-[#4A5565]">
                      <HiOutlineArrowUturnLeft className="text-[14px]" />
                      {comment.replies} {comment.replies === 1 ? 'reply' : 'replies'}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
