import React, { useState } from 'react';
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import { MdOutlineBloodtype, MdOutlineFavorite } from 'react-icons/md';
import { LuMoonStar, LuBeer, LuActivity } from 'react-icons/lu';
import { FaSmoking, FaUsers } from 'react-icons/fa';
import PatientAIAlert from '../HeartRisk/PatientAIAlert';
import PatientNextStep from '../PatientNextStep/PatientNextStep';

/* ── reusable question block ── */
// أضفنا className كـ prop للتحكم في المساحة من الخارج
const QuestionSection = ({ icon, label, question, options, selected, onSelect, className = "flex-1" }) => (
  <div className={className}>
    <div className="flex items-center gap-2.5 text-black-main-text text-[18px] font-['Roboto'] font-semibold   mb-1.5">
      {icon} {label}
    </div>
    <p className="text-[16px] text-black-main-text/80 mb-3 ml-6">{question}</p>
    <div className="flex flex-wrap gap-3">
      {options.map(opt => {
        const active = selected === opt;
        return (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-[24px] text-[13px] font-medium border transition-all ${
              active
                ? 'border-brand-main text-black-main-text bg-white'
                : 'border-gray-200 text-black-main-text bg-white hover:border-brand-main hover:bg-[#f5f5ff]'
            }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-full border shrink-0 transition-all ${
                active
                  ? 'border-brand-main bg-brand-main shadow-[inset_0_0_0_2.5px_white]'
                  : 'border-gray-300 bg-white'
              }`}
            />
            {opt}
          </button>
        );
      })}
    </div>
  </div>
);

const PatientLifestyleSurvey = () => {
  const [formData, setFormData] = useState({
    cholesterol: '',
    sleepHours: '',
    smoking: '',
    alcohol: '',
    activity: '',
    prevIssues: '',
    familyHistory: ''
  });

  const [showResults, setShowResults] = useState(false);

  const handleSelect = (question, value) => {
    setFormData(prev => ({ ...prev, [question]: value }));
  };

  const handleSubmit = () => {
    console.log("Data to be sent to Backend:", formData);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen p-[24px] bg-white rounded-full">

      {/* Header */}
      <header className="flex items-center gap-4 mb-2 rounded-full">
        <HiOutlineClipboardDocumentList className="text-[32px] text-black-main-text shrink-0" />
        <h2 className="text-black-main-text text-[24px] font-['Roboto'] font-semibold tracking-[0.01em] break-words">Health Lifestyle Survey</h2>
      </header>
      <p className="text-[18px] text-gray-500 mb-10">
        Answer these quick questions about your daily habits to help our AI analyze your heart health baseline.
      </p>

      <div className="flex flex-col gap-10">

        {/* Q1: Cholesterol */}
        <QuestionSection
          icon={<MdOutlineBloodtype className="text-red-500" />}
          label="Cholesterol Level"
          question="Select your latest cholesterol level:"
          options={['Normal (<200 mg/dL)', 'Borderline (200–239 mg/dL)', 'High (≥240 mg/dL)']}
          selected={formData.cholesterol}
          onSelect={(v) => handleSelect('cholesterol', v)}
        />

        {/* Q2 + Q3 side by side - التعديل هنا */}
        <div className="flex gap-8 items-start">
          <QuestionSection
            className="flex-[2]" // تأخذ مساحة الضعف
            icon={<LuMoonStar className="text-purple-600" />}
            label="Sleep Hours Per Day"
            question="How many hours do you sleep per day?"
            options={['Less than 6 hours', '6–8 hours', 'More than 8 hours']}
            selected={formData.sleepHours}
            onSelect={(v) => handleSelect('sleepHours', v)}
          />
          <QuestionSection
            className="flex-[1]" // تأخذ مساحة واحدة
            icon={<FaSmoking className="text-gray-500" />}
            label="Smoking"
            question="Do you smoke?"
            options={['Yes', 'No']}
            selected={formData.smoking}
            onSelect={(v) => handleSelect('smoking', v)}
          />
        </div>

        {/* Q4 + Q5 side by side */}
        <div className="flex gap-8">
          <QuestionSection
            icon={<LuBeer className="text-blue-400" />}
            label="Alcohol Consumption"
            question="How often do you drink alcohol?"
            options={['Low', 'Medium', 'High']}
            selected={formData.alcohol}
            onSelect={(v) => handleSelect('alcohol', v)}
          />
          <QuestionSection
            icon={<LuActivity className="text-teal-500" />}
            label="Physical Activity"
            question="How active are you during the week?"
            options={['Low', 'Medium', 'High']}
            selected={formData.activity}
            onSelect={(v) => handleSelect('activity', v)}
          />
        </div>

        {/* Q6 + Q7 side by side */}
        <div className="flex gap-8">
          <QuestionSection
            icon={<MdOutlineFavorite className="text-red-600" />}
            label="Previous Heart Issues"
            question="Have you ever had any heart-related issues before?"
            options={['Yes', 'No']}
            selected={formData.prevIssues}
            onSelect={(v) => handleSelect('prevIssues', v)}
          />
          <QuestionSection
            icon={<FaUsers className="text-stone-600" />}
            label="Family History"
            question="Has anyone in your family had heart-related diseases?"
            options={['Yes', 'No']}
            selected={formData.familyHistory}
            onSelect={(v) => handleSelect('familyHistory', v)}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-center pt-4 pb-8 mt-20">
          <button
            className="px-14 py-3.5 rounded-[28px] bg-brand-main hover:bg-[#2830d4] text-white text-[14px] font-semibold shadow-[0_4px_12px_rgba(51,60,245,0.25)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(51,60,245,0.35)] transition-all cursor-pointer"
            onClick={handleSubmit}
          >
            View Results
          </button>
        </div>
      </div>

      {/* Results */}
      {showResults && (
    <div className="mt-16 flex flex-col items-center justify-center w-full space-y-12">
  {/* العنصر الأول */}
  <div className="w-full p-5 flex justify-center">
    <PatientAIAlert />
  </div>

  {/* العنصر الثاني */}
  <div className="w-full p-5 flex justify-center">
    <PatientNextStep />
  </div>
</div>
      )}
    </div>
  );
};

export default PatientLifestyleSurvey;
