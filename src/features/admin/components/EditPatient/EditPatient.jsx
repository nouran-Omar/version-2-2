import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { GenderToggle } from '../shared';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import { LuUpload, LuUser } from 'react-icons/lu';
import { TbTrash } from 'react-icons/tb';
import {
  HiOutlineEnvelope, HiOutlinePhone, HiOutlineCalendarDays,
  HiOutlineLockClosed, HiOutlineExclamationCircle,
  HiMiniUserPlus, HiOutlineCheckCircle,
} from 'react-icons/hi2';

const validationSchema = Yup.object({
  firstName:   Yup.string().required('First name is required'),
  lastName:    Yup.string().required('Last name is required'),
  email:       Yup.string().email('Invalid email format').required('Email is required'),
  phone:       Yup.string().required('Phone number is required'),
  dateOfBirth: Yup.date().nullable().required('Date of birth is required'),
  password:    Yup.string().min(8, 'At least 8 characters'),
  gender:      Yup.string().required('Gender is required'),
});

const FieldError = ({ msg }) =>
  msg ? (
    <span className="flex items-center gap-1.5 text-[12px] text-red-500 mt-0.5">
      <HiOutlineExclamationCircle className="text-[13px] shrink-0" />{msg}
    </span>
  ) : null;

// التنسيقات الموحدة (الـ Radius أصبح 8px كما في صفحة الدكتور)
const iconWrap  = "flex items-center gap-2 px-3 py-2 rounded-[8px] border bg-white focus-within:ring-2 focus-within:ring-[#155dfc]/30 focus-within:border-[#155dfc] transition-colors";
const inputBase = "w-full px-3 py-2 text-[13px] rounded-[8px] border border-gray-200 bg-white text-black-main-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc]/30 focus:border-[#155dfc] transition-colors";

const InputField = ({ label, name, type = 'text', formik, placeholder, icon: Icon }) => {
  const hasError = formik.touched[name] && formik.errors[name];
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-[#364153]">{label} <span className="text-red-500">*</span></label>
      <div className={`${Icon ? iconWrap : ''} ${hasError ? 'border-red-400' : 'border-gray-200'}`}>
        {Icon && <Icon className="text-gray-400 shrink-0 text-[15px]" />}
        <input type={type} className={Icon ? "flex-1 border-none outline-none bg-transparent text-[13px]" : `${inputBase} ${hasError ? 'border-red-400' : ''}`} placeholder={placeholder} {...formik.getFieldProps(name)} />
      </div>
      <FieldError msg={hasError ? formik.errors[name] : ''} />
    </div>
  );
};

