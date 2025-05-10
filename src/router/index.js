import HomePage from "@/pages/HomePage.vue";
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { createRouter, createWebHistory } from "vue-router";
import BlogDetail from "@/pages/BlogDetail.vue";
import CreateBlog from "@/pages/CreateBlog.vue";
import ListBlogs from "@/pages/ListBlogs.vue";
const routes  = [
    {
        path: '/',
        component: DefaultLayout,
        children: [
            {
                path: '/',
                name: 'home',
                component: HomePage
            },
            {
                path: '/blog/:id',
                name: 'BlogDetail',
                component: BlogDetail,
            },
            {
                path: '/blog/create',
                name: 'CreateBlog',
                component: CreateBlog,
            },
            {
                path: '/blog/list',
                name: 'ListBlogs',
                component: ListBlogs,
            }
        ]
    },

]

const router = createRouter({
    history: createWebHistory(),
    routes,
  });

export default router;
