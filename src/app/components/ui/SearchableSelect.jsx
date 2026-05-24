import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Search, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const SearchableSelect = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Select option...", 
  label,
  loading = false,
  error = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);

  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchQuery("");
  };

  const clearSelection = (e) => {
    e.stopPropagation();
    onChange("");
    setSearchQuery("");
  };

  return (
    <div className="space-y-1.5 w-full" ref={containerRef}>
      {label && (
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-5 py-4 bg-slate-50 border-2 transition-all rounded-2xl text-left group ${isOpen ? 'border-indigo-500 bg-white ring-4 ring-indigo-500/5' : 'border-transparent hover:border-slate-200 focus:border-indigo-500'}`}
        >
          <div className="flex-1 truncate">
            {selectedOption ? (
              <span className="font-bold text-slate-900">{selectedOption.label}</span>
            ) : (
              <span className="text-slate-400 font-medium">{placeholder}</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {value && (
              <div 
                onClick={clearSelection}
                className="p-1 hover:bg-slate-200 rounded-md transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </div>
            )}
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : 'group-hover:text-slate-600'}`} />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute z-[100] mt-3 w-full bg-white border border-slate-200 rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search options..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-900 focus:ring-0 placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto p-2 space-y-1 scrollbar-hide">
                {loading ? (
                  <div className="flex items-center justify-center py-10 gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Searching options...</span>
                  </div>
                ) : filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group ${value === option.value ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'}`}
                    >
                      <span className="font-bold text-sm">{option.label}</span>
                      {value === option.value && <Check className="w-4 h-4" />}
                    </button>
                  ))
                ) : (
                  <div className="py-10 text-center">
                    <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No options found</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">{error}</p>}
    </div>
  );
};
