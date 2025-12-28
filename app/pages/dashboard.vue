<script lang="ts" setup>
import { CURRENT_LOCATION_PAGES, EDIT_PAGES, LOCATION_PAGES } from "~~/lib/constants";

import { useSidebarStore } from "~/stores/sidebar";
import { isPointSelected } from "~/utils/map-points";

const isSidebarOpen = ref(true);
const sidebarStore = useSidebarStore();

const route = useRoute();
const locationsStore = useLocationStore();

const mapStore = useMapStore();

const { currentLocation, currentLocationStatus } = storeToRefs(locationsStore);

if (LOCATION_PAGES.has(route.name?.toString() || "")) {
  await locationsStore.refreshLocations();
}

if (CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")) {
  await locationsStore.refreshCurrentLocation();
}
onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
});

effect(() => {
  if (LOCATION_PAGES.has(route.name?.toString() || "")) {
    sidebarStore.sidebarTopItems = [{
      id: "link-dashboard",
      label: "Locations",
      href: "/dashboard",
      icon: "tabler:map",
    }, {
      id: "link-location-add",
      label: "Add Location",
      href: "/dashboard/add",
      icon: "tabler:plus",
    }];
  }
  else if (CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")) {
    sidebarStore.sidebarTopItems = [{
      id: "link-dashboard",
      label: currentLocationStatus.value === "pending" ? "Loading..." : "Go back",
      href: "/dashboard",
      icon: "tabler:arrow-left",
    }, {
      id: "link-location-slug",
      label: currentLocation.value ? currentLocation.value.name : "View Logs",
      to: {
        name: "dashboard-location-slug",
        params: {
          slug: currentLocation.value?.slug ?? route.params.slug,
        },
      },
      icon: "tabler:map",
    }, {
      id: "link-location-edit",
      label: "Edit Location",
      to: {
        name: "dashboard-location-slug-edit",
        params: {
          slug: currentLocation.value?.slug ?? route.params.slug,
        },
      },
      icon: "tabler:map-pin-cog",
    }, {
      id: "link-location-add",
      label: "Add Location Log",
      to: {
        name: "dashboard-location-slug-add",
        params: {
          slug: currentLocation.value?.slug ?? route.params.slug,
        },
      },
      icon: "tabler:plus",
    }];
  }
});

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem("isSidebarOpen", isSidebarOpen.value.toString());
}
</script>

<template>
  <div class="flex flex-1">
    <div class="bg-base-100 transition-all duration-200 shrink-0" :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }">
      <div class="flex cursor-pointer hover:bg-base-200 p-2" :class="{ 'justify-end': isSidebarOpen, 'justify-center': !isSidebarOpen } " @click="toggleSidebar">
        <Icon v-if="isSidebarOpen" name="tabler:chevron-left" size="32px" />
        <Icon v-if="!isSidebarOpen" name="tabler:chevron-right" size="32px" />
      </div>
      <div class="flex flex-col">
        <AppSidebarButton
          v-for="topItem in sidebarStore.sidebarTopItems"
          :key="topItem.id"
          :show-label="isSidebarOpen"
          :label="topItem.label"
          :icon="topItem.icon"
          :href="topItem.href"
          :to="topItem.to"
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
            :icon-color="isPointSelected(item.mapPoint, mapStore.selectedPoint) ? 'text-primary' : undefined"
            :to="item.to"
            :class="{ 'bg-base-300': isPointSelected(item.mapPoint, mapStore.selectedPoint) }"
            @mouseenter="mapStore.selectedPoint = item.mapPoint ?? null;"
            @mouseleave="mapStore.selectedPoint = null;"
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
    <div class="flex-1 overflow-auto bg-base-200">
      <div
        class="flex size-full"
        :class="{
          'flex-col': !EDIT_PAGES.has(route.name?.toString() || ''),
        }"
      >
        <NuxtPage
          :class="{
            'shrink-0': EDIT_PAGES.has(route.name?.toString() || ''),
            'w-96': EDIT_PAGES.has(route.name?.toString() || ''),
          }"
        />
        <AppMap class="flex-1" />
      </div>
    </div>
  </div>
</template>
