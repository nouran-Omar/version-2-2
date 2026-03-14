import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiOutlineChevronLeft, HiOutlineFlag, HiX, HiOutlineReply } from 'react-icons/hi';
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import { IoSendSharp } from 'react-icons/io5';
import { AiOutlineLike } from 'react-icons/ai';
import Toast from '../../../../components/Toast/Toast';

/* ─── Mock Data (replace with API later) ─── */
const MOCK_COMMENTS = [
  {
    id: 1, user: 'Dr. Ahmed Hassan', initials: 'D', avatar: null, time: '2 hours ago',
    text: 'This is such an inspiring story! Your dedication to tracking your nutrition really paid off. I recommend this approach to many of my patients.',
    likes: 24,
    replies: [
      { id: 11, user: 'Sarah M.', initials: 'S', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', time: '1 hour ago', text: 'Thank you Dr. Hassan! Your support through PulseX was invaluable.', likes: 8 },
    ],
  },
  {
    id: 2, user: 'Fatima Ali', initials: 'F', avatar: null, time: '5 hours ago',
    text: "Thank you for sharing this. I'm going through similar issues and this gives me hope. Did you have any setbacks during your journey?",
    likes: 18, replies: [],
  },
  {
    id: 3, user: 'Omar Khaled', initials: 'O', avatar: null, time: '8 hours ago',
    text: 'Amazing transformation! How long did it take before you started noticing significant changes?',
    likes: 12,
    replies: [
      { id: 31, user: 'Sarah M.', initials: 'S', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', time: '6 hours ago', text: 'I started feeling better within 2 weeks, but the major changes came after 6-8 weeks of consistency.', likes: 15 },
      { id: 32, user: 'Omar Khaled', initials: 'O', avatar: null, time: '5 hours ago', text: "That's really encouraging! Thank you for the response.", likes: 3 },
    ],
  },
  {
    id: 4, user: 'Dr. Layla Ibrahim', initials: 'L', avatar: null, time: '12 hours ago',
    text: 'As a nutritionist, I love seeing patients take control of their health this way. The tracking aspect is crucial for identifying patterns.',
    likes: 31, replies: [],
  },
  {
    id: 5, user: 'Youssef Omar', initials: 'Y', avatar: null, time: '1 day ago',
    text: 'Did you work with a specific nutritionist on PulseX or did you follow the automated meal plans?',
    likes: 9, replies: [],
  },
  {
    id: 6, user: 'Nour Hassan', initials: 'N', avatar: null, time: '1 day ago',
    text: "This resonates so much with me! I've been dealing with brain fog for months. Going to try the nutrition tracking approach.",
    likes: 21,
    replies: [
      { id: 61, user: 'Sarah M.', initials: 'S', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', time: '20 hours ago', text: 'Best of luck! Feel free to reach out if you have questions. The community here is amazing.', likes: 6 },
    ],
  },
  {
    id: 7, user: 'Dr. Khaled Mansour', initials: 'D', avatar: null, time: '2 days ago',
    text: 'Excellent example of patient-centered care. The holistic approach through PulseX platform really makes a difference.',
    likes: 14, replies: [],
  },
  {
    id: 8, user: 'Mariam Ahmed', initials: 'M', avatar: null, time: '2 days ago',
    text: "What were the main trigger foods you had to eliminate? I'm curious if we might have similar sensitivities.",
    likes: 16, replies: [],
  },
  {
    id: 9, user: 'Salma Nasser', initials: 'S', avatar: null, time: '3 days ago',
    text: "I love how PulseX provides the accountability factor. That's what I've been missing in my health journey.",
    likes: 19, replies: [],
  },
];

const REPORT_CATS = ['Spam', 'Misinformation', 'Hate Speech', 'Harassment', 'Other'];

/* ─── helpers ─── */
const Avatar = ({ img, initials, size = 'w-10 h-10' }) =>
  img ? (
    <img src={img} alt={initials} className={`${size} rounded-full object-cover shrink-0`} />
  ) : (
    <div className={`${size} rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-bold shrink-0`}>
      {initials}
    </div>
  );

const ReportModal = ({ onClose, onSubmit }) => {
  const [cat, setCat] = useState('');
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-black-main-text">Report Comment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><HiX className="text-xl" /></button>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-black-main-text mb-1 block">Category</label>
            <select value={cat} onChange={(e) => setCat(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-[#F6F7F8] text-sm outline-none focus:border-brand-main">
              <option value="Select a category">Select a category</option>
              {REPORT_CATS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-black-main-text mb-1 block">Reason</label>
            <textarea rows={4} value={reason} onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide details about why you're reporting this..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-[#F6F7F8] text-sm outline-none resize-none focus:border-brand-main" />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-black-main-text hover:bg-gray-50">Cancel</button>
          <button onClick={() => { onSubmit(); onClose(); }}
            className="flex-1 py-2.5 rounded-xl bg-brand-main text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#2730d4]">
            <IoSendSharp /> Submit Report
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Component ─── */
const PatientAllComments = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const storyTitle = 'Nutrition Changes That Transformed My Health'; // replace with API

  const [comments, setComments]           = useState(MOCK_COMMENTS);
  const [newComment, setNewComment]       = useState('');
  const [replyingTo, setReplyingTo]       = useState(null); // comment id
  const [replyText, setReplyText]         = useState('');
  const [reportTarget, setReportTarget]   = useState(null); // comment id or 'new'
  const [likedIds, setLikedIds]           = useState({});
  const [toast, setToast]                 = useState({ visible: false, title: '', message: '' });

  const showToast = (title, message) => setToast({ visible: true, title, message });

  const handleLike = (commentId, replyId = null) => {
    const key = replyId ? `${commentId}-${replyId}` : `${commentId}`;
    setLikedIds((prev) => ({ ...prev, [key]: !prev[key] }));
    setComments((prev) => prev.map((c) => {
      if (!replyId && c.id === commentId) return { ...c, likes: likedIds[key] ? c.likes - 1 : c.likes + 1 };
      if (replyId && c.id === commentId) return {
        ...c,
        replies: c.replies.map((r) =>
          r.id === replyId ? { ...r, likes: likedIds[key] ? r.likes - 1 : r.likes + 1 } : r
        ),
      };
      return c;
    }));
  };

  const handlePostComment = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [
      { id: Date.now(), user: 'You', initials: 'Y', avatar: null, time: 'Just now', text: newComment, likes: 0, replies: [] },
      ...prev,
    ]);
    setNewComment('');
    showToast('Comment Posted', 'Your comment has been added.');
  };

  const handlePostReply = (commentId) => {
    if (!replyText.trim()) return;
    setComments((prev) => prev.map((c) =>
      c.id === commentId
        ? { ...c, replies: [...c.replies, { id: Date.now(), user: 'You', initials: 'Y', avatar: null, time: 'Just now', text: replyText, likes: 0 }] }
        : c
    ));
    setReplyText('');
    setReplyingTo(null);
    showToast('Reply Posted', 'Your reply has been added.');
  };

  return (
    <>

      <Toast visible={toast.visible} title={toast.title} message={toast.message} duration={3000}
        onClose={() => setToast((t) => ({ ...t, visible: false }))} />

      {reportTarget && (
        <ReportModal
          onClose={() => setReportTarget(null)}
          onSubmit={() => showToast('Report Submitted', 'Thank you for your feedback.')}
        />
      )}

      <div className="w-full  flex flex-col gap-5 p-5">

        {/* ── Back ── */}
        <button
          onClick={() => navigate(`/patient/stories/${id}`)}
          className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer hover:text-brand-main transition w-fit"
        >
          <HiOutlineChevronLeft /> Back to Story
        </button>

        {/* ── Header ── */}
        <div className="bg-white rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <HiOutlineChatBubbleLeftRight className="text-xl text-black-main-text" />
            <h1 className="text-2xl font-bold text-black-main-text">All Comments</h1>
          </div>
          <p className="text-lg text-[#757575]">{comments.length} comments on "{storyTitle}"</p>
        </div>

        {/* ── Add Comment ── */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-black-main-text mb-3">Add a Comment</h2>
          <div className="flex items-start gap-3">
            <Avatar img="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" initials="Y" size="w-10 h-10" />
            <textarea
              rows={3} value={newComment} onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-[#F9FAFB] text-sm outline-none resize-none focus:border-brand-main transition"
            />
          </div>
          <div className="flex justify-end mt-3">
            <button onClick={handlePostComment}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-brand-main text-white text-[16px] font-semibold hover:bg-[#2730d4] transition">
              <IoSendSharp /> Post Comment
            </button>
          </div>
        </div>

        {/* ── Comments List ── */}
        <div className="flex flex-col gap-4">
          {comments.map((c) => {
            const likeKey = `${c.id}`;
            const liked = !!likedIds[likeKey];
            return (
              <div key={c.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">

                {/* Comment author */}
                <div className="flex items-start gap-3">
                  <Avatar img={c.avatar} initials={c.initials} size="w-11 h-11" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <p className="text-[16px] font-semibold text-black-main-text">{c.user}</p>
                      <p className="text-xs text-[#6A7282]">{c.time}</p>
                    </div>
                    <p className="text-[16px] text-[#364153] mt-1 leading-relaxed">{c.text}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      <button
                        onClick={() => handleLike(c.id)}
                        className={`flex items-center gap-1 text-xs font-medium transition
                          ${liked ? 'text-brand-main' : 'text-[#4A5565] hover:text-brand-main'}`}
                      >
                        <AiOutlineLike className="text-base" /> {c.likes}
                      </button>
                      <button
                        onClick={() => { setReplyingTo(replyingTo === c.id ? null : c.id); setReplyText(''); }}
                        className="flex items-center gap-1 text-xs font-medium text-[#4A5565] hover:text-brand-main transition"
                      >
                        <HiOutlineReply className="text-base" /> Reply
                      </button>
                      <button
                        onClick={() => setReportTarget(c.id)}
                        className="flex items-center gap-1 text-xs font-medium text-[#4A5565] hover:text-red-500 transition"
                      >
                        <HiOutlineFlag className="text-base" /> Report
                      </button>
                    </div>

                    {/* Reply input */}
                    {replyingTo === c.id && (
                      <div className="mt-3 flex items-start gap-2">
                        <div className="w-7 h-7 rounded-full bg-brand-main/10 flex items-center justify-center text-brand-main text-xs font-bold shrink-0">Y</div>
                        <div className="flex-1 flex flex-col gap-2">
                          <textarea
                            rows={2} value={replyText} onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Reply to ${c.user}...`}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-[#F6F7F8] text-xs outline-none resize-none focus:border-brand-main"
                          />
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setReplyingTo(null)} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
                            <button onClick={() => handlePostReply(c.id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-main text-white text-xs font-semibold hover:bg-[#2730d4]">
                              <IoSendSharp /> Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Nested replies */}
                {c.replies.length > 0 && (
                  <div className="mt-4 ml-14 flex flex-col gap-3 border-l-2 border-gray-100 pl-4">
                    {c.replies.map((r) => {
                      const rKey = `${c.id}-${r.id}`;
                      const rLiked = !!likedIds[rKey];
                      return (
                        <div key={r.id} className="flex items-start gap-3">
                          <Avatar img={r.avatar} initials={r.initials} size="w-7 h-7" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between flex-wrap gap-1">
                              <p className="text-xs font-semibold text-black-main-text">{r.user}</p>
                              <p className="text-xs text-[#6A7282]">{r.time}</p>
                            </div>
                            <p className="text-xs text-[#364153] mt-0.5 leading-relaxed">{r.text}</p>
                            <button
                              onClick={() => handleLike(c.id, r.id)}
                              className={`flex items-center gap-1 text-xs mt-2 transition
                                ${rLiked ? 'text-brand-main' : 'text-gray-400 hover:text-brand-main'}`}
                            >
                              <AiOutlineLike /> {r.likes}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </>
  );
};

export default PatientAllComments;
