import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

const AnalysisPage = () => {
  const data = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 600 },
    { name: 'Thu', value: 800 },
    { name: 'Fri', value: 500 },
    { name: 'Sat', value: 900 },
    { name: 'Sun', value: 1000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">System Analysis</h2>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-blue-100 p-5 rounded-xl shadow-sm">
          <Activity className="text-blue-600 mb-2" size={20} />
          <p className="text-sm text-gray-500 font-medium">Performance</p>
          <p className="text-2xl font-bold text-blue-900">94%</p>
        </div>
        <div className="bg-white border border-blue-100 p-5 rounded-xl shadow-sm">
          <ShieldCheck className="text-blue-600 mb-2" size={20} />
          <p className="text-sm text-gray-500 font-medium">Security</p>
          <p className="text-2xl font-bold text-blue-900">Optimal</p>
        </div>
        <div className="bg-white border border-blue-100 p-5 rounded-xl shadow-sm">
          <Zap className="text-blue-600 mb-2" size={20} />
          <p className="text-sm text-gray-500 font-medium">Uptime</p>
          <p className="text-2xl font-bold text-blue-900">99.9%</p>
        </div>
      </div>

      {/* Area Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-700 mb-6">Traffic Trends</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;