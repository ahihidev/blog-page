<template>
    <div>
        <button class="bg-btn_primary text-white px-5 py-2 rounded-lg">{{ title }}</button>
    </div>
</template>

<script setup>
defineProps({
    title: String
})
</script>