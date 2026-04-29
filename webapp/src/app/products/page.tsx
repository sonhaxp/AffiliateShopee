"use client";

import { useState, useEffect } from "react";
import { FiBox, FiSearch, FiTrash2, FiExternalLink, FiPlus, FiRefreshCw, FiX } from "react-icons/fi";
import Header from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import { productApi } from "@/lib/api";
import { toast } from "sonner";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    price: 0,
    affiliateUrl: "",
    thumbnailUrl: ""
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getAll();
      setProducts(data);
    } catch (error) {
      toast.error("Không thể tải danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await productApi.create(newProduct);
      toast.success("Đã thêm sản phẩm mới!");
      setIsModalOpen(false);
      setNewProduct({ name: "", sku: "", price: 0, affiliateUrl: "", thumbnailUrl: "" });
      fetchProducts();
    } catch (error) {
      toast.error("Lỗi khi thêm sản phẩm.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    try {
        await productApi.delete(id);
        toast.success("Đã xóa sản phẩm.");
        fetchProducts();
    } catch (error) {
        toast.error("Lỗi khi xóa sản phẩm.");
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="px-12 py-10 relative">
      <Header userName="Sơn" />

      <section className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
            <h2 className="text-3xl font-black mb-2 flex items-center gap-3 tracking-tight">
                <FiBox className="text-blue-500" /> QUẢN LÝ SẢN PHẨM
            </h2>
            <p className="text-neutral-500">Kho dữ liệu sản phẩm đã từng cào dữ liệu</p>
        </div>

        <div className="flex items-center gap-4">
            <button 
                onClick={fetchProducts}
                className="p-3 bg-neutral-900/40 border border-white/10 rounded-2xl hover:bg-neutral-800 transition-all text-neutral-400"
            >
                <FiRefreshCw className={loading ? "animate-spin" : ""} />
            </button>
            <div className="relative group flex-1 md:w-64">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-blue-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Tìm theo SKU, tên..."
                    className="w-full bg-neutral-900/40 border border-white/10 rounded-2xl pl-12 pr-6 py-3 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                />
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
            >
                <FiPlus /> THÊM MỚI
            </button>
        </div>
      </section>

      {/* Product Table */}
      <div className="bg-[#0f0f12]/80 border border-white/[0.05] rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/[0.05]">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">Sản phẩm</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">SKU</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">Giá</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">Ngày cào</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-500 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {loading ? (
                <tr>
                    <td colSpan={5} className="text-center py-10">
                        <div className="flex justify-center"><div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" /></div>
                    </td>
                </tr>
            ) : products.length > 0 ? products.map((product) => (
              <tr key={product.id} className="hover:bg-white/[0.01] transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-neutral-900 rounded-xl overflow-hidden border border-white/5">
                        <img src={product.thumbnailUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80"} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="text-sm font-bold truncate max-w-[200px]">{product.name}</p>
                        <p className="text-[10px] text-blue-500 font-medium">Click to view source</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 font-mono text-[11px] text-neutral-400">{product.sku}</td>
                <td className="px-8 py-6 font-bold text-sm text-blue-400">{product.price.toLocaleString()}đ</td>
                <td className="px-8 py-6 text-[11px] text-neutral-500">{new Date(product.createdAt).toLocaleDateString("vi-VN")}</td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:text-blue-500 transition-colors"><FiExternalLink /></button>
                    <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:text-red-500 transition-colors"
                    >
                        <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
                <tr>
                    <td colSpan={5} className="text-center py-20 text-neutral-600 uppercase text-[10px] font-black tracking-widest">Không có dữ liệu sản phẩm</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-xl bg-[#0f0f12] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 text-neutral-500 hover:text-white transition-colors"
              >
                <FiX size={24} />
              </button>

              <h3 className="text-2xl font-black mb-8 uppercase tracking-tight">Thêm sản phẩm thủ công</h3>
              
              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-500 ml-2 uppercase tracking-widest">Tên sản phẩm</label>
                  <input 
                    type="text" 
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Ví dụ: Giày Sneaker Nike Air Max"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 ml-2 uppercase tracking-widest">Giá (VNĐ)</label>
                    <input 
                      type="number" 
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: parseInt(e.target.value)})}
                      className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 ml-2 uppercase tracking-widest">SKU (Để trống để tự tạo)</label>
                    <input 
                      type="text" 
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                      placeholder="NIKE-001"
                      className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-500 ml-2 uppercase tracking-widest">Link sản phẩm (Affiliate)</label>
                  <input 
                    type="url" 
                    required
                    value={newProduct.affiliateUrl}
                    onChange={(e) => setNewProduct({...newProduct, affiliateUrl: e.target.value})}
                    placeholder="https://shopee.vn/..."
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-500 ml-2 uppercase tracking-widest">Link ảnh đại diện (Thumbnail)</label>
                  <input 
                    type="url" 
                    value={newProduct.thumbnailUrl}
                    onChange={(e) => setNewProduct({...newProduct, thumbnailUrl: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:scale-[1.02] transition-all"
                >
                  LƯU SẢN PHẨM
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
