"use client";

import { useState, useEffect } from "react";
import { 
  FiCpu, 
  FiCheckCircle, 
  FiClock, 
  FiVideo,
  FiDownload,
  FiZap
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Import Components
import Header from "@/components/Header";
import Generator from "@/components/Generator";
import StatusStep from "@/components/StatusStep";
import VideoCard from "@/components/VideoCard";
import JobItem from "@/components/JobItem";

// Import API
import { videoApi } from "@/lib/api";

const MOCK_JOBS = [
  { id: 1, title: "Giày Sneaker Nam Retro Edition", status: "Completed", date: "2 phút trước", thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" },
  { id: 2, title: "Đồng Hồ Thông Minh Pro Max", status: "Processing", date: "Đang xử lý...", thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80" },
  { id: 3, title: "Tai Nghe Studio Wireless", status: "Pending", date: "Trong hàng đợi", thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" },
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string>("Pending");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeJobId && jobStatus !== "Completed" && jobStatus !== "Failed") {
      interval = setInterval(async () => {
        try {
          const data = await videoApi.getStatus(activeJobId);
          setJobStatus(data.status);
          if (data.status === "Completed") {
            setVideoUrl(data.outputVideoUrl);
            setLoading(false);
          }
        } catch (error) {
          console.error("Lỗi khi poll status:", error);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [activeJobId, jobStatus]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Kiểm tra để trống
    if (!url.trim()) {
      toast.error("Thiếu thông tin!", {
        description: "Vui lòng nhập link sản phẩm trước khi tiếp tục."
      });
      return;
    }

    // 2. Validation: Kiểm tra URL hợp lệ
    const validDomains = ["shopee.vn", "tiktok.com", "lazada.vn", "tiki.vn"];
    const isUrlValid = validDomains.some(domain => url.toLowerCase().includes(domain));

    if (!isUrlValid) {
      toast.error("Link không hợp lệ!", {
        description: "Vui lòng dán link từ Shopee, TikTok, Lazada hoặc Tiki."
      });
      return;
    }

    setLoading(true);
    setJobStatus("Pending");
    toast.info("Đang khởi tạo job...", { description: "Hệ thống AI đang bắt đầu phân tích sản phẩm." });

    try {
      const response = await videoApi.generate(url);
      const jobId = response.data?.id;
      if (jobId) {
        setActiveJobId(jobId);
        toast.success("Job đã được tạo!", { description: "Bạn có thể theo dõi tiến trình ở bên dưới." });
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      toast.error("Lỗi kết nối Backend", {
        description: "Vui lòng kiểm tra Server .NET đã chạy chưa."
      });
      setLoading(false);
    }
  };

  return (
    <div className="px-12 py-10">
      <Header userName="Sơn" />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Left Section */}
        <div className="xl:col-span-8 space-y-12">
          <Generator 
            url={url} 
            setUrl={setUrl} 
            loading={loading} 
            onGenerate={handleGenerate} 
          />

          <AnimatePresence>
            {loading && (
              <motion.section 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-blue-600/5 border border-blue-500/20 p-10 rounded-[2.5rem] shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-black text-xl flex items-center gap-3">
                    <FiCpu className="animate-pulse text-blue-400" /> TIẾN TRÌNH XỬ LÝ AI
                  </h3>
                  <span className="text-blue-400 font-black text-lg">{jobStatus === 'Completed' ? '100%' : jobStatus === 'Processing' ? '65%' : '15%'}</span>
                </div>
                
                <div className="space-y-6">
                  <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: jobStatus === 'Completed' ? '100%' : jobStatus === 'Processing' ? '65%' : '15%' }}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                    <StatusStep 
                      icon={<FiCheckCircle />} 
                      label="Phân tích ảnh" 
                      status={jobStatus === 'Pending' ? 'active' : 'done'} 
                    />
                    <StatusStep 
                      icon={<FiClock className={jobStatus === 'Processing' ? 'animate-spin' : ''} />} 
                      label="Xử lý AI" 
                      status={jobStatus === 'Pending' ? 'pending' : jobStatus === 'Processing' ? 'active' : 'done'} 
                    />
                    <StatusStep 
                      icon={<FiVideo />} 
                      label="Render Video" 
                      status={jobStatus === 'Completed' ? 'done' : jobStatus === 'Processing' ? 'active' : 'pending'} 
                    />
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {jobStatus === 'Completed' && videoUrl && (
            <motion.section 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black flex items-center gap-3">
                  <FiVideo className="text-green-500" /> KẾT QUẢ VIDEO AI
                </h3>
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={videoUrl} 
                  download 
                  className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-black text-sm shadow-xl hover:shadow-white/20 transition-all"
                >
                  <FiDownload /> TẢI XUỐNG MP4
                </motion.a>
              </div>
              <div className="rounded-[2.5rem] overflow-hidden border border-white/10 shadow-3xl bg-black aspect-video relative group">
                <video controls autoPlay className="w-full h-full" src={videoUrl}>
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.section>
          )}

          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black tracking-tight">VIDEO VỪA TẠO</h3>
              <button className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">Xem tất cả</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {MOCK_JOBS.filter(j => j.status === "Completed").map((job, i) => (
                <VideoCard key={job.id} {...job} />
              ))}
            </div>
          </section>
        </div>

        {/* Right Section */}
        <div className="xl:col-span-4 space-y-10">
          <section className="bg-neutral-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-3xl">
            <h3 className="font-black mb-8 text-xs uppercase tracking-[0.2em] text-neutral-500">Hàng đợi hệ thống</h3>
            <div className="space-y-6">
              {MOCK_JOBS.map((job, i) => (
                <motion.div 
                    key={job.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                >
                    <JobItem {...job} />
                </motion.div>
              ))}
            </div>
          </section>

          <motion.section 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-blue-600 to-indigo-800 p-10 rounded-[2.5rem] shadow-3xl shadow-blue-900/40 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                <FiZap size={150} />
            </div>
            <h3 className="font-black text-2xl mb-3 relative z-10">TikTok Automation</h3>
            <p className="text-blue-100/70 text-sm mb-8 leading-relaxed relative z-10 font-medium">Kết nối tài khoản TikTok để tự động đăng video ngay sau khi AI render xong.</p>
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-4 bg-white text-blue-700 font-black rounded-2xl shadow-xl hover:shadow-white/20 transition-all relative z-10"
            >
                KẾT NỐI NGAY
            </motion.button>
          </motion.section>
        </div>
      </div>
      
      {/* Global CSS for Animations */}
      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
