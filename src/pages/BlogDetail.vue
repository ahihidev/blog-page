<template>
  <!-- Kiểm tra nếu dữ liệu đã tải xong thì hiển thị nội dung bài viết -->
  <div v-if="!isLoading" class="flex flex-col gap-5 md:px-[200px] px-5 bg-white dark:bg-gray-800">
    
    <!-- Phần hiển thị tiêu đề và nội dung tóm tắt của bài viết -->
    <div class="flex flex-col md:gap-5 gap-2">
      <h2 class="text-primary_15 md:text-[24px] text-[18px] font-bold dark:text-white">
        {{ BlogData.title }}
      </h2>
      <p class="text-black dark:text-gray-300 md:text-[12px] text-[12px]">
        {{ BlogData.text }}
      </p>
    </div>

    <!-- Phần hiển thị các nút chia sẻ mạng xã hội và nội dung bài viết -->
    <div class="flex flex-row md:gap-6 gap-1 md:mt-10 mt-3">
      
      <!-- Cột chứa các icon chia sẻ lên mạng xã hội -->
      <div class="w-1/12">
        <ul class="flex flex-col gap-2 w-full">
          <li class="w-12"><img src="../assets/icons/pinterest.svg" alt="pinterest-icon" /></li>
          <li><img src="../assets/icons/instargram.svg" alt="instargram-icon" /></li>
          <li><img src="../assets/icons/twitter.svg" alt="twitter-icon" /></li>
          <li><img src="../assets/icons/facebook.svg" alt="facebook-icon" /></li>
        </ul>
      </div>

      <!-- Cột chứa nội dung chính của bài viết -->
      <div class="flex flex-col gap-3">
        <h2 class="text-primary_25 md:text-[18px] text-[14px] font-semibold dark:text-white">
          {{ BlogData.heading }}
        </h2>
        <p class="text-slate-600 dark:text-gray-400 text-[14px]">
          {{ BlogData.content }}
        </p>
        <img :src="BlogData.imageUrl" :alt="BlogData.imageUrl">
      </div>

      <!-- Cột chứa số lượt thích và lượt xem bài viết -->
      <div class="flex flex-col gap-3 w-1/12">
        <div class="flex flex-col items-center">
          <Heart class="md:w-5 w-3 text-black dark:text-white"/>
          <p class="text-[12px] text-black dark:text-white">11k</p>
        </div>
        <div class="flex flex-col items-center">
          <Eye class="md:w-5 w-3 text-black dark:text-white"/>
          <p class="text-[12px] text-black dark:text-white">12k</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Nếu dữ liệu đang được tải thì hiển thị hiệu ứng loading -->
  <div v-if="isLoading" class="flex flex-col w-full px-[20px] md:px-[150px] bg-bg_primary dark:bg-gray-800 pt-9 gap-3 overflow-x-scroll">
    <div class="flex flex-col gap-4 mb-4">
      <Skeleton height="60px"></Skeleton>
      <Skeleton height="30px"></Skeleton>
      <Skeleton height="300px" width="90%" class="m-auto"></Skeleton>
      <Skeleton height="30px"></Skeleton>
      <Skeleton height="30px"></Skeleton>
    </div>
  </div>
</template>

<script setup>
import Skeleton from 'primevue/skeleton'; // Import component Skeleton để tạo hiệu ứng loading
import { getBlogById } from '@/api/blogsApi'; // Import API lấy dữ liệu bài viết từ backend
import { Heart, Eye } from 'lucide-vue-next'; // Import icon trái tim (like) và con mắt (view)
import { onMounted, ref } from 'vue'; // Import các hàm và biến cần thiết từ Vue
import { useRoute } from 'vue-router'; // Import Vue Router để lấy thông tin route hiện tại

// Khai báo biến lưu trữ dữ liệu bài viết
const BlogData = ref([]);
// Biến kiểm tra trạng thái loading
const isLoading = ref(false);
// Lấy route hiện tại để lấy id bài viết
const route = useRoute();
const paramsId = route.params.id;

// Hàm gọi API để lấy dữ liệu bài viết theo ID
const fetchData = async () => {
  isLoading.value = true; // Bật trạng thái loading
  try {
    const res = await getBlogById(paramsId); // Gọi API backend để lấy dữ liệu
    BlogData.value = res; // Lưu dữ liệu vào biến
    console.log(BlogData.value); // Debug dữ liệu nhận được
  } catch (error) {
    console.error("Error fetching blog:", error); // Xử lý lỗi nếu có
    throw error;
  } finally {
    isLoading.value = false; // Tắt trạng thái loading sau khi tải xong
  }
};

// Gọi fetchData() khi component được mount
onMounted(() => {
  fetchData();
});
</script>
