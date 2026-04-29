"use client";

import { useState, useRef, useEffect } from "react";
import { FiBell, FiSearch, FiUser, FiHelpCircle, FiChevronDown, FiSettings, FiLogOut, FiLayout } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface HeaderProps {
  userName: string;
}

export default function Header({ userName }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between mb-12 relative z-50">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Tìm kiếm dự án, sản phẩm..." 
            className="w-full bg-[#0f0f12]/60 border border-white/[0.05] rounded-2xl pl-12 pr-6 py-3.5 focus:outline-none focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
            <HeaderAction icon={<FiHelpCircle />} />
            <div className="relative">
                <HeaderAction icon={<FiBell />} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#050505]" />
            </div>
        </div>

        <div className="h-8 w-px bg-white/10 mx-2" />

        {/* User Profile with Dropdown */}
        <div className="relative" ref={menuRef}>
            <motion.div 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 p-1.5 pr-4 rounded-2xl border border-white/[0.03] cursor-pointer transition-all group ${isMenuOpen ? 'bg-white/[0.05]' : ''}`}
            >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20">
                    {userName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block">
                    <p className="text-sm font-black tracking-tight">{userName}</p>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Pro Member</p>
                </div>
                <motion.div
                    animate={{ rotate: isMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <FiChevronDown className="text-neutral-500 group-hover:text-white transition-colors" />
                </motion.div>
            </motion.div>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-56 bg-[#0f0f12] border border-white/[0.08] rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl p-3 z-[60]"
                    >
                        <div className="px-4 py-3 border-b border-white/[0.05] mb-2">
                            <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Tài khoản</p>
                            <p className="text-sm font-bold truncate">{userName}@affiliate.ai</p>
                        </div>
                        
                        <DropdownItem 
                            href="/settings" 
                            icon={<FiSettings />} 
                            label="Cài đặt" 
                            onClick={() => setIsMenuOpen(false)} 
                        />
                        <DropdownItem 
                            href="/dashboard" 
                            icon={<FiLayout />} 
                            label="Dashboard" 
                            onClick={() => setIsMenuOpen(false)} 
                        />
                        
                        <div className="h-px bg-white/[0.05] my-2 mx-2" />
                        
                        <DropdownItem 
                            href="/login" 
                            icon={<FiLogOut />} 
                            label="Đăng xuất" 
                            variant="danger"
                            onClick={() => setIsMenuOpen(false)} 
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

function HeaderAction({ icon }: { icon: any }) {
    return (
        <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.05)" }}
            whileTap={{ scale: 0.9 }}
            className="p-3 text-neutral-400 hover:text-white rounded-xl transition-all"
        >
            <span className="text-xl">{icon}</span>
        </motion.button>
    )
}

function DropdownItem({ href, icon, label, onClick, variant = "default" }: any) {
    return (
        <Link href={href}>
            <motion.div 
                onClick={onClick}
                whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.03)" }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    variant === "danger" ? "text-red-500 hover:bg-red-500/5" : "text-neutral-300 hover:text-white"
                }`}
            >
                <span className="text-lg">{icon}</span>
                {label}
            </motion.div>
        </Link>
    )
}
