"use client";

import { useState, useEffect } from "react";
import { FiVideo, FiSearch, FiRefreshCw, FiFilter } from "react-icons/fi";
import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import { motion, AnimatePresence } from "framer-motion";
import { videoApi } from "@/lib/api";
import { toast } from "sonner";

export default function LibraryPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const data = await videoApi.getLibrary();
      setVideos(data);
    } catch (error) {
      toast.error("Không thể tải thư viện video.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xác nhận xóa video này khỏi thư viện?")) return;
    try {
        await videoApi.delete(id);
        toast.success("Đã xóa video.");
        fetchVideos();
    } catch (error) {
        toast.error("Lỗi khi xóa video.");
    }
  }

  const handleRequeue = async (id: string) => {
    try {
        await videoApi.requeue(id);
        toast.success("Đã đưa vào hàng đợi chạy lại.");
        fetchVideos();
    } catch (error) {
        toast.error("Lỗi khi thực hiện yêu cầu.");
    }
  }

  useEffect(() => {
    fetchVideos();
  }, []);

  const filteredVideos = videos.filter(v => 
    filter === "All" ? true : v.status === filter
  );

  return (
    <div className="px-12 py-10">
      <Header userName="Sơn" />

      <section className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
            <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                <FiVideo className="text-blue-500" /> THƯ VIỆN VIDEO
            </h2>
            <p className="text-neutral-500">Quản lý và tối ưu hóa các sản phẩm sáng tạo</p>
        </div>

        <div className="flex items-center gap-4">
            {/* Filter */}
            <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-neutral-900/40 border border-white/10 rounded-2xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer hover:bg-neutral-800 transition-all"
            >
                <option value="All">TẤT CẢ TRẠNG THÁI</option>
                <option value="Completed">ĐÃ HOÀN THÀNH</option>
                <option value="Processing">ĐANG XỬ LÝ</option>
                <option value="Failed">BỊ LỖI</option>
            </select>

            <button 
                onClick={fetchVideos}
                className="p-3 bg-neutral-900/40 border border-white/10 rounded-2xl hover:bg-neutral-800 transition-all text-neutral-400"
            >
                <FiRefreshCw className={loading ? "animate-spin" : ""} />
            </button>
            
            <div className="relative group">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-blue-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Tìm kiếm video..."
                    className="bg-neutral-900/40 border border-white/10 rounded-2xl pl-12 pr-6 py-3 focus:outline-none focus:border-blue-500/50 transition-all"
                />
            </div>
        </div>
      </section>

      {loading ? (
          <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
      ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
                {filteredVideos.length > 0 ? filteredVideos.map((video, i) => (
                <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                >
                    <VideoCard 
                        id={video.id}
                        thumbnail={video.productThumbnail || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80"} 
                        title={video.productName || "Video không tên"} 
                        date={new Date(video.createdAt).toLocaleDateString("vi-VN")} 
                        status={video.status}
                        onDelete={handleDelete}
                        onRequeue={handleRequeue}
                    />
                </motion.div>
                )) : (
                    <div className="col-span-full text-center py-20 bg-neutral-900/20 rounded-3xl border border-dashed border-white/5">
                        <p className="text-neutral-500 font-bold uppercase tracking-widest">Không tìm thấy video phù hợp</p>
                    </div>
                )}
            </AnimatePresence>
          </div>
      )}
    </div>
  );
}
