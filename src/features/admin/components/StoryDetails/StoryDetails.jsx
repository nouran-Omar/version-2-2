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
        <button onClick={() => navigate('/admin/stories-management')} className="cursor-pointer flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-[#155dfc] bg-[#EFF6FF] rounded-[10px] hover:bg-[#dbeafe] transition-colors">
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
    <section className="flex flex-col gap-6 p-6 " aria-label="Story Details">

      {/* Toast */}
      <Toast visible={toast.visible} title={toast.title} message={toast.message} type="success" onClose={() => setToast(t => ({ ...t, visible: false }))} />

      {/* Delete Modal */}
      <ConfirmModal isOpen={deleteModal} title="Delete Story?" desc="Are you sure you want to delete this story? This action is permanent and cannot be undone." onConfirm={handleDeleteConfirm} onCancel={() => setDeleteModal(false)} />

      {/* Hide/Unhide Modal */}
      <ConfirmModal isOpen={hideModal} title={story.status === 'Hidden' ? 'Unhide Story?' : 'Hide Story?'} desc={story.status === 'Hidden' ? 'This story will become visible to the public again.' : 'This story will be hidden from public view.'} onConfirm={handleHideConfirm} onCancel={() => setHideModal(false)} />

      {/* Page Header */}
      <div className="flex flex-col gap-0.5">
        <h1 className="text-[24px] font-bold text-black-main-text flex items-center gap-2">
          <span><svg xmlns="http://www.w3.org/2000/svg" width="27" height="22" viewBox="0 0 27 22" fill="none">
  <path d="M26 1.78694C26.1796 1.89062 26.3325 2.03475 26.4466 2.20788C26.5607 2.38101 26.6329 2.57837 26.6573 2.78428L26.6667 2.94161V20.2749C26.6667 20.509 26.605 20.7389 26.488 20.9416C26.371 21.1443 26.2027 21.3126 26 21.4296C25.7973 21.5466 25.5674 21.6082 25.3333 21.6082C25.0993 21.6082 24.8694 21.5466 24.6667 21.4296C23.1559 20.5573 21.4543 20.0688 19.7108 20.0069C17.9674 19.9451 16.2354 20.3118 14.6667 21.0749V0.842943C16.5085 0.154954 18.4797 -0.117187 20.439 0.0460152C22.3984 0.209217 24.2974 0.803721 26 1.78694ZM12 0.844276L12.0013 21.0763C10.4944 20.3427 8.83581 19.9745 7.16002 20.0016C5.48424 20.0287 3.83842 20.4503 2.356 21.2323L1.92 21.4723L1.78267 21.5309L1.71733 21.5523L1.57067 21.5869L1.48933 21.6003L1.33333 21.6083H1.27733L1.13067 21.5923L1.028 21.5736L0.884 21.5309L0.716 21.4563L0.589333 21.3816L0.470667 21.2923L0.390667 21.2176L0.293333 21.1083L0.208 20.9896L0.178667 20.9416L0.136 20.8616L0.0773335 20.7243L0.0560001 20.6589L0.0213334 20.5123L0.00800006 20.4309L0.00266679 20.3656L0 2.94161C5.94563e-06 2.70757 0.0616172 2.47765 0.178641 2.27496C0.295665 2.07228 0.463979 1.90396 0.666667 1.78694C2.3694 0.803939 4.26845 0.209667 6.22779 0.0466955C8.18713 -0.116276 10.1583 0.156088 12 0.844276Z" fill="#010218"/>
