import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { day: 'Mon', value: 30 },
  { day: 'Tue', value: 85 },
  { day: 'Wed', value: 45 },
  { day: 'Thu', value: 90 },
  { day: 'Fri', value: 55 },
  { day: 'Sat', value: 20 },
  { day: 'Sun', value: 95 },
];

const PatientWeeklyChart = () => {
  return (
    /* تم تغيير max-w-2xl إلى max-w-md لتصغير العرض الإجمالي */
    <div className="w-full max-w-2xl   md:rounded-[32px] md:p-6 ">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4 md:mb-6">
        <div>
          <h2 className="text-[16px] md:text-[18px] font-bold text-black-main-text leading-tight">
            Weekly Health Overview
          </h2>
          <p className="text-[11px] md:text-[12px] text-[#757575] mt-1">
            Analyze your heart health trends
          </p>
        </div>
        <span className="text-[11px] md:text-[12px] text-[#757575] whitespace-nowrap ml-2">
          This Week
        </span>
      </div>

      {/* Chart Container */}
      <div className="h-[200px] md:h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4850E9" stopOpacity={1} />
                <stop offset="100%" stopColor="rgba(69.42, 207.65, 238, 0.01)" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#7D7D7D', fontSize: 10 }}
              dy={10}
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              interval={0} 
              domain={[0, 100]} 
              ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
              tick={{ fill: '#7D7D7D', fontSize: 10 }}
            />

            <Tooltip 
              cursor={{ stroke: '#4850E9', strokeWidth: 1, strokeDasharray: '4 4' }}
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                fontSize: '11px'
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#4850E9"
              strokeWidth={0}
              fillOpacity={1}
              fill="url(#chartGradient)"
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PatientWeeklyChart;
