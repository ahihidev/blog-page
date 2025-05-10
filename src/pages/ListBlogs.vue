<template>
  <!-- Nếu không đang tải dữ liệu thì hiển thị bảng danh sách bài viết -->
  <div v-if="!isLoading" class="flex flex-col w-full px-[20px] md:px-[150px] bg-bg_primary pt-9 gap-2 overflow-hidden">
    <DataTable v-model:filters="filters" :value="data" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
      :globalFilterFields="['title', 'text', 'heading']">
      
      <!-- Header: Ô tìm kiếm bài viết theo tiêu đề -->
      <template #header>
        <div class="relative flex justify-end">
          <input v-model="filters['title'].value" placeholder="Search by name"
            class="border border-bd_primary outline-none shadow-lg p-2 rounded-lg" />
          <div class="absolute top-1/2 right-1 -translate-x-1/2 -translate-y-1/2">
            <Search />
          </div>
        </div>
      </template>
      
      <!-- Hiển thị thông báo khi không có dữ liệu -->
      <template #empty> No blog found. </template>
      <template #loading> Loading blog data. Please wait. </template>
      
      <!-- Cột hiển thị tiêu đề bài viết -->
      <Column field="title" header="Name" style="width: 25%">
        <template #body="{ data }">
          <div class="overflow-hidden text-ellipsis whitespace-normal break-words line-clamp-2">
            {{ data.title }}
          </div>
        </template>
      </Column>
      
      <!-- Cột hiển thị mô tả bài viết -->
      <Column field="text" header="Text" style="width: 25%">
        <template #body="{ data }">
          <div class="overflow-hidden text-ellipsis whitespace-normal break-words line-clamp-2">
            {{ data.text }}
          </div>
        </template>
      </Column>
      
      <!-- Cột hiển thị tiêu đề phụ -->
      <Column field="heading" header="Heading" style="width: 25%" class="hidden lg:table-cell">
        <template #body="{ data }">
          <div class="overflow-hidden text-ellipsis whitespace-normal break-words line-clamp-2">
            {{ data.heading }}
          </div>
        </template>
      </Column>
      
      <!-- Cột hiển thị nội dung bài viết -->
      <Column field="content" header="Content" style="width: 25%" class="hidden lg:table-cell">
        <template #body="{ data }">
          <div class="overflow-hidden text-ellipsis whitespace-normal break-words line-clamp-2">
            {{ data.content }}
          </div>
        </template>
      </Column>
      
      <!-- Cột chứa nút xóa bài viết -->
      <Column header="Delete" style="width: 20%">
        <template #body="{ data }">
          <button @click="deleteItem(data.id)" class="text-red-500 flex justify-center items-center">
            <Trash2 />
          </button>
        </template>
      </Column>
      
      <!-- Cột chứa nút chỉnh sửa bài viết -->
      <Column header="Edit" style="width: 20%">
        <template #body="{ data }">
          <button @click="handleEdit(data)" class="text-blue-500 flex justify-center items-center">
            <FilePenLine />
          </button>
        </template>
      </Column>
    </DataTable>
  </div>
  
  <!-- Dialog chỉnh sửa bài viết -->
  <Dialog v-model:visible="visible" modal header="Edit Blog" :style="{ width: '50vw' }">
    <div class="flex flex-col gap-4">
      <label>Title</label>
      <input v-model="selectedItem.title" class="border p-2 rounded-md" />
      <label>Description</label>
      <input v-model="selectedItem.text" class="border p-2 rounded-md" />
      <label>Heading</label>
      <input v-model="selectedItem.heading" class="border p-2 rounded-md" />
      <label>Content</label>
      <textarea v-model="selectedItem.content" class="border p-2 rounded-md" rows="5"></textarea>
      <label>Choose image</label>
      <input @change="handleFileChange" type="file">
      <div class="flex justify-end gap-2">
        <button @click="visible = false" class="bg-red-500 text-white px-4 py-2 rounded-lg">Cancel</button>
        <button @click="updateBlog" class="bg-blue-500 text-white px-4 py-2 rounded-lg">Update</button>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { deleteBlogById, getBlogs, updateBlogById } from '@/api/blogsApi';
import { Trash2, FilePenLine, Search } from 'lucide-vue-next';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import { FilterMatchMode } from '@primevue/core/api';

const data = ref([]);
const visible = ref(false);
const isLoading = ref(false);
const selectedItem = ref({ title: '', text: '', heading: '', content: '' });
const selectedFile = ref(null);
const toast = useToast();

// Hàm lấy danh sách bài viết từ API
const fetchData = async () => {
  isLoading.value = true;
  try {
    const response = await getBlogs();
    data.value = response.result;
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    isLoading.value = false;
  }
};

// Hàm xử lý khi chọn file ảnh
const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};

// Hàm xóa bài viết
const deleteItem = async (itemId) => {
  const res = await deleteBlogById(itemId);
  if (res === 200) {
    toast.add({ severity: 'success', summary: 'Success', detail: 'Deleted successfully', life: 3000 });
    fetchData();
  }
};

// Hàm mở dialog chỉnh sửa bài viết
const handleEdit = (data) => {
  selectedItem.value = { ...data };
  visible.value = true;
};

// Hàm cập nhật bài viết
const updateBlog = async () => {
  try {
    const form = new FormData();
    form.append('title', selectedItem.value.title);
    form.append('text', selectedItem.value.text);
    form.append('heading', selectedItem.value.heading);
    form.append('content', selectedItem.value.content);
    if (selectedFile.value) {
      form.append('imageurl', selectedFile.value);
    }
    await updateBlogById(selectedItem.value.id, form);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Updated successfully', life: 3000 });
    visible.value = false;
    fetchData();
  } catch (error) {
    console.error('Error updating blog:', error);
  }
};

onMounted(fetchData);
</script>
