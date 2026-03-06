import React from 'react';
import Hero from '../../components/Hero/Hero';
import Doctors from '../../components/Doctors/Doctors';
import Features from '../../components/Features/Features';
import Stories from '../../components/Stories/Stories';
import About from '../../components/JourneyTimeline/JourneyTimeline';

const Home = () => {
  return (
    <main className="overflow-hidden bg-[#FAFAFA]">
      <Hero />
      <Doctors />
      <Features />
      <Stories />
      <About />
    </main>
  );
};

export default Home;