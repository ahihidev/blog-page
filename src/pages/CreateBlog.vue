<template>
  <!-- Giao diện chính của trang tạo blog -->
  <div class="flex flex-row justify-between gap-5 md:px-10 xl:px-32 px-3 py-5 bg-bg_primary dark:bg-gray-800">
    <div class="flex flex-col gap-5 uppercase w-full md:px-5 md:py-5 bg-bg_primary dark:bg-gray-800">
      <h3 class="text-primary_25 font-semibold text-xl dark:text-black">Create blog</h3>
      <div class="flex flex-col gap-5">
        <!-- Trường nhập tiêu đề bài viết -->
        <div class="flex flex-col gap-2">
          <label class="text-primary_15 dark:text-gray-300">Title</label>
          <input v-model="form.title" type="text"
            class="w-full text-gray-800 drop-shadow-lg bg-white dark:bg-gray-700 rounded-lg outline-none px-1 py-1 border border-bd_primary dark:border-gray-600">
          <p v-if="errors.title" class="text-red-500 text-sm">{{ errors.title }}</p>
        </div>
        <!-- Trường nhập mô tả ngắn -->
        <div class="flex flex-col gap-2">
          <label class="text-primary_15 dark:text-gray-300">Description</label>
          <textarea v-model="form.text" type="text"
            class="dark:text-black text-gray-800 w-full drop-shadow-lg bg-white dark:bg-gray-700 rounded-lg outline-none px-1 py-1 border border-bd_primary dark:border-gray-600"
            rows="2"></textarea>
          <p v-if="errors.text" class="text-red-500 text-sm">{{ errors.text }}</p>
        </div>
        <!-- Trường nhập tiêu đề chính -->
        <div class="flex flex-col gap-2">
          <label class="text-primary_15 dark:text-gray-300">Heading</label>
          <input v-model="form.heading" type="text"
            class="dark:text-black text-gray-800 w-full drop-shadow-lg bg-white dark:bg-gray-700 rounded-lg outline-none px-1 py-1 border border-bd_primary dark:border-gray-600">
          <p v-if="errors.heading" class="text-red-500 text-sm">{{ errors.heading }}</p>
        </div>
        <!-- Trường chọn hình ảnh -->
        <div class="flex flex-col gap-2">
          <label class="text-primary_15 dark:text-gray-300">Choose image</label>
          <input @change="handleFileChange" type="file" class="dark:text-gray-300 text-gray-500">
          <p v-if="errors.image" class="text-red-500 text-sm">{{ errors.image }}</p>
        </div>
        <!-- Trường nhập nội dung bài viết -->
        <div class="flex flex-col gap-2">
          <label class="text-primary_15 dark:text-gray-300">Content</label>
          <textarea v-model="form.content" type="text"
            class="dark:text-black text-gray-800 w-full drop-shadow-lg bg-white dark:bg-gray-700 rounded-lg outline-none px-1 py-1 border border-bd_primary dark:border-gray-600"
            rows="5"></textarea>
          <p v-if="errors.content" class="text-red-500 text-sm">{{ errors.content }}</p>
        </div>
        <!-- Nút tạo bài viết -->
        <div class="flex justify-end">
          <button @click="createPost" class="bg-blue-500 text-white px-4 py-2 rounded-lg">
            <img v-if="isLoading" class="w-8 h-8" src="../assets/icons/loading.svg" alt="loading-icon" />
            <p v-else>Create Post</p>
          </button>
        </div>
      </div>
    </div>
    <!-- Hiển thị bài viết gần nhất -->
    <div
      class="md:flex hidden flex-col gap-5 px-5 py-5 bg-white dark:bg-gray-700 w-1/3 h-fit rounded-xl border border-bd_primary dark:border-gray-600">
      <div v-if="!isFetchingDataRecent">
        <h3 class="font-semibold text-xl uppercase text-center text-black dark:text-white">Recent post</h3>
        <div class="flex flex-col gap-2">
          <p class="uppercase text-primary_20 dark:text-primary_30 line-clamp-3">{{ DataRecent.title }}</p>
          <p class="text-primary_20 dark:text-primary_30 line-clamp-3">{{ DataRecent.text }}</p>
        </div>
      </div>
      <div v-if="isFetchingDataRecent" class="flex flex-col w-full">
        <Skeleton height="60px" class="dark:bg-slate-500 bg-slate-200"></Skeleton>
        <Skeleton height="30px" class="dark:bg-slate-500 bg-slate-200"></Skeleton>
        <Skeleton height="30px" class="dark:bg-slate-500 bg-slate-200"></Skeleton>
      </div>
    </div>
  </div>
  <Toast />
</template>

<script setup>
import Skeleton from 'primevue/skeleton';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { createBlog, getBlogs } from "@/api/blogsApi";
import { onMounted, ref } from "vue";

// State quản lý trạng thái tải dữ liệu
const isLoading = ref(false);
const isFetchingDataRecent = ref(false);
const DataRecent = ref([]);

// Object chứa dữ liệu form nhập từ người dùng
const form = ref({
  title: "",
  text: "",
  heading: "",
  image: null,
  content: "",
});

// Object chứa lỗi của form
const errors = ref({
  title: null,
  text: null,
  heading: null,
  image: null,
  content: null,
});

const toast = useToast();

// Hàm kiểm tra hợp lệ dữ liệu nhập
const validateField = () => {
  errors.value.title = form.value.title.trim() === "" ? "Title is required" : null;
  errors.value.text = form.value.text.trim() === "" ? "Description is required" : form.value.text.trim().length < 100 ? "Description must be at least 100 characters long" : null;
  errors.value.heading = form.value.heading.trim() === "" ? "Heading is required" : null;
  errors.value.image = form.value.image === null ? "Image is required" : null;
  errors.value.content = form.value.content.trim() === "" ? "Content is required" : form.value.content.trim().length < 300 ? "Content must be at least 300 characters long" : null;
  return Object.values(errors.value).every((error) => error === null);
};

// Hàm xử lý chọn file hình ảnh
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.image = file;
  }
};

// Hàm tạo bài viết mới
const createPost = async () => {
  isLoading.value = true;
  if (!validateField()) {
    isLoading.value = false;
    toast.add({ severity: 'warn', summary: 'Validation Error', detail: 'Please fix the errors', life: 3000 });
    return;
  }
  try {
    await createBlog(form.value);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Create success', life: 3000 });
  } catch (error) {
    console.error("Error creating post:", error);
  }
};
</script>
