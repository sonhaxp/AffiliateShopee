"use client";

import { motion } from "framer-motion";

export default function StatusStep({ icon, label, status }: { icon: any, label: string, status: 'done' | 'active' | 'pending' }) {
  const isDone = status === 'done';
  const isActive = status === 'active';
  
  const colorClass = isDone ? 'text-green-400' : isActive ? 'text-blue-400' : 'text-neutral-700';
  const bgClass = isDone ? 'bg-green-500/5' : isActive ? 'bg-blue-500/10' : 'bg-transparent';
  const borderClass = isDone ? 'border-green-500/20' : isActive ? 'border-blue-500/30' : 'border-white/[0.03]';

  return (
    <motion.div 
      whileHover={isActive || isDone ? { y: -5, scale: 1.02 } : {}}
      className={`flex flex-col items-center gap-3 p-6 rounded-[2rem] ${bgClass} border ${borderClass} transition-all duration-500 cursor-default relative overflow-hidden group shadow-lg`}
    >
      {isActive && (
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-50" />
      )}
      <div className={`text-2xl ${colorClass} relative z-10 transition-transform duration-500 group-hover:scale-110`}>
        {icon}
      </div>
      <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${colorClass} relative z-10`}>{label}</span>
      
      {isDone && (
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]" />
      )}
    </motion.div>
  );
}
