<script setup>
// Import các module và component cần thiết
import { getBlogs } from '@/api/blogsApi';
import BlogCard from '@/components/BlogCard.vue';
import { Search } from 'lucide-vue-next';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Skeleton from 'primevue/skeleton';
import SearchCard from '@/components/SearchCard.vue';

// Khai báo biến phản ứng (reactive)
const data = ref([]); // Lưu trữ danh sách blog để hiển thị
const dataSearch = ref([]); // Lưu trữ danh sách blog để tìm kiếm
const results = ref([]); // Lưu trữ kết quả tìm kiếm
const isLoading = ref(false); // Trạng thái tải dữ liệu
const searchInput = ref(''); // Giá trị nhập vào ô tìm kiếm
const page = ref(1); // Trang hiện tại của danh sách blog
const hasMore = ref(true); // Kiểm tra còn dữ liệu để tải không
const isFetching = ref(false); // Kiểm tra có đang tải dữ liệu không

// Hàm lấy dữ liệu cho tìm kiếm
const fetchDataforSearch = async () => {
  try {
    const response = await getBlogs();
    dataSearch.value = response.result; // Lưu toàn bộ dữ liệu để tìm kiếm
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Hàm lấy dữ liệu blog với cơ chế phân trang
const fetchData = async () => {
  if (isFetching.value || !hasMore.value) return;

  isFetching.value = true;
  isLoading.value = true;
  try {
    const response = await getBlogs();
    if (response.result.length > 0 && page.value < 4) {
      data.value = [...data.value, ...response.result]; // Gộp dữ liệu mới với dữ liệu cũ
      page.value += 1; // Tăng số trang
    } else {
      hasMore.value = false; // Không còn dữ liệu để tải
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    isFetching.value = false;
    isLoading.value = false;
  }
};

// Hàm xử lý khi người dùng cuộn xuống cuối trang
const handleScroll = () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 50) {
    fetchData(); // Gọi API khi cuộn đến cuối
  }
};

// Hàm lọc danh sách blog dựa trên từ khóa tìm kiếm
const filterList = () => {
  if (!searchInput.value) {
    results.value = [];
    return;
  }
  const normalizedSearch = removeVietnameseTones(searchInput.value);
  results.value = dataSearch.value.filter((item) =>
    removeVietnameseTones(item.title).includes(normalizedSearch)
  );
};

// Hàm chuẩn hóa chuỗi (bỏ dấu tiếng Việt)
function removeVietnameseTones(str) {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

// Gắn và gỡ sự kiện cuộn trang
onMounted(() => {
  fetchDataforSearch();
  fetchData();
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="flex flex-col w-full px-[20px] sm:px-[50px] md:px-[50px] lg:px-[140px] bg-bg_primary pt-9 gap-3">
    <!-- Ô tìm kiếm -->
    <div class="relative mb-3">
      <input v-model="searchInput" type="text" placeholder="Search Blog..." @input="filterList"
        class="w-full py-4 pl-5 rounded-lg bg-white drop-shadow-lg outline-none border dark:text-gray-800 text-gray-800 border-bd_primary" />
      <Search class="absolute top-[30px] right-3 -translate-x-1/2 -translate-y-1/2 " />
      <!-- Hiển thị kết quả tìm kiếm -->
      <div class="relative mt-3">
        <div v-if="results.length > 0" class="absolute top-0 right-0 left-0 z-50 min-h-64 bg-bg_primary overflow-y-scroll">
          <div class="absolute flex flex-col top-0 right-0 left-0 p-4 bg-slate-200 gap-3 rounded-md">
            <div v-for="(blog, index) in results" :key="index" class="relative flex flex-col">
              <router-link :to="{ name: 'BlogDetail', params: { id: blog.id } }">
                <SearchCard :img="blog.imageUrl" :title="blog.title" :text="blog.text" />
              </router-link>
            </div>
          </div>
        </div>
        <!-- Hiển thị khi không tìm thấy kết quả -->
        <div v-if="results.length === 0 && searchInput"
          class="absolute flex flex-col top-0 right-0 left-0 p-4 gap-3 rounded-md">
          <div class="w-full z-50 text-4xl font-semibold uppercase flex justify-center border border-bd_primary bg-white rounded-md p-4 shadow-2xl drop-shadow-xl">
            <p>do not found</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Tiêu đề danh sách bài viết -->
    <div>
      <h3 class="text-[12px] text-primary_20 uppercase">All Post</h3>
    </div>
    <!-- Danh sách bài viết -->
    <div v-if="!isLoading"
      class="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 2xl:grid-cols-4 grid-cols-1 justify-center gap-6">
      <div v-for="(blog, index) in data" :key="index">
        <router-link :to="{ name: 'BlogDetail', params: { id: blog.id } }">
          <BlogCard :img="blog.imageUrl" :title="blog.title" :text="blog.text" />
        </router-link>
      </div>
    </div>
    <!-- Hiển thị loading khi đang tải dữ liệu -->
    <div v-if="isLoading"
      class="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-3 2xl:grid-cols-4 grid-cols-1 justify-center gap-6">
      <div v-for="index in 12" :key="index">
        <div class="flex flex-col gap-2 mb-4">
          <Skeleton height="130px"></Skeleton>
          <Skeleton></Skeleton>
          <Skeleton height="30px" class="mb-2"></Skeleton>
          <Skeleton></Skeleton>
        </div>
      </div>
    </div>
  </div>
</template>
