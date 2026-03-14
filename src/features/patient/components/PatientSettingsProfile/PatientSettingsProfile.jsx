import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LuUser, LuLock, LuBell, LuMoon,
  LuMail, LuPhone, LuCalendar, LuMapPin,
  LuCheck, LuEye, LuEyeOff, LuShieldCheck,
  LuHeartPulse, LuRuler, LuDroplet, LuActivity,
  LuBookOpen, LuTrash2, LuEye as LuEyeIcon,
  LuThumbsUp, LuMessageCircle, LuCalendarDays,
  LuPencil, LuX,
} from 'react-icons/lu';
import { HiOutlineCog6Tooth } from 'react-icons/hi2';
import { FaHeartPulse } from 'react-icons/fa6';
import { GenderToggle } from '../../../admin/components/shared';
import ConfirmModal from '../../../admin/components/ConfirmModal/ConfirmModal';
import Toast from '../../../../components/Toast/Toast';
import usePatientData from '../../../../PatientHooks/usePatientData';

function checkReqs(val) {
  return {
    length: val.length >= 8,
    mixed: /[a-z]/.test(val) && /[A-Z]/.test(val),
    number: /\d/.test(val),
  };
}const MOCK_STORIES = [
  {
    id: 1,
    title: 'Nutrition Changes That Transformed My Health',
    tags: ['Lifestyle', 'Health'],
    excerpt: 'When I first joined PulseX six months ago, I was struggling with chronic fatigue..',
    date: 'March 12, 2024',
    views: 1247,
    likes: 132,
    comments: 89,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 2,
    title: 'How Exercise Became My Medicine',
    tags: ['Fitness', 'Recovery'],
    excerpt: 'Three months ago, I could barely walk up a flight of stairs without getting winded...',
    date: 'March 5, 2024',
    views: 892,
    likes: 76,
    comments: 42,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=300&q=80',
  },
];
export default function PatientSettingsProfile() {
  const { patient } = usePatientData();
  const navigate = useNavigate();

  /* Toast */
  const [toast, setToast] = useState({ visible: false, title: '', msg: '' });
  const showToast = (title, msg) => {
    setToast({ visible: true, title, msg });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3500);
  };

  /* Profile photo */
  const fileRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
    showToast('Photo Updated', 'Your profile photo has been changed successfully.');
  };

  /* Personal info */
  const [form, setForm] = useState({
    firstName: patient?.name?.split(' ')[0] ?? 'Mohamed',
    lastName: patient?.name?.split(' ')[1] ?? 'Salem',
    email: patient?.email ?? 'Mohamed.salem@pulsex.com',
    phone: patient?.phone ?? '+20 1234567890',
    dob: patient?.dateOfBirth ?? '1985-06-15',
    location: 'Cairo, Egypt',
    gender: (patient?.gender ?? 'Male'),
  });
  const handleField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSaveProfile = () =>
    showToast('Saved Successfully', 'Your profile has been updated successfully.');

  /* Password modal */
  const [pwModal, setPwModal] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const reqs = checkReqs(pwForm.newPw);

  const handleSavePassword = () => {
    if (!pwForm.current) { setPwError('Please enter your current password.'); return; }
    if (!reqs.length || !reqs.mixed || !reqs.number) { setPwError('New password does not meet requirements.'); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwError('Passwords do not match.'); return; }
    setPwModal(false);
    setPwForm({ current: '', newPw: '', confirm: '' });
    setPwError('');
    showToast('Password Changed', 'Your password has been updated successfully.');
  };

  /* Toggles */
  const [emailNotif, setEmailNotif] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  /* Stories */
  const [stories, setStories] = useState(MOCK_STORIES);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDeleteStory = () => {
    setStories(s => s.filter(x => x.id !== deleteTarget));
    setDeleteTarget(null);
    showToast('Story Deleted', 'Your story has been removed successfully.');
  };

  /* Health vitals display */
  const v = patient?.vitals;
  const healthCards = [
    { label: 'Height', value: '175 cm', icon: <LuRuler /> },
    { label: 'Weight', value: '75 kg', icon: <LuActivity /> },
    { label: 'Blood Pressure', value: v?.bloodPressure?.display ?? '120/80', icon: <LuDroplet /> },
    { label: 'Blood Sugar', value: `${v?.bloodSugar?.value ?? 95} mg/dL`, icon: <LuPencil /> },
    { label: 'Blood Count', value: `${v?.bloodCount?.value ?? 14.5} g/dL`, icon: <LuActivity /> },
    { label: 'Heart Rate', value: `${v?.heartRate?.value ?? 72} bpm`, icon: <FaHeartPulse /> },
  ];

  /* â”€â”€ render â”€â”€ */
  return (
    <div className="flex flex-col gap-6 font-roboto p-5 ">

      {/* Toast */}
      <Toast
        visible={toast.visible}
        title={toast.title}
        message={toast.msg}
        type="success"
        onClose={() => setToast(t => ({ ...t, visible: false }))}
      />
<header className="flex flex-col  pb-4 ">
  
  {/* السطر الأول: الأيقونة + العنوان */}
  <div className="flex items-center gap-1">
    {/* حاوية الأيقونة */}
    <div className="w-10 h-10 flex items-center text-black-main-text justify-center text-[24px] shrink-0">
      <HiOutlineCog6Tooth />
    </div>

    {/* العنوان H1 */}
    <h1 className="text-[24px] font-bold text-black-main-text">
      Settings & Profile
    </h1>
  </div>

  {/* السطر الثاني: الوصف (ينزل تحتهم) */}
  <p className="text-[18px] ml-2 text-[#757575] ">
    Manage your personal details, health data, and account preferences.
  </p>
  
</header>


      {/* â•â• 1. Personal Information â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <div className="bg-white rounded-[22px] border border-gray-100 shadow-sm overflow-hidden">

        {/* card header */}
        <div
          className="flex items-center gap-2 px-5 py-4"
          style={{ background: 'linear-gradient(to right,#EFF6FF,#EEF2FF)' }}
        >
          <LuUser size={18} className="text-[#155DFC]" />
          <span className="text-[#101828] text-[18px] font-bold">Personal Information</span>
        </div>

        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Profile Photo */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <p className="text-sm font-semibold text-gray-600 mb-1 self-start lg:self-center">Profile Photo</p>
              <div
                className="w-28 h-28 rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors relative group"
                onClick={() => fileRef.current.click()}
              >
                <img
                  src={photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.firstName + ' ' + form.lastName)}&background=333CF5&color=fff&size=128`}
                  className="w-full h-full object-cover"
                  alt="Profile"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">Change</span>
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              <span className="text-[10px] text-gray-400 text-center leading-relaxed">
                JPG, PNG or GIF<br />Max size 5MB
              </span>
            </div>

            {/* Form grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1">
              <InputField label="First Name" icon={<LuUser />} value={form.firstName} onChange={v => handleField('firstName', v)} required />
              <InputField label="Last Name"  icon={<LuUser />} value={form.lastName}  onChange={v => handleField('lastName', v)}  required />
              <InputField label="Email Address"  icon={<LuMail />}     value={form.email}    onChange={v => handleField('email', v)}    required />
              <InputField label="Phone Number"   icon={<LuPhone />}    value={form.phone}    onChange={v => handleField('phone', v)}    required />
              <InputField label="Date of Birth"  icon={<LuCalendar />} value={form.dob}      onChange={v => handleField('dob', v)}      required />
              <InputField label="Location"       icon={<LuMapPin />}   value={form.location} onChange={v => handleField('location', v)} required />
              <div className="sm:col-span-2">
                <GenderToggle
                  value={form.gender}
                  onChange={val => handleField('gender', val)}
                />
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSaveProfile}
              className="bg-brand-main hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors text-sm"
            >
              <LuCheck size={16} /> Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* â•â• 2. Health Information â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <div className="bg-white rounded-[22px] border border-[#E5E7EB] shadow-sm overflow-hidden">

        {/* card header */}
        <div
          className="flex items-center gap-2 px-5 py-4"
          style={{ background: 'linear-gradient(to right,#FAF5FF,#FDF2F8)' }}
        >
          <FaHeartPulse size={18} className="text-[#9810FA]" />
          <span className="text-black-main-text text-[18px] font-bold">Health Information</span>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            {healthCards.map((c) => (
              <div key={c.label} className="bg-[#f9fafb] p-5">
                <div className="flex items-center gap-1.5 text-[#4B5563] text-[14px] mb-1.5">
                  <span className="text-[14px]">{c.icon}</span>
                  {c.label}
                </div>
                <p className="text-black-main-text font-extrabold text-[24px] leading-tight">{c.value}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/patient/update-health')}
            className="border border-brand-main cursor-pointer text-brand-main hover:bg-[#EEF2FF] transition-colors px-6 py-2.5 rounded-full text-[16px] font-bold"
          >
            Update Health Data
          </button>
        </div>
      </div>

      {/* â•â• 3. My Published Stories â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <div className="bg-white rounded-[22px] border border-gray-100 shadow-sm overflow-hidden">

        {/* card header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ background: 'linear-gradient(to right,#F0FDF4,#ECFDF5)' }}
        >
          <div className="flex items-center gap-2">
            <LuBookOpen size={18} className="text-[#00A63E]" />
            <span className="text-[#101828] text-[18px] font-bold">My Published Stories</span>
          </div>
          <span className="text-xs font-bold text-[#008236] bg-[#DCFCE7] px-3 py-1 rounded-full">
            {stories.length} Published
          </span>
        </div>

        <div className="p-6">
          {stories.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <LuBookOpen size={36} className="mx-auto mb-3 opacity-40" />
              <p className="font-semibold">No published stories yet</p>
              <p className="text-xs mt-1">Write your first story to share with the community.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {stories.map(story => (
                <div
                  key={story.id}
                  className="flex gap-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                >
                  {/* thumbnail */}
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-24 h-20 sm:w-32 sm:h-24 rounded-xl object-cover shrink-0 cursor-pointer"
                    onClick={() => navigate(`/patient/stories/${story.id}`)}
                  />

                  {/* info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-bold text-black-main-text text-[18px] sm:text-base cursor-pointer hover:text-brand-main transition-colors line-clamp-1"
                      onClick={() => navigate(`/patient/stories/${story.id}`)}
                    >
                      {story.title}
                    </h3>

                    {/* tags */}
                    <div className="flex flex-wrap gap-1.5 mt-1.5 mb-2">
                      {story.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-[#DBEAFE] text-[#155DFC] border border-blue-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="text-[14px] text-[#4A5565] line-clamp-2 mb-2">{story.excerpt}</p>

                    {/* stats */}
                    <div className="flex flex-wrap items-center gap-3 text-[14px] text-[#4A5565]">
                      <span className="flex items-center gap-1">
                        <LuCalendarDays size={12} /> {story.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <LuEyeIcon size={12} /> {story.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <LuThumbsUp size={12} /> {story.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <LuMessageCircle size={12} /> {story.comments}
                      </span>
                    </div>
                  </div>

                  {/* delete btn */}
                  <button
                    onClick={() => setDeleteTarget(story.id)}
                    className="text-[#E7000B] cursor-pointer hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-all h-fit mt-1 shrink-0"
                    title="Delete story"
                  >
                    <LuTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Write Story button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate('/patient/write-story')}
              className="bg-brand-main cursor-pointer hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-colors text-sm"
            >
              + Write Story
            </button>
          </div>
        </div>
      </div>

      {/* â•â• 4. Account Settings â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <div className="bg-white rounded-[22px] border border-gray-100 shadow-sm overflow-hidden">

        {/* card header */}
        <div
          className="flex items-center gap-2 px-5 py-4"
          style={{ background: 'linear-gradient(to right,#FFF7ED,#FEF2F2)' }}
        >
          <HiOutlineCog6Tooth size={18} className="text-[#f97316]" />
          <span className="text-[#101828] text-[18px] font-bold">Account Settings</span>
        </div>

        <div className="divide-y divide-gray-50">
          <SettingRow
            icon={<LuLock />}
            title="Change Password"
            desc="Update your password regularly for security"
            action={
              <button
                onClick={() => { setPwError(''); setPwModal(true); }}
                className="text-[#155DFC] font-bold text-sm hover:underline"
              >
                Change
              </button>
            }
          />
          <SettingRow
            icon={<LuBell />}
            title="Email Notifications"
            desc="Receive email updates about your account"
            action={<Toggle checked={emailNotif} onChange={() => setEmailNotif(v => !v)} />}
          />
          <SettingRow
            icon={<LuMoon />}
            title="Dark Mode"
            desc="Switch to dark theme"
            action={<Toggle checked={darkMode} onChange={() => setDarkMode(v => !v)} />}
          />
        </div>
      </div>

      {/* â•â• Delete Story ConfirmModal â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Delete Story?"
        desc="Are you sure you want to delete this story? This action cannot be undone."
        onConfirm={handleDeleteStory}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* â•â• Change Password Modal â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {pwModal && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(3px)' }}
          onClick={e => { if (e.target === e.currentTarget) setPwModal(false); }}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 p-7 relative"
            style={{ animation: 'pwSlideIn .28s ease' }}
          >
            {/* close */}
            <button
              onClick={() => setPwModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100"
            >
              <LuX size={18} />
            </button>

            <h2 className="text-xl font-extrabold text-black-main-text mb-0.5">Change Password</h2>
            <p className="text-gray-400 text-sm mb-5">Update your password securely</p>

            {pwError && (
              <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                {pwError}
              </div>
            )}

            <PasswordField
              label="Current Password"
              placeholder="Enter current password"
              value={pwForm.current}
              show={showPw.current}
              onToggle={() => setShowPw(s => ({ ...s, current: !s.current }))}
              onChange={v => setPwForm(f => ({ ...f, current: v }))}
            />
            <PasswordField
              label="New Password"
              placeholder="Enter new password"
              value={pwForm.newPw}
              show={showPw.newPw}
              onToggle={() => setShowPw(s => ({ ...s, newPw: !s.newPw }))}
              onChange={v => setPwForm(f => ({ ...f, newPw: v }))}
            />
            <PasswordField
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={pwForm.confirm}
              show={showPw.confirm}
              onToggle={() => setShowPw(s => ({ ...s, confirm: !s.confirm }))}
              onChange={v => setPwForm(f => ({ ...f, confirm: v }))}
            />

            {/* Requirements */}
            <div className="mt-3 mb-5 bg-gray-50 rounded-2xl p-4">
              <p className="text-xs font-bold text-gray-700 mb-2">Password Requirements:</p>
              <ul className="space-y-1.5">
                <ReqItem met={reqs.length} text="At least 8 characters long" />
                <ReqItem met={reqs.mixed}  text="Contains uppercase and lowercase letters" />
                <ReqItem met={reqs.number} text="Contains at least one number" />
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPwModal(false)}
                className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePassword}
                className="flex-1 py-3 rounded-2xl bg-brand-main text-white font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors text-sm"
              >
                <LuShieldCheck size={16} /> Save Password
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pwSlideIn {
          from { transform: translateY(-18px) scale(.97); opacity: 0; }
          to   { transform: translateY(0)     scale(1);   opacity: 1; }
        }
        .line-clamp-1 { overflow:hidden; display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; }
        .line-clamp-2 { overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }
      `}</style>
    </div>
  );
}
function InputField({ label, icon, value, onChange, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[16px] font-semibold  text-[#364153]">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="flex items-center bg-[#f9fafb] border border-gray-200 rounded-xl px-3.5 py-2.5 gap-2.5 focus-within:border-[#155DFC] transition-colors">
        <span className="text-gray-400 shrink-0 text-[18px]">{icon}</span>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="bg-transparent  outline-none w-full text-[18px] text-black-main-text"
        />
      </div>
    </div>
  );
}

function PasswordField({ label, placeholder, value, show, onToggle, onChange }) {
  return (
    <div className="mb-4">
      <label className="text-[16px]  text-[#364153] mb-1.5 block">{label}</label>
      <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 gap-2.5 focus-within:border-[#155DFC] transition-colors">
        <LuLock size={14} className="text-gray-400 shrink-0" />
        <input
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="outline-none w-full text-[16px] text-black-main-text bg-transparent"
        />
        <button type="button" onClick={onToggle} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
          {show ? <LuEyeOff size={14} /> : <LuEye size={14} />}
        </button>
      </div>
    </div>
  );
}

function ReqItem({ met, text }) {
  return (
    <li className={`flex items-center gap-2 text-xs ${met ? 'text-green-600' : 'text-gray-400'}`}>
      <LuCheck size={12} className={met ? 'text-green-500' : 'text-gray-300'} />
      {text}
    </li>
  );
}

function SettingRow({ icon, title, desc, action }) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-lg shrink-0">{icon}</span>
        <div>
          <h4 className="font-bold text-[14px] text-black-main-text">{title}</h4>
          <p className="text-gray-400 text-[12px] mt-0.5">{desc}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#155DFC] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white" />
    </label>
  );
}
