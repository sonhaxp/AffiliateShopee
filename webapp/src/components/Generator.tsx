"use client";

import { FiLink, FiCpu, FiMusic, FiMic } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface GeneratorProps {
  url: string;
  setUrl: (url: string) => void;
  loading: boolean;
  onGenerate: (e: React.FormEvent) => void;
}

export default function Generator({ url, setUrl, loading, onGenerate }: GeneratorProps) {
  return (
    <motion.section 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#0f0f12]/80 border border-white/[0.05] p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden group shadow-2xl backdrop-blur-xl"
    >
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full group-hover:bg-blue-600/10 transition-all duration-700" />
      
      <div className="relative z-10">
        <h3 className="text-2xl font-black mb-8 flex items-center gap-3 tracking-tighter uppercase">
          <span className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
            <FiLink size={24} />
          </span> 
          Nhập Link Sản Phẩm
        </h3>

        <form onSubmit={onGenerate} noValidate className="space-y-8">
          <div className="group/input relative">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Dán link Shopee, TikTok hoặc Lazada..."
              className="w-full bg-black/60 border border-white/[0.08] rounded-3xl px-8 py-6 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-xl placeholder:text-neutral-700 shadow-2xl"
            />
            <div className="absolute inset-0 rounded-3xl border border-blue-500/0 group-focus-within/input:border-blue-500/30 pointer-events-none transition-all" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SelectBox 
                icon={<FiMic size={18} className="text-blue-500" />} 
                label="GIỌNG ĐỌC AI" 
                options={["Nam miền Bắc (Mạnh mẽ)", "Nữ miền Nam (Ngọt ngào)", "Nam trầm ấm (Kể chuyện)"]} 
            />
            <SelectBox 
                icon={<FiMusic size={18} className="text-indigo-500" />} 
                label="NHẠC NỀN TRENDING" 
                options={["Trend TikTok 2024", "Lofi Beats thư giãn", "Epic Năng động"]} 
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01, boxShadow: "0 10px 40px rgba(37, 99, 235, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 py-6 rounded-3xl font-black text-xl shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-4 relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-7 h-7 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  <span className="tracking-widest">ĐANG XỬ LÝ...</span>
                </motion.div>
              ) : (
                <motion.div 
                    key="normal"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-4"
                >
                  <FiCpu className="text-3xl" /> <span className="tracking-widest uppercase">Bắt Đầu Tạo Video AI</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </form>
      </div>
    </motion.section>
  );
}

function SelectBox({ icon, label, options }: { icon: any; label: string; options: string[] }) {
  return (
    <div className="space-y-4">
      <label className="text-[11px] font-black text-neutral-500 ml-2 uppercase tracking-[0.2em] flex items-center gap-2">
        {icon} {label}
      </label>
      <div className="relative group/select">
        <select className="w-full bg-black/50 border border-white/[0.08] rounded-2xl px-6 py-5 text-sm font-bold focus:outline-none focus:border-blue-500/40 appearance-none cursor-pointer group-hover/select:border-white/20 transition-all shadow-xl">
            {options.map((opt) => (
            <option key={opt} value={opt} className="bg-[#0f0f12] text-white">
                {opt}
            </option>
            ))}
        </select>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
        </div>
      </div>
    </div>
  );
}
