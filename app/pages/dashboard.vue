<script lang="ts" setup>
const isSidebarOpen = ref(true);

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
});

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem("isSidebarOpen", isSidebarOpen.value.toString());
}
</script>

<template>
  <div class="flex flex-1">
    <div class="bg-base-100 transition-all duration-200" :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }">
      <div class="flex cursor-pointer hover:bg-base-200 p-2" :class="{ 'justify-end': isSidebarOpen, 'justify-center': !isSidebarOpen } " @click="toggleSidebar">
        <Icon v-if="isSidebarOpen" name="tabler:chevron-left" size="32px" />
        <Icon v-if="!isSidebarOpen" name="tabler:chevron-right" size="32px" />
      </div>
      <div class="flex flex-col">
        <AppSidebarButton
          :show-label="isSidebarOpen"
          label="Locations"
          icon="tabler:map"
          href="/dashboard"
        />
        <AppSidebarButton
          :show-label="isSidebarOpen"
          label="Add Location"
          icon="tabler:plus"
          href="/dashboard/add"
        />
        <div class="divider" />
        <AppSidebarButton
          :show-label="isSidebarOpen"
          label="Sign Out"
          icon="tabler:logout-2"
          href="/sign-out"
        />
      </div>
    </div>
    <!-- ----------main content --------------- -->
    <div class="flex-1">
      <NuxtPage />
    </div>
  </div>
</template>
