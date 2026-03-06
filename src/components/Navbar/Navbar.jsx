import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiBars3, HiXMark, HiOutlineMoon } from "react-icons/hi2";
import logoImg from '../../../public/logo/logo.svg';
import { IoArrowForward } from "react-icons/io5";
import Button from './../../Button/Button';
import {  FaArrowRight } from 'react-icons/fa';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home'); // لمتابعة السيكشن الظاهر

  // 1. مراقبة الـ Scroll لتغيير شكل الـ Navbar (Shadow)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) setIsScrolled(true);
      else setIsScrolled(false);

      // 2. تحديد السيكشن النشط أثناء السكرول
      const navLinks = ['home', 'features', 'doctors', 'stories', 'about'];
      const scrollPosition = window.scrollY + 100;

      navLinks.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element && 
            scrollPosition >= element.offsetTop && 
            scrollPosition < element.offsetTop + element.offsetHeight) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Doctors', href: '#doctors' },
    { label: 'Features', href: '#features' },
    
    { label: 'Stories', href: '#stories' },
    { label: 'About', href: '#about' },
  ];

  return (
    <nav className={`h-[82px] sticky top-0 z-[100] flex items-center bg-white transition-all duration-500 ${isScrolled ? 'shadow-md border-b border-gray-100' : 'shadow-sm'}`}>
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-[80px] flex justify-between items-center">
        
        {/* اللوجو */}
        <a href="#home" className="flex items-center gap-3 cursor-pointer z-[101]">
          <img src={logoImg} alt="Logo" className="w-[32px] h-[27px]" />
          <span className="font-inter font-bold text-[18px] text-black-main-text">PulseX</span>
        </a>

        {/* لينكات الكمبيوتر - Anchor Links */}
        <div className="hidden md:flex items-center gap-[40px]">
          {navLinks.map((link) => {
            const sectionId = link.href.replace('#', '');
            const isActive = activeSection === sectionId;
            
            return (
              <a
                key={link.href}
                href={link.href}
                className={`
                  relative font-inter text-[14px] font-medium transition-all duration-300 pb-1 group cursor-pointer
                  ${isActive ? 'text-brand-main' : 'text-gray-text-dim hover:text-brand-main'}
                  after:content-[''] after:absolute after:bottom-0 after:-left-2 after:-right-2 after:h-[2px] 
                  after:bg-brand-main after:transition-all after:duration-500
                  ${isActive ? 'after:scale-x-100' : 'after:scale-x-0 group-hover:after:scale-x-100'}
                `}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* الأزرار الثابتة (Login/Register تظل صفحات مستقلة) */}
        <div className="hidden md:flex items-center gap-10">
          <button className="font-inter text-[14px] text-gray-500 hover:text-brand-main transition-colors cursor-pointer">العربية</button>
          <button className="text-gray-500 hover:text-brand-main transition-colors cursor-pointer">
            <HiOutlineMoon className="w-6 h-6" />
          </button>
          <div className="flex gap-3">
            <Button variant="outline">
              <Link to="/login" className="flex items-center gap-2">Log in </Link>
            </Button>
            <Button variant="primary">
                         <Link to="/register" className="flex items-center gap-2"> Get Started   <FaArrowRight className="w-2 h-2 transition-transform group-hover:translate-x-1" /></Link>
                           </Button>
          </div>
        </div>

        {/* زرار الموبايل */}
        <div className="md:hidden z-[101]">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-900 cursor-pointer p-2">
            {isOpen ? <HiXMark className="w-8 h-8" /> : <HiBars3 className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* قائمة الموبايل - تأثير الستارة */}
      <div className={`
        absolute top-[82px] left-0 w-full bg-white shadow-2xl md:hidden overflow-hidden transition-all duration-500 ease-in-out z-[99] border-t border-gray-100
        grid ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
      `}>
        <div className="min-h-0">
          <div className="flex flex-col p-6 gap-5">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a 
                  key={link.href} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)} 
                  className={`
                    font-semibold text-[16px] py-2 cursor-pointer transition-all duration-300
                    ${isActive ? 'text-brand-main translate-x-2' : 'text-gray-800 hover:text-brand-main hover:translate-x-2'}
                  `}
                >
                  {link.label}
                </a>
              );
            })}
            
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <span className="text-sm font-bold text-gray-900 cursor-pointer">العربية</span>
              <HiOutlineMoon className="w-6 h-6 text-gray-900 cursor-pointer" />
            </div>

            <Link 
              to="/login" 
              onClick={() => setIsOpen(false)} 
              className="text-center py-3.5 border-2 border-brand-main rounded-xl text-brand-main font-bold block w-full bg-white"
            >
              Log in
            </Link>

            <Link 
              to="/register" 
              onClick={() => setIsOpen(false)} 
              className="text-center py-3.5 bg-brand-main rounded-xl text-white font-bold block w-full shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;