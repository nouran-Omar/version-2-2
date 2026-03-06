import React from 'react';
import Container from '../Container/Container';
import { FaRocket, FaArrowRight } from 'react-icons/fa';

import { HiOutlineMail } from "react-icons/hi";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { RiInstagramLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo/logo.svg';

const Footer = () => {
  return (<>
    <footer className=" pt-16 pb-8 border-t border-gray-100 relative overflow-hidden ">
        
        <div className="flex flex-col items-center mb-16 relative z-10 bg-[#FAFAFA] font-inter">
           <button className="px-7 py-4 rounded-full flex items-center gap-3 bg-gradient-to-r from-[#0913C3] to-[#FF0000] shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
             <FaRocket className="w-5 h-5 text-white" />
             <span className="font-inter font-bold text-sm md:text-[16px] text-white tracking-wide">
               Start Your Journey Now
             </span>
             <FaArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
           </button>
           <p className=" w-lg text-sm md:text-[15px] text-center text-gray-text-dim2  font-medium m-4 p-4">Join thousands of patients who have improved their heart health with Pulse AI</p>
           <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-20 text-center">
             <div>
               <p className="text-2xl md:text-[32px] font-bold text-brand-main mb-1">95%</p>
               <p className="text-sm md:text-[15px] text-gray-text-dim2  font-medium">Success Rate</p>
             </div>
             <div>
               <p className="text-2xl md:text-[32px] font-bold text-brand-main mb-1">10K+</p>
               <p className="text-sm md:text-[15px] text-gray-text-dim2  font-medium">Patients Helped</p>
             </div>
             <div>
               <p className="text-2xl md:text-[32px] font-bold text-brand-main mb-1">24/7</p>
               <p className="text-sm md:text-[15px] text-gray-text-dim2  font-medium">Support Available</p>
             </div>
             <div>
               <p className="text-2xl md:text-[32px] font-bold text-brand-main mb-1">50+</p>
               <p className="text-sm md:text-[15px] text-gray-text-dim2  font-medium">Expert Doctors</p>
             </div>
           </div>
        </div>
        
        </footer> 
<footer className="pt-24 pb-10 border-t border-gray-100 relative overflow-hidden bg-white shadow-5xl">
       

        <div className=" max-w-7xl mx-auto px-4  font-inter grid grid-cols-1  bg-white md:grid-cols-12 gap-12 md:gap-8 mb-16">
          
          <div className="md:col-span-5 flex flex-col gap-6">
             <div className="flex items-center gap-3">
               <img src={logoImg} alt="PulseX" className="w-8 h-8 object-contain" />
               <span className="text-[24px] font-bold text-main font-display tracking-tight">PulseX</span>
             </div>
             <p className="text-[16px] text-gray-text-dim2  leading-[1.6] max-w-[360px] font-inter">
               PulseX is revolutionizing cardiovascular care with advanced AI-powered monitoring, risk assessment, and personalized treatment recommendations for better heart health outcomes.
             </p>
             <p className="text-[16px] text-gray-text-dim2  font-medium italic">
               Empowering heart health through AI innovation
             </p>
          </div>
          
          <div className="hidden md:block md:col-span-1"></div>

          <div className="md:col-span-2">
            <h4 className="text-[18px] font-bold text-main mb-6 font-display">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'About', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[16px] text-gray-text-dim2  hover:text-brand-main transition-colors font-medium">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8">
               <button className="bg-brand-main text-white px-6 py-3 rounded-full text-[14px] font-medium flex items-center gap-2 hover:bg-[#282eb5] transition-colors shadow-md group">
                  <Link to="/register" className="flex items-center gap-2"> Get Started   <FaArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></Link>

               </button>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="text-[18px] font-bold text-main mb-6 font-display">Support</h4>
            <ul className="space-y-4">
              {['Documentation', 'Community'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[16px] text-gray-text-dim2  hover:text-brand-main transition-colors font-medium">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col max-w-7xl mx-auto px-4  bg-white   md:flex-row justify-between items-end border-t border-gray-100 pt-8 gap-8">
          <div className="flex items-center gap-6">
            <a href="#" className="text-main hover:text-brand-main transition-colors"> <RiInstagramLine alt="PulseX" className="w-6 h-6 object-contain" /></a>
            <a href="#" className="text-main hover:text-brand-main transition-colors"> <FaLinkedin alt="PulseX" className="w-6 h-6 object-contain" /></a>
            <a href="#" className="text-main hover:text-brand-main transition-colors"> <FaFacebookF alt="PulseX" className="w-6 h-6 object-contain" /></a>
            <a href="#" className="text-main hover:text-brand-main transition-colors"> <FaXTwitter alt="PulseX" className="w-6 h-6 object-contain" /></a>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[16px] text-main font-medium">Email</span>
            <a href="mailto:support@pulseX.health" className="text-[16px] text-gray-text-dim2  hover:text-brand-main transition-colors flex items-center gap-2">
              <div className="w-4 h-4"> <HiOutlineMail  className="w-4 h-4 object-contain" /></div>
              support@pulseX.health
            </a>
          </div>
        </div>
 
        <div className="mt-12 flex flex-col max-w-7xl mx-auto px-4  bg-white  md:flex-row justify-between items-center text-[14px] text-gray-text-dim2  pt-8 border-t border-[#757575]">
          
          <p>© 2025 PulseX. All rights reserved.</p>
          <div className="flex items-center gap-8 mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              <span>Version 2.1.0</span>
            </div>
          </div>
        </div>


    </footer></>
  );
};

export default Footer;