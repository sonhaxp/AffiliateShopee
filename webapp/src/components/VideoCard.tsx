"use client";

import { motion } from "framer-motion";
import { FiPlay, FiTrash2, FiRefreshCw, FiDownload, FiClock, FiAlertCircle } from "react-icons/fi";

interface VideoCardProps {
  id: string;
  thumbnail: string;
  title: string;
  date: string;
  status: string;
  onDelete: (id: string) => void;
  onRequeue: (id: string) => void;
}

export default function VideoCard({ id, thumbnail, title, date, status, onDelete, onRequeue }: VideoCardProps) {
  const isCompleted = status === "Completed";
  const isProcessing = status === "Processing";
  const isFailed = status === "Failed";
  const isPending = status === "Pending";

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-[#0f0f12]/80 border border-white/[0.05] rounded-[2rem] overflow-hidden group shadow-xl backdrop-blur-xl relative"
    >
      {/* Thumbnail Area */}
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={thumbnail} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Status Overlay */}
        <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 backdrop-blur-md border ${
                isCompleted ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                isFailed ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                'bg-blue-500/10 text-blue-500 border-blue-500/20'
            }`}>
                {isProcessing || isPending ? <FiClock className="animate-spin" /> : isFailed ? <FiAlertCircle /> : <FiPlay />}
                {status}
            </span>
        </div>

        {isCompleted && (
            <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-black shadow-2xl">
                    <FiPlay size={24} className="ml-1" />
                </div>
            </button>
        )}
      </div>

      {/* Content Area */}
      <div className="p-6">
        <h4 className="text-sm font-bold mb-1 truncate group-hover:text-blue-400 transition-colors">{title}</h4>
        <p className="text-[10px] text-neutral-500 font-medium mb-4">{date}</p>
        
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.03]">
            <div className="flex items-center gap-2">
                <ActionBtn 
                    icon={<FiTrash2 />} 
                    color="hover:text-red-500" 
                    onClick={() => onDelete(id)} 
                />
                {(isFailed || isCompleted) && (
                    <ActionBtn 
                        icon={<FiRefreshCw />} 
                        color="hover:text-blue-500" 
                        onClick={() => onRequeue(id)} 
                    />
                )}
            </div>
            {isCompleted && (
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors">
                    <FiDownload /> Tải về
                </button>
            )}
        </div>
      </div>
    </motion.div>
  );
}

function ActionBtn({ icon, color, onClick }: any) {
    return (
        <button 
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className={`p-2 text-neutral-500 bg-white/[0.02] rounded-lg transition-all ${color} hover:bg-white/[0.05]`}
        >
            {icon}
        </button>
    )
}
