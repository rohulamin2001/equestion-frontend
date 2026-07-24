import axios from 'axios';
import { toast } from 'sonner';

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:8001'}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const errorData = error.response.data;
      const isConcurrent =
        errorData?.code === 'CONCURRENT_LOGIN' ||
        (typeof errorData?.error === 'string' &&
          errorData.error.includes('অন্য একটি ডিভাইসে'));

      if (isConcurrent) {
        toast.error(
          'অন্য একটি ডিভাইসে আপনার অ্যাকাউন্টে লগইন করা হয়েছে। নিরাপত্তা কারণে এই ডিভাইস থেকে লগআউট করা হলো।',
          { duration: 5000 }
        );
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
