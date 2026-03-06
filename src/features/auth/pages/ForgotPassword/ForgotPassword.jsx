import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import ForgotPassWrapper from '../../components/ForgotPassWrapper/ForgotPassWrapper';
import { 
  emailStageSchema, 
  otpStageSchema, 
  resetPasswordStageSchema 
} from '../../../../schemas/forgotPasswordSchema';
import { MdCheckCircle } from "react-icons/md";

const ForgotPassword = () => {
  const [stage, setStage] = useState(1);
  const navigate = useNavigate();

  const emailFormik = useFormik({
    initialValues: { email: '' },
    validationSchema: emailStageSchema,
    onSubmit: (values) => setStage(2),
  });

  const otpFormik = useFormik({
    initialValues: { otp: '' },
    validationSchema: otpStageSchema,
    onSubmit: (values) => setStage(3),
  });

  const resetFormik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: resetPasswordStageSchema,
    onSubmit: (values) => setStage(4),
  });

  return (
    <div className="font-inter bg-[#FAFBFD]">
      {/* المرحلة الأولى: الإيميل */}
      {stage === 1 && (
        <ForgotPassWrapper 
          title="Forget password" 
          description="Enter your email for the verification proccess, we will send 4 digits code."
          buttonText="Continue"
          onSubmit={emailFormik.handleSubmit}
        >
          <div className="w-full">
            <input 
              {...emailFormik.getFieldProps('email')}
              type="email" 
              className={`w-full p-4 rounded-full border bg-[#F8FAFD] outline-none transition-all focus:bg-white focus:ring-4 focus:ring-brand-main/10 ${emailFormik.touched.email && emailFormik.errors.email ? 'border-red-500' : 'border-gray-text-dim2 '}`}
              placeholder="Enter your email" 
            />
            {emailFormik.touched.email && emailFormik.errors.email}
          </div>
        </ForgotPassWrapper>
      )}

      {/* المرحلة الثانية: OTP */}
      {stage === 2 && (
        <ForgotPassWrapper 
          title="Verification" 
          description="Enter your 4 digits code that you received on your email"
          buttonText="Verify"
          onSubmit={otpFormik.handleSubmit}
          footer={
            <div className="text-brand-main text-sm font-bold cursor-pointer hover:underline pt-2" onClick={() => console.log("Resend")}>
              Resend email
            </div>
          }
        >
          <div className="w-full">
            <input 
              {...otpFormik.getFieldProps('otp')}
              maxLength="4"
              className={`w-full p-4 rounded-full border bg-[#F8FAFD] text-center tracking-[10px] text-xl font-bold outline-none focus:bg-white focus:ring-4 focus:ring-brand-main/10 ${otpFormik.touched.otp && otpFormik.errors.otp ? 'border-red-500' : 'border-gray-text-dim2 '}`}
              placeholder="0000" 
            />
            <div className="flex justify-center">
               {otpFormik.touched.otp && otpFormik.errors.otp}
            </div>
          </div>
        </ForgotPassWrapper>
      )}

      {/* المرحلة الثالثة: الباسورد الجديد */}
      {stage === 3 && (
        <ForgotPassWrapper 
          title="New Password" 
          description="Set the new password for your account."
          buttonText="Change Password"
          onSubmit={resetFormik.handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <input 
                {...resetFormik.getFieldProps('password')}
                type="password" 
                className="w-full p-4 rounded-full border border-gray-text-dim2  bg-[#F8FAFD] outline-none focus:bg-white focus:ring-4 focus:ring-brand-main/10"
                placeholder="New Password" 
              />
              {resetFormik.touched.password && resetFormik.errors.password}
            </div>
            <div>
              <input 
                {...resetFormik.getFieldProps('confirmPassword')}
                type="password" 
                className="w-full p-4 rounded-full border border-gray-text-dim2  bg-[#F8FAFD] outline-none focus:bg-white focus:ring-4 focus:ring-brand-main/10"
                placeholder="Confirm Password" 
              />
              {resetFormik.touched.confirmPassword && resetFormik.errors.confirmPassword}
            </div>
          </div>
        </ForgotPassWrapper>
      )}

      {/* المرحلة الرابعة: النجاح */}
      {stage === 4 && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="w-24 h-24  rounded-full flex items-center justify-center mb-6">
            <MdCheckCircle className="text-[#00C853] text-7xl" />
          </div>
          <h2 className="text-2xl font-bold text-black-main-text mb-2 tracking-tight">Password changed</h2>
          <p className="text-gray-text-dim2  text-[15px] mb-10 max-w-[400px]">Your password has been changed successfully</p>
          <button 
            onClick={() => navigate('/login')} 
            className="w-full max-w-[400px] bg-brand-main hover:bg-brand-dark text-white font-bold py-4 rounded-full shadow-lg shadow-brand-main/20 transition-all active:scale-95"
          >
            Log in
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;