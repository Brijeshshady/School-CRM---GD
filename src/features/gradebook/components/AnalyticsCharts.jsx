import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Card } from '../../../components/ui/Card';
import { Award, TrendingUp, AlertTriangle } from 'lucide-react';

export const AnalyticsCharts = ({ analyticsData }) => {
  const { averages = [], trends = [], weakSubjects = [] } = analyticsData || {};

  return (
    <div className="space-y-8">
      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Trend */}
        <Card className="p-6 bg-white rounded-[2rem] shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Academic Progression Trend</h3>
              <p className="text-xs text-slate-400">Chronological average across examination terms</p>
            </div>
          </div>
          
          <div className="h-72">
            {trends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="exam" stroke="#94a3b8" fontSize={11} fontWeight={600} />
                  <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ background: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                    labelClassName="font-bold text-xs"
                  />
                  <Area type="monotone" dataKey="average" name="Average %" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTrend)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <p className="text-sm font-semibold">Insufficient progression data</p>
                <p className="text-xs">Publish grades across multiple exam types to view trend graphs.</p>
              </div>
            )}
          </div>
        </Card>

        {/* Subject wise Performance */}
        <Card className="p-6 bg-white rounded-[2rem] shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Subject Averages</h3>
              <p className="text-xs text-slate-400">Overall average percentage scored per subject</p>
            </div>
          </div>

          <div className="h-72">
            {averages.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={averages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="subject" stroke="#94a3b8" fontSize={10} fontWeight={600} />
                  <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ background: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                  />
                  <Bar dataKey="average" name="Avg Score" fill="#10b981" radius={[8, 8, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <p className="text-sm font-semibold">No subject-wise performance data</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Weak Subjects & Academic Interventions */}
      {weakSubjects.length > 0 && (
        <Card className="p-6 bg-rose-50/50 rounded-[2rem] border border-rose-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-rose-600 animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-rose-900">Academic Interventions Needed</h3>
              <p className="text-xs text-rose-600 font-medium">Subjects that currently require supplementary support</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weakSubjects.map((sub, index) => (
              <div key={index} className="bg-white p-4 rounded-2xl border border-rose-100 flex items-center justify-between shadow-sm">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{sub.subject}</h4>
                  <span className="inline-block mt-1 text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                    {sub.status}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-xl font-black text-rose-600">{sub.average}%</span>
                  <span className="text-[10px] text-slate-400 font-bold">Class average target: 65%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
