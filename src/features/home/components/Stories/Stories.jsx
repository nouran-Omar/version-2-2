import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronRight, HiChevronLeft } from "react-icons/hi2";
import { MdVerified } from "react-icons/md";
import { FaQuoteLeft } from "react-icons/fa"; // أيقونة الاقتباس المطابقة
import { LuQuote } from "react-icons/lu";
import Container from '../HomeSectionWrapper/HomeSectionWrapper';


const STORIES_DATA = [
    {
        id: 1,
        name: "Ghada Ali",
        age: "70",
        condition: "Hypertension",
        quote: "After my heart attack scare, Pulse AI became my lifeline. The AI risk assessment showed I was at high risk, but with the personalized recommendations and regular doctor follow-ups, I've reduced my risk score from 85% to just 23% in 8 months. The medication reminders and emergency QR code give me peace of mind every day.",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400",
        stats: { risk: "-62%", time: "8 months", bpm: "-15 BPM" },
        progress: 62,
        tags: ["high risk", "recovery", "lifestyle change"]
    },
    {
        id: 2,
        name: "Ghada Ali",
        age: "70",
        condition: "Hypertension",
        quote: "After my heart attack scare, Pulse AI became my lifeline. The AI risk assessment showed I was at high risk, but with the personalized recommendations and regular doctor follow-ups, I've reduced my risk score from 85% to just 23% in 8 months. The medication reminders and emergency QR code give me peace of mind every day.",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400",
        stats: { risk: "-62%", time: "8 months", bpm: "-15 BPM" },
        progress: 62,
        tags: ["High Risk", "Recovery", "Lifestyle Change"]
    },
    {
        id: 3,
        name: "Ghada Ali",
        age: "70",
        condition: "Hypertension",
        quote: "After my heart attack scare, Pulse AI became my lifeline. The AI risk assessment showed I was at high risk, but with the personalized recommendations and regular doctor follow-ups, I've reduced my risk score from 85% to just 23% in 8 months. The medication reminders and emergency QR code give me peace of mind every day.",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400",
        stats: { risk: "-62%", time: "8 months", bpm: "-15 BPM" },
        progress: 62,
        tags: ["High Risk", "Recovery", "Lifestyle Change"]
    },
    {
        id: 4,
        name: "Ahmed Hassan",
        age: "55",
        condition: "Arrhythmia",
        quote: "I never realized how irregular my heartbeat was until I used the ECG feature. The instant alerts helped me seek medical attention right before a critical episode. PulseX truly saved my life.",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
        stats: { risk: "-45%", time: "6 months", bpm: "Stable" },
        progress: 85,
        tags: ["Early Detection", "Monitoring"]
    }
];

const Stories = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        if (currentIndex < STORIES_DATA.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const story = STORIES_DATA[currentIndex];

    return (
        <section id="stories" className="py-24 bg-[#FAFAFA] overflow-hidden">
            <Container>
        <motion.div
          className="text-center mb-16 space-y-3 font-inter"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl font-bold text-black-main-text">Recovery Stories</h2>
          <p className="text-gray-text-dim2 text-lg">Real patients, real results — inspiring journeys to better heart health</p>
        </motion.div>

                <motion.div
                  className="relative max-w-[1050px] mx-auto font-inter"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                >
                    {/* الكارد الرئيسي */}
                    <div className="bg-white shadow-lg rounded-[32px] relative z-10 min-h-[480px]">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={currentIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col md:flex-row items-center h-full p-8 md:p-14 gap-12"
                            >
                                {/* الجزء الأيسر: بيانات المريض */}
                                <div className="w-full md:w-1/3 flex flex-col items-center text-center space-y-5 border-b md:border-b-0 md:border-r border-gray-100 pb-8 md:pb-0 md:pr-12">
                                    <div className="relative">
                                        <img src={story.image} alt={story.name} className="w-40 h-40 rounded-full object-cover border-[6px] border-[#F1F5F9] shadow-inner" />
                                        <div className="absolute bottom-2 right-4 w-7 h-7 bg-[#10B981] border-4 border-white rounded-full flex items-center justify-center text-white shadow-md">
                                            <MdVerified size={18} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-extrabold text-black-main-text">{story.name}</h3>
                                        <p className="text-gray-text-dim2 font-medium">Age {story.age}</p>
                                        <p className="text-brand-main font-bold text-lg">{story.condition}</p>
                                    </div>
                                    <div className="flex  justify-center text-brand-main ">
                                        {story.tags.map((tag, i) => (
                                            <span key={i} className="text-[10px] bg-blue-50/50 text-brand-main px-2 py-1 rounded-md font-bold tracking-wide">{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* الجزء الأيمن: القصة والإحصائيات */}
                                <div className="w-full md:w-2/3 space-y-8 relative">
                                    <div className="relative">
                                        <LuQuote className="text-brand-main w-12 h-12 absolute -top-8 -left-10" />
                                        <p className="text-lg text-black-main-text leading-relaxed font-medium italic">
                                            "{story.quote}"
                                        </p>
                                    </div>

                                    {/* الإحصائيات الملونة */}
                                    <div className="flex justify-between items-center py-6">
                                        <StatBlock label="Risk Reduction" value={story.stats.risk} color="text-[#059669]" />
                                        <StatBlock label="Recovery Time" value={story.stats.time} color="text-brand-main" />
                                        <StatBlock label="BPM Improved" value={story.stats.bpm} color="text-[#D97706]" />
                                    </div>

                                    {/* بار التقدم */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-bold text-gray-text-dim2 tracking-[0.15em]">Recovery Progress</span>
                                            <span className="text-sm font-bold text-black-main-text">{story.progress}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full w-full overflow-hidden">
                                            <motion.div 
                                                className="h-full rounded-full bg-brand-main"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${story.progress}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 text-[#10B981] font-bold text-xs">
                                            <MdVerified size={16} />
                                            <span>Verified Patient Story</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* أزرار التنقل الدائرية */}
                    <button onClick={prevSlide} className={`absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-text-dim2 transition-all z-20 hover:bg-brand-main hover:text-white border border-gray-100 left-[-55px] ${currentIndex === 0 ? 'opacity-0' : 'opacity-100'}`}>
                        <HiChevronLeft size={24} />
                    </button>
                    <button onClick={nextSlide} className={`absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-text-dim2 transition-all z-20 hover:bg-brand-main hover:text-white border border-gray-100 right-[-55px] ${currentIndex === STORIES_DATA.length - 1 ? 'opacity-0' : 'opacity-100'}`}>
                        <HiChevronRight size={24} />
                    </button>
                </motion.div>

                {/* المستطيلات تحت السلايدر (Dots) */}
                <div className="flex flex-col items-center mt-10 space-y-4">
                    <div className="flex gap-2">
                        {STORIES_DATA.map((_, i) => (
                            <div 
                                key={i} 
                                onClick={() => setCurrentIndex(i)}
                                className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 w-[40px] ${currentIndex === i ? 'bg-brand-main' : 'bg-gray-200 hover:bg-gray-300'}`}
                            />
                        ))}
                    </div>
                    <span className="text-gray-text-dim2 text-sm font-medium">{currentIndex + 1} of {STORIES_DATA.length} stories</span>
                </div>
            </Container>
        </section>
    );
};

const StatBlock = ({ label, value, color }) => (
    <div className="space-y-1 font-inter">
        <p className={`text-3xl font-black ${color}`}>{value}</p>
        <p className="text-[10px] text-gray-text-dim2 font-bold  tracking-widest">{label}</p>
    </div>
);

export default Stories;