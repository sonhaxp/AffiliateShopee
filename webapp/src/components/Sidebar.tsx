"use client";

import { FiZap, FiBox, FiVideo, FiLayout, FiSettings, FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 flex-shrink-0 border-r border-white/[0.03] bg-black/40 backdrop-blur-3xl p-8 flex flex-col h-screen sticky top-0 shadow-2xl z-20">
      <div className="flex items-center gap-3 mb-12 px-2 group cursor-pointer">
        <Link href="/" className="flex items-center gap-3">
            <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/40"
            >
            <FiZap className="text-white text-xl" />
            </motion.div>
            <span className="font-black text-2xl tracking-tighter text-white">
                Affiliate<span className="text-blue-500">AI</span>
            </span>
        </Link>
      </div>

      <nav className="space-y-3">
        <SidebarItem
          icon={<FiZap />}
          label="Tạo Video AI"
          href="/"
          active={pathname === "/"}
        />
        <SidebarItem
          icon={<FiBox />}
          label="Sản Phẩm"
          href="/products"
          active={pathname === "/products"}
        />
        <SidebarItem
          icon={<FiVideo />}
          label="Thư Viện Video"
          href="/library"
          active={pathname === "/library"}
        />
        <SidebarItem
          icon={<FiLayout />}
          label="Dashboard"
          href="/dashboard"
          active={pathname === "/dashboard"}
        />
        <SidebarItem
          icon={<FiSettings />}
          label="Cài Đặt"
          href="/settings"
          active={pathname === "/settings"}
        />
      </nav>

      <div className="mt-auto space-y-6">
        <Link href="/login" className="block">
            <motion.button 
                whileHover={{ x: 6, color: "#ef4444" }}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-neutral-500 hover:bg-red-500/5 transition-all"
            >
                <FiLogOut className="text-xl" />
                <span>Đăng Xuất</span>
            </motion.button>
        </Link>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-white/[0.05] rounded-3xl relative overflow-hidden group shadow-xl"
        >
        <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <p className="text-xs text-blue-400 font-black mb-1.5 relative z-10 uppercase tracking-widest">Gói miễn phí</p>
        <div className="w-full h-1.5 bg-white/5 rounded-full mb-3 relative z-10 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '50%' }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
            />
        </div>
        <p className="text-[11px] text-white/50 mb-5 relative z-10 font-medium">
          5/10 video còn lại
        </p>
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.2)" }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 bg-white text-black text-[12px] font-black rounded-xl transition-all relative z-10"
        >
          NÂNG CẤP PRO
        </motion.button>
      </motion.div>
      </div>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  href,
  active,
}: {
  icon: any;
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link href={href} className="block">
        <motion.button
        whileHover={{ x: 6, backgroundColor: "rgba(255,255,255,0.03)" }}
        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all relative group ${
            active
            ? "text-white bg-white/[0.05] shadow-xl border border-white/[0.05]"
            : "text-neutral-500 hover:text-white"
        }`}
        >
        {active && (
            <motion.div 
            layoutId="sidebar-active"
            className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
            />
        )}
        <span className={`relative z-10 text-xl ${active ? "text-blue-500" : "group-hover:text-blue-400"}`}>{icon}</span>
        <span className="relative z-10">{label}</span>
        </motion.button>
    </Link>
  );
}
