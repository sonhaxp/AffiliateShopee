"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiArrowRight, FiZap } from "react-icons/fi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Giả lập login
    setTimeout(() => {
      if (email && password) {
        toast.success("Đăng nhập thành công!", { description: "Chào mừng bạn quay trở lại." });
        router.push("/");
      } else {
        toast.error("Vui lòng nhập đầy đủ thông tin.");
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050505]">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-10 bg-[#0f0f12]/80 border border-white/[0.05] rounded-[3rem] backdrop-blur-3xl shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40 mx-auto mb-6"
          >
            <FiZap className="text-white text-3xl" />
          </motion.div>
          <h1 className="text-3xl font-black tracking-tighter mb-2">CHÀO MỪNG QUAY LẠI</h1>
          <p className="text-neutral-500 font-medium">Đăng nhập để bắt đầu tạo video AI</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-neutral-500 ml-2 uppercase tracking-widest">Email Address</label>
            <div className="relative group">
              <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-black/50 border border-white/[0.08] rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-2">
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Password</label>
              <button type="button" className="text-[10px] font-black text-blue-500 hover:underline uppercase tracking-widest">Quên mật khẩu?</button>
            </div>
            <div className="relative group">
              <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/50 border border-white/[0.08] rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all font-medium"
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 py-4 rounded-2xl font-black text-sm tracking-widest uppercase shadow-2xl shadow-blue-900/40 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? "ĐANG XÁC THỰC..." : (
              <>ĐĂNG NHẬP <FiArrowRight /></>
            )}
          </motion.button>
        </form>

        <div className="mt-10 text-center text-sm text-neutral-500 font-medium">
          Chưa có tài khoản? <button className="text-blue-500 font-bold hover:underline">Đăng ký ngay</button>
        </div>
      </motion.div>
    </div>
  );
}
