import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TbBook } from 'react-icons/tb';
import {
  HiOutlineHeart, HiHeart,
  HiOutlineChatAlt2, HiOutlineShare,
  HiOutlineFlag, HiX,
  HiOutlinePencilAlt,
} from 'react-icons/hi';
import { IoSendSharp } from 'react-icons/io5';
import Toast from '../../../../components/Toast/Toast';

/* ─── Mock Data ─── */
const MOCK_STORY = {
  id: 1,
  author: 'Sarah M.',
  authorImg: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
  date: 'March 12, 2024',
  categories: ['Lifestyle', 'Health'],
  title: 'Nutrition Changes That Transformed My Health',
  content: [
    "When I first joined PulseX six months ago, I was struggling with chronic fatigue, digestive issues, and constant brain fog...",
    "The turning point came when my PulseX care coordinator suggested we take a comprehensive look at my nutrition patterns...",
    "Working with my nutritionist through PulseX, we identified several trigger foods that were causing inflammation...",
    "The PulseX platform made this transition manageable with personalized meal plans and daily check-ins...",
    "Three months into my new nutrition plan, the changes were remarkable. My energy levels stabilized...",
    "To anyone struggling with similar health challenges, I want you to know that small, consistent changes can lead to transformative results.",
  ],
  coverImg: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
  likes: 132,
  commentsCount: 89,
  shares: 24,
};

const MOCK_COMMENTS = [
  { id: 1, user: 'Dr. Ahmed Hassan', avatar: null, initials: 'D', time: '2 hours ago', text: 'This is such an inspiring story! Your dedication to tracking your nutrition really paid off.' },
  { id: 2, user: 'Fatima Ali', avatar: null, initials: 'F', time: '5 hours ago', text: "Thank you for sharing this. I'm going through similar issues and this gives me hope." },
];

const RELATED = [
  { id: 2, author: 'Michael R.', date: 'March 8, 2024', title: 'How Exercise Became My Medicine', tags: ['Fitness', 'Recovery'] },
  { id: 3, author: 'Emma L.', date: 'March 5, 2024', title: 'Managing Stress Through Mindfulness', tags: ['Mental Health', 'Wellness'] },
  { id: 4, author: 'David K.', date: 'March 1, 2024', title: 'Sleep Quality Changed Everything', tags: ['Sleep', 'Lifestyle'] },
];

const TAG_COLOURS = {
  Lifestyle: 'bg-[#FFF3E0] text-[#F57C00] border-[#FFE0B2]',
  Health: 'bg-[#E8EAF6] text-brand-main border-[#C5CAE9]',
  Fitness: 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]',
  Recovery: 'bg-[#FCE4EC] text-[#C62828] border-[#FFCDD2]',
  'Mental Health': 'bg-[#F3E5F5] text-[#6A1B9A] border-[#E1BEE7]',
  Wellness: 'bg-[#E0F7FA] text-[#00695C] border-[#B2EBF2]',
  Sleep: 'bg-[#E3F2FD] text-[#1565C0] border-[#BBDEFB]',
};

const tagCls = (t) => TAG_COLOURS[t] || 'bg-gray-100 text-gray-600 border-gray-200';
const REPORT_CATS = ['Spam', 'Misinformation', 'Hate Speech', 'Harassment', 'Other'];

/* ─── Avatar helper ─── */
const Avatar = ({ img, initials, size = 'w-10 h-10' }) =>
  img ? (
    <img src={img} alt={initials} className={`${size} rounded-full object-cover`} />
  ) : (
    <div className={`${size} rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-bold`}>
      {initials}
    </div>
  );

