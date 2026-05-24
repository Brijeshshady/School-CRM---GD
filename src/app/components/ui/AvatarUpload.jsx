import { useState, useRef } from "react";
import { Camera, Loader2, User, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import { toast } from "sonner";

export const AvatarUpload = ({ userId, currentAvatar, name, size = "large" }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await api.post(`/admin/users/${userId}/avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["students"]);
      queryClient.invalidateQueries(["teachers"]);
      toast.success("Profile image updated");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Upload failed");
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      uploadMutation.mutate(file);
    }
  };

  const initials = name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?";
  
  const sizeClasses = {
    small: "w-10 h-10 text-xs",
    medium: "w-16 h-16 text-sm",
    large: "w-32 h-32 text-2xl"
  };

  const containerSize = sizeClasses[size] || sizeClasses.large;

  return (
    <div 
      className={`relative group ${containerSize}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl relative ${!currentAvatar ? 'bg-gradient-to-br from-indigo-500 to-blue-600' : ''}`}>
        {currentAvatar ? (
          <img 
            src={currentAvatar.startsWith('http') ? currentAvatar : `${api.defaults.baseURL}${currentAvatar}`} 
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white font-black">
            {initials}
          </div>
        )}

        {uploadMutation.isPending && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-white text-slate-900 rounded-2xl hover:scale-110 transition-transform shadow-xl"
          >
            <Camera className="w-6 h-6" />
          </button>
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};
