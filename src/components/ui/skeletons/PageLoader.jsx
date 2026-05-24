import { useState, useEffect } from "react";
import { LoadingSpinner } from "../LoadingSpinner";

export const PageLoader = ({ text = "Loading..." }) => {
  const [showSlowMessage, setShowSlowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSlowMessage(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-8">
      <LoadingSpinner size="lg" className="mb-4" />
      <div className="text-center">
        <p className="text-slate-500 font-medium animate-pulse">{text}</p>
        {showSlowMessage && (
          <p className="text-xs text-slate-400 mt-2 animate-in fade-in duration-1000">
            The server is waking up, please wait a moment...
          </p>
        )}
      </div>
    </div>
  );
};
