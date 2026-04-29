"use client";

import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-[#050505]">
        {children}
        <Toaster position="top-right" expand={true} richColors theme="dark" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full relative z-10 overflow-hidden bg-[#050505]">
      {/* Global Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[35rem] h-[35rem] bg-purple-600/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto bg-transparent relative">
        {children}
      </main>
      <Toaster position="top-right" expand={true} richColors theme="dark" />
    </div>
  );
}
