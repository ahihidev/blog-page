import axios from "axios";

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: 'https://blog-server-phi-five.vercel.app', // URL backend trực tiếp
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Thêm interceptor để log requests
api.interceptors.request.use(
  (config) => {
    console.log('Request:', config.url, config.method);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Thêm interceptor để log responses
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Lấy danh sách tất cả blog từ server
export const getBlogs = async () => {
  try {
    const res = await api.get('/blog');
    return res.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

// Xóa blog theo ID
export const deleteBlogById = async (id) => {
  try {
    const res = await api.delete(`/blog/remove/${id}`);
    return res.data.status;
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
};

// Chỉnh sửa blog theo ID
export const editBlogById = async (id, data) => {
  try {
    const res = await api.patch(`/blog/edit/${id}`, data);
    return res.data.status;
  } catch (error) {
    console.error("Error editing blog:", error);
    throw error;
  }
};

// Cập nhật blog theo ID
export const updateBlogById = async (id, data) => {
  try {
    const res = await api.patch(`/blog/update/${id}`, data);
    return res.data.status;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
};

// Tạo mới một blog
export const createBlog = async (data) => {
  try {
    const res = await api.post('/blog/create', data);
    return res.data.status;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
};

// Lấy thông tin chi tiết của một blog theo ID
export const getBlogById = async (id) => {
  try {
    const res = await api.get(`/blog/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw error;
  }
};
