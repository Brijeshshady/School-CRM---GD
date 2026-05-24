import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Filter,
  BookOpen,
  Award,
  ChevronRight,
  X,
  MessageSquare,
  Briefcase,
  GraduationCap,
  Target,
  Lightbulb
} from "lucide-react";
import { mockCareers } from "../../data/mockData";
export const CareerOptions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStream, setSelectedStream] = useState("all");
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const handleSelectCareer = (career) => {
    setLoadingId(career.id);
    setTimeout(() => {
      setSelectedCareer(career);
      setLoadingId(null);
    }, 600); // 600ms premium transition callback
  };

  const streams = ["all", "Science", "Commerce", "Arts", "Technology", "Design", "Vocational"];
  const filteredCareers = mockCareers.filter((career) => {
    const matchesSearch = career.title.toLowerCase().includes(searchQuery.toLowerCase()) || career.description.toLowerCase().includes(searchQuery.toLowerCase()) || career.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStream = selectedStream === "all" || career.stream === selectedStream;
    return matchesSearch && matchesStream;
  });
  const getDemandColor = (demand) => {
    switch (demand) {
      case "High":
        return "text-green-600 bg-green-100";
      case "Medium":
        return "text-orange-600 bg-orange-100";
      case "Low":
        return "text-slate-600 bg-slate-100";
      default:
        return "text-slate-600 bg-slate-100";
    }
  };
  const getStreamColor = (stream) => {
    const colors = {
      Science: "bg-blue-100 text-blue-700",
      Commerce: "bg-green-100 text-green-700",
      Arts: "bg-purple-100 text-purple-700",
      Technology: "bg-teal-100 text-teal-700",
      Design: "bg-pink-100 text-pink-700",
      Vocational: "bg-orange-100 text-orange-700"
    };
    return colors[stream] || "bg-slate-100 text-slate-700";
  };
  return <div className="min-h-screen bg-slate-50">
      {
    /* Hero Section */
  }
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center max-w-3xl mx-auto"
  >
            <h1 className="text-4xl font-bold mb-4">Explore Your Future Career</h1>
            <p className="text-lg text-blue-100 mb-8">
              Discover careers based on your interests, subjects, and aspirations. 
              Find the right path that matches your strengths and goals.
            </p>
          </motion.div>

          {
    /* Search Bar */
  }
          <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="max-w-2xl mx-auto"
  >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
    type="text"
    placeholder="Search by career, skills, or subjects..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-12 pr-4 py-4 rounded-xl text-slate-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
  />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {
    /* Filters */
  }
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button
    onClick={() => setShowFilters(!showFilters)}
    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
  >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <div className="text-sm text-slate-500">
              Showing {filteredCareers.length} of {mockCareers.length} careers
            </div>
          </div>

          {
    /* Stream Filter */
  }
          <div className="flex gap-2 flex-wrap">
            {streams.map((stream) => <button
    key={stream}
    onClick={() => setSelectedStream(stream)}
    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${selectedStream === stream ? "bg-blue-600 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"}`}
  >
                {stream === "all" ? "All Streams" : stream}
              </button>)}
          </div>
        </div>

        {
    /* Career Cards Grid */
  }
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((career, index) => {
            const isLoading = loadingId === career.id;
            return <motion.div
              key={career.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => !isLoading && handleSelectCareer(career)}
              className="relative bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group overflow-hidden"
            >
              {isLoading && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-[1.5px] z-10 flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-semibold text-blue-600">Analyzing career path...</span>
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                  {career.icon}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDemandColor(career.demand)}`}>
                  {career.demand} Demand
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                {career.title}
              </h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                {career.description}
              </p>

              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs px-2 py-1 rounded ${getStreamColor(career.stream)}`}>
                  {career.stream}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-700">{career.salaryRange}</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {career.skills.slice(0, 3).map((skill, idx) => <span key={idx} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                    {skill}
                  </span>)}
                {career.skills.length > 3 && <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                    +{career.skills.length - 3} more
                  </span>}
              </div>

              <button className="w-full py-2 bg-slate-50 text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-50 transition-all flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white">
                View Details
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>;
          })}
        </div>

        {filteredCareers.length === 0 && <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 text-lg">No careers found matching your criteria</p>
            <p className="text-slate-400 text-sm mt-2">Try adjusting your filters or search terms</p>
          </div>}
      </div>

      {
    /* Career Details Modal */
  }
      <AnimatePresence>
        {selectedCareer && <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={() => setSelectedCareer(null)}
  >
            <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: 20 }}
    onClick={(e) => e.stopPropagation()}
    className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
  >
              {
    /* Modal Header */
  }
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-6 relative">
                <button
    onClick={() => setSelectedCareer(null)}
    className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
  >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-4xl">
                    {selectedCareer.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{selectedCareer.title}</h2>
                    <p className="text-blue-100">{selectedCareer.description}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className={`text-xs px-3 py-1 rounded-full bg-white/20`}>
                        {selectedCareer.stream}
                      </span>
                      <span className="text-sm font-semibold">{selectedCareer.salaryRange}</span>
                      <span className={`text-xs px-3 py-1 rounded-full ${getDemandColor(selectedCareer.demand)}`}>
                        {selectedCareer.demand} Demand
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {
    /* Modal Content */
  }
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="space-y-6">
                  {
    /* Required Subjects */
  }
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      Required Subjects
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCareer.requiredSubjects.map((subject, idx) => <span key={idx} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                          {subject}
                        </span>)}
                    </div>
                  </div>

                  {
    /* Key Skills */
  }
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      Key Skills Required
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCareer.skills.map((skill, idx) => <span key={idx} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                          {skill}
                        </span>)}
                    </div>
                  </div>

                  {
    /* Education Path */
  }
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-green-600" />
                      Education Path
                    </h3>
                    <div className="space-y-2">
                      {selectedCareer.educationPath.map((step, idx) => <div key={idx} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">
                            {idx + 1}
                          </div>
                          <p className="text-slate-700">{step}</p>
                        </div>)}
                    </div>
                  </div>

                  {
    /* Entrance Exams */
  }
                  {selectedCareer.entranceExams && selectedCareer.entranceExams.length > 0 && <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5 text-orange-600" />
                        Entrance Exams
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCareer.entranceExams.map((exam, idx) => <span key={idx} className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium">
                            {exam}
                          </span>)}
                      </div>
                    </div>}

                  {
    /* Related Courses */
  }
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-teal-600" />
                      Recommended Courses
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedCareer.relatedCourses.map((course, idx) => <div key={idx} className="px-3 py-2 bg-teal-50 border border-teal-200 text-teal-700 rounded-lg text-sm">
                          {course}
                        </div>)}
                    </div>
                  </div>

                  {
    /* Action Buttons */
  }
                  <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Talk to Career Counselor
                    </button>
                    <button className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      View Similar Careers
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </div>;
};
