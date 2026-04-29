import axios from "axios";

const API_BASE_URL = "http://localhost:5249/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const videoApi = {
  // Tạo job mới
  generate: (productLink: string) => api.post("/videos/generate", { productLink }),
  
  // Kiểm tra trạng thái job
  getStatus: (id: string) => api.get(`/videos/status/${id}`).then(res => res.data),
  
  // Lấy danh sách toàn bộ video (Thư viện)
  getLibrary: () => api.get("/videos/library").then(res => res.data),

  // Lấy thống kê dashboard
  getStats: () => api.get("/dashboard/stats").then(res => res.data),

  // Xóa video
  delete: (id: string) => api.delete(`/videos/${id}`),

  // Chạy lại job
  requeue: (id: string) => api.post(`/videos/requeue/${id}`),
};

export const productApi = {
  // Lấy danh sách sản phẩm
  getAll: () => api.get("/products").then(res => res.data),
  
  // Thêm mới sản phẩm
  create: (product: any) => api.post("/products", product),
  
  // Xóa sản phẩm
  delete: (id: number) => api.delete(`/products/${id}`),
};

export default api;
