"use client";

import { FiUser, FiCreditCard, FiBell, FiShield, FiCpu } from "react-icons/fi";
import Header from "@/components/Header";
import { motion } from "framer-motion";

export default function SettingsPage() {
  return (
    <div className="px-12 py-10">
      <Header userName="Sơn" />

      <section className="mb-10">
        <h2 className="text-3xl font-black mb-2 flex items-center gap-3 tracking-tight">
            <FiUser className="text-blue-500" /> CÀI ĐẶT TÀI KHOẢN
        </h2>
        <p className="text-neutral-500">Quản lý thông tin cá nhân và cấu hình hệ thống AI</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <aside className="space-y-2">
            <SettingsTab icon={<FiUser />} label="Hồ sơ cá nhân" active />
            <SettingsTab icon={<FiCpu />} label="Cấu hình AI Engine" />
            <SettingsTab icon={<FiCreditCard />} label="Gói cước & Thanh toán" />
            <SettingsTab icon={<FiBell />} label="Thông báo" />
            <SettingsTab icon={<FiShield />} label="Bảo mật" />
        </aside>

        <main className="lg:col-span-3 space-y-8">
            <section className="bg-[#0f0f12]/80 border border-white/[0.05] p-10 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl">
                <h3 className="text-xl font-bold mb-8">Thông tin cơ bản</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputGroup label="Họ và tên" placeholder="Sơn Nguyễn" />
                    <InputGroup label="Email" placeholder="son@example.com" />
                </div>
                <div className="mt-10">
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-blue-600 px-8 py-3 rounded-2xl font-black text-sm shadow-xl shadow-blue-600/20"
                    >
                        LƯU THAY ĐỔI
                    </motion.button>
                </div>
            </section>

            <section className="bg-red-500/5 border border-red-500/10 p-10 rounded-[2.5rem] backdrop-blur-3xl">
                <h3 className="text-xl font-bold mb-2 text-red-500">Khu vực nguy hiểm</h3>
                <p className="text-neutral-500 text-sm mb-6">Xóa tài khoản sẽ xóa vĩnh viễn toàn bộ dữ liệu và video của bạn.</p>
                <button className="text-red-500 font-bold border border-red-500/20 px-6 py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all text-xs">XÓA TÀI KHOẢN</button>
            </section>
        </main>
      </div>
    </div>
  );
}

function SettingsTab({ icon, label, active }: { icon: any, label: string, active?: boolean }) {
    return (
        <button className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
            active ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'text-neutral-500 hover:bg-white/5 hover:text-white'
        }`}>
            <span className="text-xl">{icon}</span>
            {label}
        </button>
    )
}

function InputGroup({ label, placeholder }: { label: string, placeholder: string }) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black text-neutral-500 ml-2 uppercase tracking-widest">{label}</label>
            <input 
                type="text" 
                placeholder={placeholder}
                className="w-full bg-black/50 border border-white/[0.08] rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500/50 transition-all font-medium"
            />
        </div>
    )
}
