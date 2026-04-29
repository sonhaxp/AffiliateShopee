"use client";

import { useState, useEffect } from "react";
import { FiActivity, FiVideo, FiBox, FiCheckCircle, FiClock, FiRefreshCw } from "react-icons/fi";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import { videoApi } from "@/lib/api";
import { toast } from "sonner";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalVideos: 0,
    completedVideos: 0,
    processingVideos: 0,
    totalProducts: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await videoApi.getStats();
      setStats({
        totalVideos: data.totalVideos,
        completedVideos: data.completedVideos,
        processingVideos: data.processingVideos,
        totalProducts: data.totalProducts
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="px-12 py-10">
      <Header userName="Sơn" />

      <section className="mb-10 flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-black mb-2 flex items-center gap-3 tracking-tight">
                <FiActivity className="text-blue-500" /> DASHBOARD TỔNG QUAN
            </h2>
            <p className="text-neutral-500">Theo dõi hiệu suất hệ thống AI của bạn</p>
        </div>
        <button 
            onClick={fetchStats}
            className="p-3 bg-neutral-900/40 border border-white/10 rounded-2xl hover:bg-neutral-800 transition-all text-neutral-400"
        >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
        </button>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <StatCard 
            icon={<FiVideo className="text-blue-500" />} 
            label="Tổng Video" 
            value={stats.totalVideos.toString()} 
            color="blue" 
        />
        <StatCard 
            icon={<FiCheckCircle className="text-green-500" />} 
            label="Hoàn Thành" 
            value={stats.completedVideos.toString()} 
            color="green" 
        />
        <StatCard 
            icon={<FiClock className="text-yellow-500" />} 
            label="Đang Xử Lý" 
            value={stats.processingVideos.toString()} 
            color="yellow" 
        />
        <StatCard 
            icon={<FiBox className="text-purple-500" />} 
            label="Sản Phẩm" 
            value={stats.totalProducts.toString()} 
            color="purple" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#0f0f12]/80 border border-white/[0.05] p-10 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl min-h-[400px] flex items-center justify-center">
            <div className="text-center">
                <p className="text-neutral-600 font-black uppercase tracking-[0.2em] mb-4">Biểu đồ hiệu suất</p>
                <div className="w-16 h-1 bg-white/5 mx-auto rounded-full" />
                <p className="text-neutral-700 text-xs mt-6">Dữ liệu sẽ hiển thị sau khi có nhiều job hơn</p>
            </div>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px] rounded-full -mr-10 -mt-10" />
            <h3 className="text-2xl font-black mb-4 relative z-10">Nâng cấp lên PRO</h3>
            <p className="text-white/70 mb-10 relative z-10 font-medium">Mở khóa tính năng render 4K, đăng bài hàng loạt và không giới hạn video.</p>
            <button className="bg-white text-black px-8 py-4 rounded-2xl font-black text-sm relative z-10 shadow-xl shadow-black/20 hover:scale-105 transition-transform">NÂNG CẤP NGAY</button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
    const colors: any = {
        blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        green: "bg-green-500/10 text-green-500 border-green-500/20",
        yellow: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        purple: "bg-purple-500/10 text-purple-500 border-purple-500/20"
    };

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className={`p-8 rounded-[2rem] border backdrop-blur-3xl shadow-xl transition-all ${colors[color] || colors.blue}`}
        >
            <div className="flex items-center justify-between mb-6">
                <div className="text-2xl">{icon}</div>
                <div className="text-xs font-black uppercase tracking-widest opacity-60">Live</div>
            </div>
            <p className="text-4xl font-black mb-2 tracking-tighter">{value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</p>
        </motion.div>
    )
}