export default function EditPatient() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [imagePreview, setImagePreview] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const formik = useFormik({
    initialValues: { firstName: '', lastName: '', email: '', phone: '', dateOfBirth: null, password: '', gender: 'Female', image: null },
    validationSchema,
    onSubmit: async (values) => {
      await new Promise((res) => setTimeout(res, 800));
      navigate('/admin/patient-management', { state: { success: true, title: 'Updated Successfully', message: 'Patient details have been updated.' } });
    },
  });

  useEffect(() => {
    // المحاكاة للبيانات (Mock Data)
    const mockData = { firstName: 'Nouran', lastName: 'Mahdy', email: 'patient@pulsex.com', phone: '+20 1100000000', dateOfBirth: new Date('1995-05-20'), gender: 'Female', image: 'https://randomuser.me/api/portraits/women/12.jpg' };
    formik.setValues({ ...mockData, password: '' });
    setImagePreview(mockData.image);
  }, [id]);

  const handleDeleteConfirm = async () => {
    setIsDeleteModalOpen(false);
    navigate('/admin/patient-management', { state: { success: true, title: 'Deleted Successfully', message: 'Patient has been removed.' } });
  };

  const handleImageChange = (e) => {
    const file = e.currentTarget.files[0];
    if (!file) return;
    formik.setFieldValue('image', file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <section className="flex flex-col bg-white rounded-xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden" aria-label="Edit Patient">

      {/* Header - نفس الـ Gradient والـ Style الخاص بالدكتور */}
      <header className="flex items-center p-5 bg-gradient-to-r from-blue-600 to-blue-700 gap-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FFFFFF33] text-white text-[20px] shrink-0"><HiMiniUserPlus /></div>
        <div>
          <h1 className="text-[18px] font-bold text-white leading-tight">Edit Patient</h1>
          <p className="text-[12px] text-blue-50/80">View, edit, and manage all registered Patients.</p>
        </div>
      </header>

      <form onSubmit={formik.handleSubmit} className="flex flex-col">
        <div className="flex flex-col p-6 lg:flex-row gap-8">

          {/* Upload Photo - المساحة الكبيرة كما طلبتِ */}
          <div className="lg:w-[220px] flex flex-col gap-3 shrink-0">
            <p className="text-[12px] font-bold text-[#364153]">Upload Photo</p>
            <label className="flex flex-col items-center justify-center gap-2 p-3 rounded-[8px] border-2 border-dashed border-gray-200 bg-[#F6F7F8] cursor-pointer hover:border-[#155dfc]/40 transition-all text-center min-h-[200px]">
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-[180px] object-cover rounded-[6px]" alt="Patient" />
              ) : (
                <>
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-[#155dfc] text-[22px] shadow-sm"><LuUpload /></div>
                  <p className="text-[12px] font-semibold text-black-main-text">Click to upload photo</p>
                  <p className="text-[11px] text-gray-400">PNG, JPG up to 10MB</p>
                </>
              )}
            </label>
          </div>

          {/* Personal Information - الـ Container اللي فيه Shadow */}
          <div className="flex-1 flex flex-col gap-5">
            <div className="flex items-center gap-2 text-[14px] font-bold text-[#155dfc] border-b border-gray-50 pb-2">
              <LuUser className="text-[18px]" /><span className="text-[#101828]">Personal Information</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <InputField label="First Name"   name="firstName" formik={formik} placeholder="Enter first name" />
              <InputField label="Last Name"    name="lastName"  formik={formik} placeholder="Enter last name" />
              <InputField label="Email Address" name="email"     icon={HiOutlineEnvelope} formik={formik} placeholder="patient@pulsex.com" />
              <InputField label="Phone Number"  name="phone"     icon={HiOutlinePhone}    formik={formik} placeholder="+20 1000000000" />
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#364153]">Date of Birth <span className="text-red-500">*</span></label>
                <div className={`${iconWrap} ${formik.touched.dateOfBirth && formik.errors.dateOfBirth ? 'border-red-400' : 'border-gray-200'}`}>
                  <HiOutlineCalendarDays className="text-gray-400 shrink-0 text-[15px]" />
                  <DatePicker 
                    selected={formik.values.dateOfBirth} 
                    onChange={(date) => formik.setFieldValue('dateOfBirth', date)} 
                    className="flex-1 outline-none bg-transparent text-[13px] cursor-pointer" 
                    placeholderText="Select date" 
                    dateFormat="MMM dd, yyyy" 
                  />
                </div>
                <FieldError msg={formik.touched.dateOfBirth && formik.errors.dateOfBirth ? formik.errors.dateOfBirth : ''} />
              </div>

              <InputField label="Password" name="password" type="password" icon={HiOutlineLockClosed} formik={formik} placeholder="Create a strong password" />
            </div>

            <div className="mt-2">
               <GenderToggle value={formik.values.gender} onChange={(val) => formik.setFieldValue('gender', val)} error={formik.touched.gender && formik.errors.gender} />
            </div>
          </div>
        </div>

        {/* Footer Buttons - الـ Style الموحد */}
        <div className="flex items-center justify-end gap-3 p-6 bg-gray-50/50 border-t border-gray-100">
          <button type="button" onClick={() => navigate('/admin/patient-management')} className="px-5 py-2.5 text-[13px] font-bold text-[#364153] bg-white border border-gray-200 rounded-[8px] hover:bg-gray-50 transition-all cursor-pointer">Cancel</button>
          <button type="button" onClick={() => setIsDeleteModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold text-white bg-[#DC2626] rounded-[8px] hover:bg-red-700 transition-all cursor-pointer shadow-sm shadow-red-200"><TbTrash className="text-base" /> Delete Patient</button>
          <button type="submit" disabled={formik.isSubmitting} className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-bold text-white bg-[#333CF5] rounded-[8px] hover:bg-[#2830d4] disabled:opacity-60 transition-all cursor-pointer shadow-md shadow-blue-100">
            <HiOutlineCheckCircle className="text-[17px]" />
            {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      <ConfirmModal isOpen={isDeleteModalOpen} title="Delete Patient?" desc="Are you sure you want to delete this patient? This action is permanent and cannot be undone." onConfirm={handleDeleteConfirm} onCancel={() => setIsDeleteModalOpen(false)} />
    </section>
  );
}