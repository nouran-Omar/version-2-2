import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserDoctor } from 'react-icons/fa6';
import { HiUsers, HiOutlineLocationMarker, HiChevronLeft, HiChevronRight, HiStar, HiSearch } from 'react-icons/hi';
import { MdStars, MdMonitor } from 'react-icons/md';

/* ─── Mock Data ─── */
const ALL_DOCTORS = [
  { id: 1,  name: 'Dr. Walid Ali',      loc: 'Cairo',      rate: 5, reviews: 124, price: 200, img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&q=80' },
  { id: 2,  name: 'Dr. Tamer Megahd',   loc: 'Giza',       rate: 4, reviews: 124, price: 80,  img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&q=80' },
  { id: 3,  name: 'Dr. Jehan Osama',    loc: 'Menoufia',   rate: 4, reviews: 124, price: 400, img: 'https://images.unsplash.com/photo-1559839734-2b71f1536780?w=300&q=80' },
  { id: 4,  name: 'Dr. Ali Ramez',      loc: 'Cairo',      rate: 3, reviews: 124, price: 300, img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&q=80' },
  { id: 5,  name: 'Dr. Noha Ahmed',     loc: 'Alexandria', rate: 3, reviews: 124, price: 80,  img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&q=80' },
  { id: 6,  name: 'Dr. Zena Mahmoud',   loc: 'Fayoum',     rate: 2, reviews: 124, price: 120, img: 'https://images.unsplash.com/photo-1623854767233-243a6496667a?w=300&q=80' },
  { id: 7,  name: 'Dr. Ahmed Hassan',   loc: 'Cairo',      rate: 5, reviews: 210, price: 150, img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&q=80' },
  { id: 8,  name: 'Dr. Sara Khalil',    loc: 'Giza',       rate: 4, reviews: 85,  price: 100, img: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=300&q=80' },
  { id: 9,  name: 'Dr. Layla Ibrahim',  loc: 'Alexandria', rate: 5, reviews: 176, price: 250, img: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=300&q=80' },
  { id: 10, name: 'Dr. Omar Farouk',    loc: 'Cairo',      rate: 4, reviews: 95,  price: 180, img: 'https://images.unsplash.com/photo-1605684954998-685c79d6a018?w=300&q=80' },
  { id: 11, name: 'Dr. Mona Saeed',     loc: 'Giza',       rate: 3, reviews: 60,  price: 70,  img: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=300&q=80' },
  { id: 12, name: 'Dr. Khaled Mansour', loc: 'Menoufia',   rate: 5, reviews: 310, price: 350, img: 'https://images.unsplash.com/photo-1638202993928-7d113b8e4519?w=300&q=80' },
];

const LOCATIONS  = ['All', ...new Set(ALL_DOCTORS.map(d => d.loc))];
const PRICE_RANGES = [
  { label: 'All',        min: 0,   max: Infinity },
  { label: '$0–$100',    min: 0,   max: 100 },
  { label: '$100–$200',  min: 100, max: 200 },
  { label: '$200+',      min: 200, max: Infinity },
];
const PER_PAGE = 6;

/* ─── Star Row ─── */
const Stars = ({ rate }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <HiStar key={i} className={i <= rate ? 'text-yellow-400 text-sm' : 'text-gray-200 text-sm'} />
    ))}
  </div>
);

/* ─── Doctor Card ─── */
const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center gap-2 hover:shadow-md transition">
      <img
        src={doctor.img} alt={doctor.name}
        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${doctor.name}&background=E8EAF6&color=333CF5`; }}
      />
      <h3 className="text-sm font-bold text-black-main-text mt-1">{doctor.name}</h3>
      <div className="flex items-center gap-1 text-xs text-[#757575]">
        <HiOutlineLocationMarker className="text-[#757575]" /> {doctor.loc}
      </div>
      <div className="flex items-center gap-1.5 ">
        <Stars className='text-[#FACC15]' rate={doctor.rate} />
        <span className="text-xs text-[#757575]">({doctor.reviews} reviews)</span>
      </div>
      <p className="text-sm text-gray-600 mt-1">
        <span className="text-lg font-bold text-black-main-text">${doctor.price}</span>
        <span className="text-[#757575]"> / session</span>
      </p>
      <button
        onClick={() => navigate(`/patient/doctor-profile/${doctor.id}`)}
        className="w-full mt-2 py-2.5 rounded-xl bg-brand-main text-white text-sm font-semibold hover:bg-[#2730d4] transition"
      >
        Book Now
      </button>
    </div>
  );
};

/* ─── Main Component ─── */
const PatientDoctorList = () => {
  const [page,       setPage]       = useState(1);
  const [search,     setSearch]     = useState('');
  const [location,   setLocation]   = useState('All');
  const [priceRange, setPriceRange] = useState(0); // index into PRICE_RANGES
  const [rating,     setRating]     = useState('all'); // 'all' | '5' | '4' | '3'

  const filtered = useMemo(() => {
    const pr = PRICE_RANGES[priceRange];
    return ALL_DOCTORS.filter(d => {
      const matchName  = d.name.toLowerCase().includes(search.toLowerCase());
      const matchLoc   = location === 'All' || d.loc === location;
      const matchPrice = d.price >= pr.min && d.price < pr.max;
      const matchRate  = rating === 'all' || d.rate >= parseInt(rating);
      return matchName && matchLoc && matchPrice && matchRate;
    });
  }, [search, location, priceRange, rating]);

  const totalPages   = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage     = Math.min(page, totalPages);
  const visible      = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  /* page numbers to show (max 4 visible like design) */
  const pageNums = Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 4);

  return (
    <div className="min-h-screen sm:p-5 lg:p-5">

      {/* ── Header ── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <FaUserDoctor className="text-xl text-black-main-text" />
          <h1 className="text-xl font-bold text-black-main-text">Doctor List</h1>
        </div>
        <p className="text-sm text-[#757575]">Find and connect with heart specialists easily.</p>
      </div>

      {/* ── Stats Bar ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 mb-6 flex flex-wrap items-center gap-6 sm:gap-10">
        <div className="flex items-center gap-4 ml-3">
          <div className="w-15 h-15 p-2 rounded-full  flex items-center justify-center"
          style={{background: 'linear-gradient(201deg, #D3FFE7 0%, #EFFFF6 100%)'}}
          >
            <HiUsers className="text-[#00AC4F] text-2xl" />
          </div>
          <div>
            <p className="text-xs text-[#ACACAC]">Total Doctors</p>
            <p className="text-2xl font-bold text-brand-main">{ALL_DOCTORS.length}</p>
          </div>
        </div>

        <div className="w-px h-10 bg-gray-100 hidden sm:block" />

        <div className="flex items-center gap-4 ml-3">
          <div className="w-15 h-15 p-2 rounded-full  flex items-center justify-center"
          style={{background: 'linear-gradient(201deg, #D3FFE7 0%, #EFFFF6 100%)'}}
          > <MdStars className="text-[#00AC4F] text-2xl" />
          </div>
          <div>
            <p className="text-xs text-[#ACACAC]">Top Rated Specialist</p>
            <p className="text-2xl font-bold text-[#FACC15]">89%</p>
          </div>
        </div>

        <div className="w-px h-10 bg-gray-100 hidden sm:block" />
  <div className="flex items-center gap-4 ml-3">
          <div className="w-15 h-15 p-2 rounded-full  flex items-center justify-center"
          style={{background: 'linear-gradient(201deg, #D3FFE7 0%, #EFFFF6 100%)'}}
          > <MdMonitor className="text-[#00AC4F] text-2xl" />
          </div>
          <div>
            <p className="text-xs text-[#ACACAC]">Active Now</p>
            <p className="text-2xl font-bold text-[#7939FF]">32</p>
          </div>
        </div>
      </div>

{/* ── Filter & Search Bar ── */}
<div className="flex flex-wrap items-center gap-2 mb-6 bg-[#F1F2F5] p-3 lg:p-5 rounded-lg">
  {/* Rating */}
  <div className="flex items-center gap-1.5 text-xs lg:text-sm text-black-main-text">
    <span className="font-medium whitespace-nowrap">Rating:</span>
    <select
      value={rating} onChange={(e) => { setRating(e.target.value); setPage(1); }}
      className="border text-[#757575B2] border-gray-200 rounded-lg px-2 py-1 lg:px-3 lg:py-1.5 text-xs lg:text-sm bg-white outline-none focus:border-brand-main cursor-pointer"
    >
      <option value="all">Highest Rated</option>
      <option value="5">5 Stars</option>
      <option value="4">4+ Stars</option>
      <option value="3">3+ Stars</option>
    </select>
  </div>

  {/* Location */}
  <div className="flex items-center gap-1.5 text-xs lg:text-sm text-black-main-text">
    <span className="font-medium whitespace-nowrap">Location:</span>
    <select
      value={location} onChange={(e) => { setLocation(e.target.value); setPage(1); }}
      className="border border-gray-200 rounded-lg px-2 py-1 lg:px-3 lg:py-1.5 text-xs lg:text-sm bg-white outline-none focus:border-brand-main cursor-pointer"
    >
      {LOCATIONS.map(l => <option key={l}>{l}</option>)}
    </select>
  </div>

  {/* Price Range */}
  <div className="flex items-center gap-1.5 text-xs lg:text-sm text-black-main-text">
    <span className="font-medium whitespace-nowrap">Price Range:</span>
    <select
      value={priceRange} onChange={(e) => { setPriceRange(Number(e.target.value)); setPage(1); }}
      className="border border-gray-200 rounded-lg px-2 py-1 lg:px-3 lg:py-1.5 text-xs lg:text-sm bg-white outline-none focus:border-brand-main cursor-pointer"
    >
      {PRICE_RANGES.map((r, i) => <option key={r.label} value={i}>{r.label}</option>)}
    </select>
  </div>

  {/* Search */}
  <div className="flex items-center gap-1.5 border border-gray-200 rounded-xl px-2 py-1 lg:px-3 lg:py-1.5 bg-white ml-auto w-full sm:w-auto">
    <HiSearch className="text-gray-400 text-sm lg:text-base shrink-0" />
    <input
      type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
      placeholder="Search by name"
      className="text-xs lg:text-sm outline-none bg-transparent text-black-main-text placeholder:text-gray-400 w-full sm:w-32 lg:w-40"
    />
  </div>
</div>

      {/* ── Doctor Grid ── */}
      {visible.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {visible.map(doc => <DoctorCard key={doc.id} doctor={doc} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <p className="text-base font-semibold">No doctors found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => goTo(safePage - 1)} disabled={safePage === 1}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 bg-white text-gray-500 hover:border-brand-main hover:text-brand-main disabled:opacity-40 transition"
          >
            <HiChevronLeft />
          </button>

          {pageNums.map(n => (
            <button
              key={n} onClick={() => goTo(n)}
              className={`w-8 h-8 rounded-full text-sm font-semibold transition
                ${safePage === n
                  ? 'bg-brand-main text-white shadow'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-main hover:text-brand-main'}`}
            >
              {n}
            </button>
          ))}

          <button
            onClick={() => goTo(safePage + 1)} disabled={safePage === totalPages}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 bg-white text-gray-500 hover:border-brand-main hover:text-brand-main disabled:opacity-40 transition"
          >
            <HiChevronRight />
          </button>
        </div>
      )}

    </div>
  );
};

export default PatientDoctorList;


