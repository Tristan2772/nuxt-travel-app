<script lang="ts" setup>
import { useSidebarStore } from "~/stores/sidebar";

const isSidebarOpen = ref(true);
const sidebarStore = useSidebarStore();

const route = useRoute();
const locationsStore = useLocationStore();

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
  if (route.path !== "/dashboard") {
    locationsStore.refresh();
  }
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
        <div v-if="sidebarStore.loading || sidebarStore.sidebarItems.length" class="divider" />
        <div v-if="sidebarStore.loading" class="px-4">
          <div class="skeleton h-4 w-full" />
        </div>
        <div v-if="!sidebarStore.loading && sidebarStore.sidebarItems.length" class="flex flex-col">
          <AppSidebarButton
            v-for="item in sidebarStore.sidebarItems"
            :key="item.id"
            :show-label="isSidebarOpen"
            :label="item.label"
            :icon="item.icon"
            :href="item.href"
          />
        </div>
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
