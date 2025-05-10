<template>
    <div class="flex flex-col justify-between">
        <NavbarPage />
        <main>
            <div class="content min-h-fit min-w-fit">
                <router-view />
            </div>
        </main>
        <FooterPage />
    </div>
</template>

<script setup>
import NavbarPage from '@/components/NavbarPage.vue';
import FooterPage from '@/components/FooterPage.vue';
</script>
