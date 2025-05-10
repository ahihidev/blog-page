<template>
  <div class="flex flex-row w-full gap-5 bg-white dark:bg-gray-800 px-3 py-3 rounded-md">
    <div class="md:w-1/5 lg:w-1/5 xl:w-1/5 w-2/5">
      <img :src="img" :alt="img" class="w-full h-full rounded-md"/>
    </div>
    <div class="w-3/5 flex flex-col">
      <p class="md:text-[12px] sm:text-[15px] text-[6px] uppercase text-gray-800 dark:text-gray-300">
        <span class="text-primary_20 dark:text-primary_30">by</span> TOMAS LAURINAVICIUS
        <span class="text-primary_20 dark:text-primary_30">in</span> DESIGN PROCESS
      </p>
      <h2 class="md:text-[26px] sm:text-[20px] text-[16px] font-semibold overflow-hidden text-ellipsis whitespace-normal break-words xl:line-clamp-2 md:line-clamp-2 lg:line-clamp-2 sm:line-clamp-2 line-clamp-1 text-black dark:text-white">
        {{ title }}
      </h2>
      <p class="md:text-[16px] sm:text-[13px] text-[10px] text-primary_20 dark:text-primary_30 overflow-hidden text-ellipsis whitespace-normal break-words xl:line-clamp-2 md:line-clamp-2 lg:line-clamp-2 sm:line-clamp-2 line-clamp-1">
        {{ text }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  img: String,
  title: String,
  text: String
})
</script>
