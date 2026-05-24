import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, MapPin, User, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/api";

export const Timetable = () => {
  const { user } = useAuth();
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const [selectedDay, setSelectedDay] = useState("Monday");

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const parts = timeStr.split(":");
    if (parts.length !== 2) return timeStr;
    const hours = parts[0];
    const minutes = parts[1].padEnd(2, '0');
    return `${hours}:${minutes}`;
  };

  // Fetch approved timetable for current user's class
  const { data: timetable, isLoading } = useQuery({
    queryKey: ['approved-timetable', user?.class?._id],
    queryFn: async () => {
      if (!user?.class?._id) return null;
      const res = await api.get(`/timetables/class/${user.class._id}?section=${user.class.section}`);
      return res.data.data;
    },
    enabled: !!user?.class?._id
  });

  const currentDaySchedule = useMemo(() => {
    if (!timetable || !timetable.rows) return [];
    return timetable.rows.filter(row => row.day?.toLowerCase() === selectedDay?.toLowerCase());
  }, [timetable, selectedDay]);

  if (!user?.class?._id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">No Class Assigned</h2>
        <p className="text-slate-500 mt-2">You must be assigned to a class to view the timetable.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Weekly Timetable</h1>
          <div className="flex items-center gap-2">
            <Badge variant="primary">Approved</Badge>
            <p className="text-slate-500">{user?.class?.name} - Section {user?.class?.section}</p>
          </div>
        </div>

        {/* Day Selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedDay === day 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              {selectedDay}'s Classes
            </h2>
            <div className="space-y-3">
              {isLoading ? (
                <div className="py-12 text-center text-slate-400 flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <p>Loading official timetable...</p>
                </div>
              ) : currentDaySchedule.length > 0 ? (
                currentDaySchedule.map((cls, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all"
                  >
                    <div className="text-center min-w-[100px] border-r border-slate-100 pr-4">
                      <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                        <Clock className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase">Period {cls.period}</span>
                      </div>
                      <p className="text-sm font-black text-slate-900">{formatTime(cls.startTime)}</p>
                      <p className="text-xs text-slate-400 font-medium">{formatTime(cls.endTime)}</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-slate-900">{cls.subject}</h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                        <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded">
                          <User className="w-3 h-3 text-slate-400" />
                          <span className="text-slate-700">{cls.teacher}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="text-slate-700">Room {cls.room}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-16 text-center border-2 border-dashed border-slate-50 rounded-2xl">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-medium italic">No classes scheduled for {selectedDay}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-slate-100 text-slate-600",
    primary: "bg-blue-100 text-blue-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${variants[variant]}`}>{children}</span>;
};
