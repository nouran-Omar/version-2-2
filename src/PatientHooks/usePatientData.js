// ─────────────────────────────────────────────────────
//  usePatientData  —  Mock Data Hook for Patient Dashboard
//  PulseX © 2026
// ─────────────────────────────────────────────────────

import { useState } from "react";

// ─── Static Mock Data ────────────────────────────────
const PATIENT_MOCK = {
  // ── Identity ──────────────────────────────────────
  id: "PT-20260215-001",
  name: "Mohamed",
  age: 34,
  gender: "Male",
  bloodType: "O+",
  dateOfBirth: "1992-04-10",
  phone: "+20 100 000 0001",
  email: "mohamed.salem@pulsex.io",
  avatarUrl: "",
  lastUpdated: "Sunday, February 15, 2026",

  // ── Vital Signs ───────────────────────────────────
  vitals: {
    heartRate: {
      value: 75,
      unit: "bpm",
      status: "Normal",
      trend: "+2",
      color: "#155DFC",
      gradientFrom: "#155DFC",
      gradientTo: "#5B8EFF",
    },
    bloodPressure: {
      systolic: 80,
      diastolic: 60,
      unit: "mmHg",
      display: "80/60",
      status: "Low",
      trend: "-3",
      color: "#F59E0B",
      gradientFrom: "#F59E0B",
      gradientTo: "#FCD34D",
    },
    bloodSugar: {
      value: 95,
      unit: "mg/dl",
      status: "Normal",
      trend: "+1",
      color: "#00A63E",
      gradientFrom: "#00A63E",
      gradientTo: "#34D399",
    },
    bloodCount: {
      value: 40,
      unit: "g/dl",
      status: "Normal",
      trend: "0",
      color: "#8B5CF6",
      gradientFrom: "#8B5CF6",
      gradientTo: "#C4B5FD",
    },
    oxygenLevel: {
      value: 98,
      unit: "%",
      status: "Normal",
      trend: "0",
      color: "#8B5CF6",
      gradientFrom: "#8B5CF6",
      gradientTo: "#C4B5FD",
    },
  },

  // ── Weekly Health Chart (7 days) ──────────────────
  weeklyData: [
    { day: "Mon", heartRate: 72, bloodSugar: 90, oxygenLevel: 97 },
    { day: "Tue", heartRate: 78, bloodSugar: 92, oxygenLevel: 98 },
    { day: "Wed", heartRate: 74, bloodSugar: 88, oxygenLevel: 97 },
    { day: "Thu", heartRate: 80, bloodSugar: 95, oxygenLevel: 99 },
    { day: "Fri", heartRate: 76, bloodSugar: 91, oxygenLevel: 98 },
    { day: "Sat", heartRate: 73, bloodSugar: 89, oxygenLevel: 97 },
    { day: "Sun", heartRate: 75, bloodSugar: 95, oxygenLevel: 98 },
  ],

  // ── AI Risk Score & Recommendations ───────────────
  aiRisk: {
    score: 25,
    level: "Low",
    color: "#00A63E",
    recommendations: [
      "Try to reduce foods high in saturated fat.",
      "Walk 30 mins daily.",
      "Sleep 7–8 hours.",
      "Schedule next check-up within 30 days",
    ],
  },

  // ── Featured Doctors (Dashboard) ──────────────────
  featuredDoctors: [
    {
      id: 1,
      name: "Dr. Ebrahim Moustafa",
      location: "Cairo",
      rating: 4,
      img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 2,
      name: "Dr. Jehan Osama",
      location: "Menoufia",
      rating: 4,
      img: "https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 3,
      name: "Dr. Yassin Mansour",
      location: "Giza",
      rating: 3,
      img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80",
    },
  ],

  // ── Appointments ──────────────────────────────────
  appointments: [
    {
      id: 1,
      doctor: "Dr. Ghada Adel",
      location: "Cairo",
      date: "13/12/2025",
      time: "7:00 PM",
      status: "Confirmed",
      img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=300&q=80",
    },
  ],

  // ── Recent Activity ───────────────────────────────
  recentActivity: [
    { id: 1, action: "Vitals recorded", time: "2 hours ago", icon: "heart" },
    {
      id: 2,
      action: "Health survey submitted",
      time: "1 day ago",
      icon: "survey",
    },
    {
      id: 3,
      action: "Risk assessment updated",
      time: "3 days ago",
      icon: "risk",
    },
  ],
};

// ─────────────────────────────────────────────────────
//  Hook
// ─────────────────────────────────────────────────────
const usePatientData = () => {
  const [patient] = useState(PATIENT_MOCK);
  const [isLoading] = useState(false);
  const [error] = useState(null);

  // true = patient has vitals recorded (controls dashboard state)
  const hasVitals = Boolean(patient.vitals?.heartRate?.value);

  return { patient, isLoading, error, hasVitals };
};

export default usePatientData;