/* ─── Report Modal ─── */
const ReportModal = ({ title, onClose, onSubmit }) => {
  const [cat, setCat] = useState('');
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-black-main-text">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><HiX className="text-xl" /></button>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-black-main-text mb-1 block">Category</label>
            <select
              value={cat} onChange={(e) => setCat(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-[#F6F7F8] text-sm outline-none focus:border-brand-main"
            >
              <option value="" />
              {REPORT_CATS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-black-main-text mb-1 block">Reason</label>
            <textarea
              rows={4} value={reason} onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide details about why you're reporting this..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-[#F6F7F8] text-sm outline-none resize-none focus:border-brand-main"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-black-main-text hover:bg-gray-50 transition">Cancel</button>
          <button
            onClick={() => { onSubmit(); onClose(); }}
            className="flex-1 py-2.5 rounded-xl bg-brand-main text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#2730d4] transition"
          >
            <IoSendSharp /> Submit Report
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Component ─── */
const PatientStoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const story = MOCK_STORY;

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(story.likes);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [reportStory, setReportStory] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false); // الحالة الجديدة للتحكم في ظهور الكومنتات
  const [toast, setToast] = useState({ visible: false, title: '', message: '' });

  const showToast = (title, message) => {
    setToast({ visible: true, title, message });
  };

  const handleLike = () => {
    setIsLiked((p) => !p);
    setLikesCount((p) => (isLiked ? p - 1 : p + 1));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link Copied!', 'Story link copied to clipboard.');
  };

  const handlePostComment = () => {
    if (!comment.trim()) return;
    setComments((prev) => [
      { id: Date.now(), user: 'You', avatar: null, initials: 'Y', time: 'Just now', text: comment },
      ...prev,
    ]);
    setComment('');
    showToast('Comment Posted', 'Your comment has been added successfully.');
  };

  return (
    <>
      <Toast
        visible={toast.visible} title={toast.title} message={toast.message} duration={3000}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />

      {reportStory && (
        <ReportModal
          title="Report story"
          onClose={() => setReportStory(false)}
          onSubmit={() => showToast('Report Submitted', 'Thank you for your feedback.')}
        />
      )}

      <div className="w-full flex flex-col gap-5 p-5">
        {/* ── Page Header ── */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <TbBook className="text-xl text-black-main-text" />
            <h1 className="text-lg font-bold text-black-main-text">Patient Story Details</h1>
          </div>
          <p className="text-sm text-[#757575]">Read full patient journey and shared experiences.</p>

          <div className="mt-4 flex items-start gap-4">
            <Avatar img={story.authorImg} initials={story.author[0]} size="w-14 h-14" />
            <div>
              <p className="font-semibold text-black-main-text">{story.author}</p>
              <p className="text-xs text-[#6B7280]">Shared publicly to inspire other patients</p>
              <p className="text-xs text-[#4B5563] mt-0.5">{story.date}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {story.categories.map((c) => (
                  <span key={c} className={`px-3 py-1 rounded-full text-xs font-medium border ${tagCls(c)}`}>
                    {c} <span className="ml-0.5">✓</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Story Article ── */}
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-gray-100 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-black-main-text mb-5">{story.title}</h2>
          <div className="flex flex-col gap-4 text-sm text-[#374151] leading-relaxed">
            {story.content.slice(0, 2).map((p, i) => <p key={i}>{p}</p>)}
            <img src={story.coverImg} alt="Story cover" className="w-full rounded-xl object-cover max-h-[320px]" />
            {story.content.slice(2).map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>

        {/* ── Engagement Bar ── */}
        <div className="bg-white rounded-2xl px-5 py-4 border border-gray-100 shadow-sm flex items-center justify-between sm:justify-start gap-4 sm:gap-8 overflow-x-auto">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm rounded-full p-1 font-medium transition shrink-0 ${isLiked ? 'text-[#E7000B] bg-[#FEF2F2] rounded-full p-1' : 'text-[#4B5563]  hover:text-[#E7000B]'}`}
          >
            {isLiked ? <HiHeart className="text-lg" /> : <HiOutlineHeart className="text-lg" />}
            {likesCount}
          </button>

          <button
            onClick={() => setShowCommentBox(!showCommentBox)}
            className={`flex items-center gap-1.5 text-sm font-medium transition shrink-0 ${showCommentBox ? 'text-brand-main bg-[#EFF6FF] rounded-full p-1 ' : 'text-[#4B5563] hover:text-brand-main'}`}
          >
            <HiOutlineChatAlt2 className="text-lg" /> {comments.length + story.commentsCount}
          </button>

          <button onClick={handleShare} className="flex items-center gap-1.5 text-sm font-medium text-[#4B5563] hover:text-brand-main transition shrink-0">
            <HiOutlineShare className="text-lg" /> {story.shares}
          </button>

          <button onClick={() => setReportStory(true)} className="flex items-center gap-1.5 text-sm font-medium text-[#4B5563] hover:text-red-500 transition shrink-0">
            <HiOutlineFlag className="text-lg" /> Report
          </button>
        </div>

        {/* ── Comment Box (Conditional) ── */}
        {showCommentBox && (
          <>
            <div className="bg-[#EFF6FF] rounded-2xl p-5 border border-[#BEDBFF] shadow-sm transition-all animate-in fade-in slide-in-from-top-2">
              <div className="flex items-start gap-3">
                <Avatar img={story.authorImg} initials="Y" size="w-9 h-9" />
                <div className="flex-1 bg-[#FFFFFF] rounded-xl px-4 py-3 min-h-[80px]">
                  <textarea
                    rows={2} value={comment}
                    autoFocus
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your comment..."
                    className="w-full bg-transparent text-sm outline-none resize-none text-black-main-text placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-3">
                <button onClick={() => { setComment(''); setShowCommentBox(false); }} className="text-sm text-gray-500 hover:text-gray-700 transition">Cancel</button>
                <button
                  onClick={handlePostComment}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-main text-white text-sm font-semibold hover:bg-[#2730d4] transition"
                >
                  <IoSendSharp /> Post Comment
                </button>
              </div>
            </div>

            {/* ── Comments Preview ── */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-black-main-text">Comments ({comments.length + story.commentsCount})</h3>
                <button
                  onClick={() => navigate(`/patient/stories/${id}/comments`)}
                  className="text-xs font-semibold text-brand-main hover:underline flex items-center gap-1"
                >
                  View All <span>›</span>
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {comments.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-start gap-3 bg-[#F9FAFB] rounded-xl p-3">
                    <Avatar img={c.avatar} initials={c.initials} size="w-8 h-8" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-black-main-text">{c.user}</p>
                        <p className="text-xs  text-[#6A7282]">{c.time}</p>
                      </div>
                      <p className="text-xs text-[#364153] mt-0.5">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── You May Also Like ── */}
        <div>
          <h3 className="text-base font-bold text-black-main-text mb-4">You may also like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {RELATED.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <div>
                    <p className="text-xs font-semibold text-black-main-text">{r.author}</p>
                    <p className="text-xs text-[#6B7280]">{r.date}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-black-main-text leading-snug">{r.title}</p>
                <div className="flex flex-wrap gap-1">
                  {r.tags.map((t) => (
                    <span key={t} className={`px-2 py-0.5 rounded-full text-xs border ${tagCls(t)}`}>{t}</span>
                  ))}
                </div>
                <button onClick={() => navigate(`/patient/stories/${r.id}`)} className="text-xs font-semibold text-brand-main hover:underline text-left mt-auto">
                  Read Story →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer Buttons ── */}
        <div className="flex justify-end gap-3 py-2">
          <button onClick={() => navigate('/patient/stories')} className="px-6 py-2.5 rounded-full border border-gray-300 text-sm font-semibold text-black-main-text bg-white hover:bg-gray-50 transition">
            Back to Stories
          </button>
          <button onClick={() => navigate('/patient/write-story')} className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-brand-main text-white text-sm font-semibold hover:bg-[#2730d4] transition">
            <HiOutlinePencilAlt /> Write Story
          </button>
        </div>
      </div>
    </>
  );
};

export default PatientStoryDetails;