"use client";

import { motion } from "framer-motion";

export default function JobItem({ thumbnail, title, status }: { thumbnail: string, title: string, status: string }) {
  const isCompleted = status === 'Completed';
  const isProcessing = status === 'Processing';

  return (
    <motion.div 
      whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.03)" }}
      className="flex items-center gap-4 p-4 rounded-[1.5rem] border border-white/[0.03] transition-all cursor-pointer group shadow-sm hover:shadow-xl"
    >
      <div className="w-14 h-14 rounded-2xl bg-neutral-900 overflow-hidden flex-shrink-0 relative">
        <img src={thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        {isProcessing && (
            <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold truncate group-hover:text-blue-400 transition-colors">{title}</p>
        <div className="flex items-center gap-2 mt-1">
            <span className={`w-1.5 h-1.5 rounded-full ${
                isCompleted ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 
                isProcessing ? 'bg-blue-500 animate-pulse shadow-[0_0_5px_#3b82f6]' : 'bg-neutral-600'
            }`} />
            <p className={`text-[10px] font-black uppercase tracking-wider ${
                isCompleted ? 'text-green-500' : 
                isProcessing ? 'text-blue-500' : 'text-neutral-500'
            }`}>{status}</p>
        </div>
      </div>
    </motion.div>
  );
}