</svg></span> Patient Story Details
        </h1>
        <p className="text-[18px] text-[#757575]">Read full patient journey and shared experiences.</p>
      </div>

      {/* Author Card */}
      <div className="flex items-start gap-4 p-5 shadow-[0px_2px_3px_0px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1px] outline-gray-100 rounded-[16px]">
        <img src={story.avatar} alt={story.author} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="text-[20px] font-bold text-black-main-text">{story.author}</h3>
          <p className="text-[14px] text-gray-text-dim2 mt-0.5">Shared publicly to inspire other patients</p>
          <p className="text-[14px] text-gray-600 mt-0.5">{story.date}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {(story.tags?.length ? story.tags : ['Success Story', 'Lifestyle', 'Health']).map((tag, i) => (
              <span key={tag} className={`text-[12px] font-semibold px-2.5 py-0.5 rounded-full ${i === 0 ? 'bg-[#DCFCE7] text-[#059669]' : i === 1 ? 'bg-[#EFF6FF] text-[#155dfc]' : 'bg-red-100 text-red-600'}`}>{tag}</span>
            ))}
          </div>
        </div>
        <span className={`text-[12px] font-bold px-2.5 py-1 rounded-full shrink-0 ${statusClass}`}>{story.status}</span>
      </div>

      {/* Story Content */}
      <div className="bg-white border border-gray-100 rounded-[16px] p-5 sm:p-6 flex flex-col gap-4">
        <h2 className="text-[30px] font-bold text-black-main-text leading-snug">{story.title}</h2>
        <div className="flex flex-col gap-3">
          {(story.content || story.desc).split('\n\n').map((paragraph, i) =>
            paragraph.trim() ? <p key={i} className="text-[16px] text-gray-600 leading-relaxed">{paragraph.trim()}</p> : null
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
          <h3 className="text-[18px] font-bold text-black-main-text">Comments ({totalComments})</h3>
          <button onClick={() => navigate(`/admin/stories/${id}/comments`)} className="cursor-pointer text-[12px] font-semibold text-[#155dfc] hover:underline">View All →</button>
        </div>
        <ul className="flex flex-col gap-3 list-none p-0 m-0">
          {previewComments.length === 0 ? (
            <li className="text-[16px] text-gray-400">No comments yet.</li>
          ) : (
            previewComments.map(comment => (
              <li key={comment.id} className="flex items-start gap-3 py-3  bg-gray-50 rounded-2xl outline outline-[0.80px] outline-offset-[-0.80px] outline-gray-200 p-5 last:border-0">
                {comment.avatar ? (
                  <img src={comment.avatar} alt={comment.author} className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-100" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-brand-main to-[#9810fa] flex items-center justify-center text-white font-bold text-[16px] shrink-0">
                    {comment.author[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-[16px] font-semibold text-black-main-text">{comment.author}</span>
                    <span className="text-[12px] text-gray-500">{comment.time}</span>
                  </div>
                  <p className="text-[14px] text-gray-700 leading-relaxed">{comment.text}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Action Buttons Footer */}
      <div className="flex items-center justify-between gap-3 bg-white rounded-3xl shadow-[0px_2px_3px_0px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1px] p-5 outline-gray-100 flex-wrap pt-2">
        <button onClick={() => navigate('/admin/stories-management')} className="flex items-center gap-2 px-4 py-2 text-[14px] font-semibold cursor-pointer text-black-main-text  ">
          <HiArrowLeft /> Back to Stories
        </button>
        <div className="flex items-center gap-3">
          <button onClick={() => setHideModal(true)} disabled={story.status === 'Deleted'} className="flex items-center gap-2 px-4 py-2 text-[14px] font-semibold text-black-main-text bg-gray-200 rounded-full cursor-pointer hover: bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            {story.status === 'Hidden' ? <><HiOutlineEye /> Unhide Story</> : <><HiOutlineEyeSlash /> Hide Story</>}
          </button>
          <button onClick={() => setDeleteModal(true)} disabled={story.status === 'Deleted'} className="flex items-center gap-2 px-4 py-2 text-[14px] font-semibold text-white bg-red-700 rounded-full cursor-pointer hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            <HiOutlineTrash /> Delete Story
          </button>
        </div>
      </div>
    </section>
  );
}
