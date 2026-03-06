import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineBanknotes, HiOutlineCreditCard, HiCheckCircle } from 'react-icons/hi2';
import { HiOutlineUser, HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi';
import { MdSecurity, MdPayment } from 'react-icons/md';

const PatientPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  /* data passed from Booking page */
  const bookingData = location.state || {
    doctorName: 'Dr. Walid Ali', doctorTitle: 'Cardiologist',
    date: 'Oct 15, 2025', time: '05:30 PM', price: 200
  };

  const [method,    setMethod]    = useState('cash');
  const [success,   setSuccess]   = useState(false);
  const [cardData,  setCardData]  = useState({ name: '', number: '', expiry: '', cvv: '' });
const handlePay = (e) => {
    e.preventDefault();
    if (method === 'credit') {
      if (!cardData.name || cardData.number.replace(/\s/g, '').length < 16 || !cardData.expiry || !cardData.cvv) {
        alert('Please fill in all card details!');
        return;
      }
    }
    setSuccess(true);
  };

  /* ── Success Modal ── */
  if (success) {
    const isCash = method === 'cash';
    return (
      <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
        {/* الخلفية المظلمة (Overlay) */}
        <div className="absolute inset-0 bg-black/60 " onClick={() => setSuccess(false)} />
        
        {/* جسم المودال */}
        <div className="relative bg-white rounded-[28px] shadow-2xl p-8 max-w-sm w-full flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
          
          {/* دائرة الأيقونة باللون الأخضر للنجاح أو الأزرق حسب التصميم */}
          <div className="w-20 h-20 rounded-full bg-[#ECFDF5] flex items-center justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-[#10B981] flex items-center justify-center shadow-lg shadow-[#10B98140]">
              <HiCheckCircle className="text-white text-4xl" />
            </div>
          </div>

          <h2 className="text-[22px] font-bold text-black-main-text mb-3">
            {isCash ? 'Booking Confirmed' : 'Payment Successful'}
          </h2>
          
          <p className="text-[14px] text-gray-500 leading-relaxed mb-8 px-2">
            {isCash
              ? 'Your appointment has been successfully booked. You can pay at the clinic.'
              : 'Your payment has been processed successfully. Thank you for your purchase.'}
          </p>

          <div className="flex flex-col gap-3 w-full">
            {/* زرار الرسائل - اللون الأساسي */}
          
            
            {/* زرار المواعيد - شفاف مع بوردر */}
            <button
              onClick={() => navigate('/patient/appointments')}
              className="w-full py-3.5 bg-brand-main rounded-full border border-gray-200 text-white font-bold text-[15px] hover:bg-[darken(#333CF5, 5%)] transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  sm:p-6 lg:p-8">

      {/* ── Title ── */}
      <div className="flex items-center gap-2 mb-6">
        <MdPayment className="text-xl text-black-main-text" />
        <h1 className="text-xl font-bold text-black-main-text">Select Payment Method</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── LEFT: Payment Methods ── */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Cash */}
          <div
            onClick={() => setMethod('cash')}
            className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition
              ${method === 'cash' ? 'border-brand-main bg-[#EEF0FF]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${method === 'cash' ? 'bg-brand-main/10' : 'bg-gray-100'}`}>
              <HiOutlineBanknotes className={`text-xl ${method === 'cash' ? 'text-brand-main' : 'text-gray-500'}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-black-main-text">Cash at Clinic</h3>
              <p className="text-xs text-gray-400 mt-0.5">Pay directly at the clinic during your visit</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition
              ${method === 'cash' ? 'border-brand-main' : 'border-gray-300'}`}>
              {method === 'cash' && <div className="w-2.5 h-2.5 rounded-full bg-brand-main" />}
            </div>
          </div>

          {/* Credit / Debit */}
          <div
            onClick={() => setMethod('credit')}
            className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition
              ${method === 'credit' ? 'border-brand-main bg-[#EEF0FF]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${method === 'credit' ? 'bg-brand-main/10' : 'bg-gray-100'}`}>
              <HiOutlineCreditCard className={`text-xl ${method === 'credit' ? 'text-brand-main' : 'text-gray-500'}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-black-main-text">Credit / Debit Card</h3>
              <p className="text-xs text-gray-400 mt-0.5">Pay securely with your credit or debit card</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition
              ${method === 'credit' ? 'border-brand-main' : 'border-gray-300'}`}>
              {method === 'credit' && <div className="w-2.5 h-2.5 rounded-full bg-brand-main" />}
            </div>
          </div>

          {/* Card Form — only for credit */}
          {method === 'credit' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-black-main-text">Card Holder Name</label>
                <input
                  type="text" placeholder="John Doe"
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-main transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-black-main-text">Card Number</label>
                <input
                  type="text" placeholder="1234 5678 9012 3456" maxLength="19"
                  value={cardData.number}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                    const formatted = v.match(/.{1,4}/g)?.join(' ') || v;
                    setCardData({ ...cardData, number: formatted });
                  }}
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-main transition tracking-widest"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-black-main-text">Expiry Date</label>
                  <input
                    type="text" placeholder="MM/YY" maxLength="5"
                    value={cardData.expiry}
                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-main transition"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-black-main-text">CVV</label>
                  <input
                    type="password" placeholder="123" maxLength="3"
                    value={cardData.cvv}
                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-main transition"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <MdSecurity className="text-green-500 shrink-0" />
                Your payment information is encrypted and secure
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Booking Summary ── */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-black-main-text mb-4">Booking Summary</h2>

            <div className="flex flex-col gap-4">
            <SummaryRow 
  iconClass="bg-[#3B5BFE1A]  text-[#3B5BFE]" // الكلاسات دي هتروح للأيقونة بس
  icon={<HiOutlineUser />} 
  label="Doctor"
>
  <p className="text-sm font-semibold text-black-main-text">{bookingData.doctorName}</p>
  <p className="text-xs text-[#757575]">{bookingData.doctorTitle}</p>
</SummaryRow>
              <div className="h-px " />
              <SummaryRow icon={<HiOutlineCalendar className='text-[#757575]' />} label="Date">
                <p className="text-sm font-semibold text-black-main-text">{bookingData.date}</p>
              </SummaryRow>
              <div className="h-px " />
              <SummaryRow icon={<HiOutlineClock className='text-[#757575]' />} label="Time">
                <p className="text-sm font-semibold text-black-main-text">{bookingData.time}</p>
              </SummaryRow>
              <div className="h-px" />
              <SummaryRow icon={<HiOutlineCreditCard className='text-[#757575]'/>} label="Payment Method">
                <p className="text-sm font-semibold text-black-main-text">{method === 'cash' ? 'Cash at Clinic' : 'Credit Card'}</p>
              </SummaryRow>
              <div className="h-px " />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-black-main-text">Total Amount</span>
                <span className="text-lg font-bold text-black-main-text">${bookingData.price}.00</span>
              </div>
            </div>

            <button
              onClick={handlePay}
              className="w-full mt-5 py-3 rounded-xl bg-brand-main text-white font-semibold text-sm hover:bg-[#2730d4] transition"
            >
              Pay Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

const SummaryRow = ({ icon, label, children, iconClass }) => (
  <div className="flex items-start gap-3">
    {/* ضيفنا الـ iconClass هنا جوه كلاسات الأيقونة */}
    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-[#3B5BFE] ${iconClass || ''}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-[#757575]">{label}</p>
      {children}
    </div>
  </div>
);

export default PatientPayment;
