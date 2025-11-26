<script lang="ts" setup>

import { CENTER_USA } from "~~/lib/constants";

const colorMode = useColorMode();
const mapStore = useMapStore();

const style = computed(() => colorMode.value === "dark" ? "/styles/dark.json" : "https://tiles.openfreemap.org/styles/liberty");
const zoom = 6;

function updateNewPoint(location: LngLat) {
  if (mapStore.newPoint) {
    mapStore.newPoint.lat = location.lat;
    mapStore.newPoint.long = location.lng;
  }
}

function onDoubleClick(mglEvent: MglEvent<"dblclick">) {
  if (mapStore.newPoint) {
    mapStore.newPoint.lat = mglEvent.event.lngLat.lat;
    mapStore.newPoint.long = mglEvent.event.lngLat.lng;
  }
}

onMounted(() => {
  mapStore.init();
});
</script>

<template>
  <MglMap
    :map-style="style"
    :center="CENTER_USA"
    :zoom="zoom"
    @map:dblclick="onDoubleClick"
  >
    <MglNavigationControl />

    <mgl-marker
      v-if="mapStore.newPoint"
      :coordinates="[mapStore.newPoint.long, mapStore.newPoint.lat]"
      draggable
      class-name="z-50"
      @update:coordinates="updateNewPoint"
    >
      <template #marker>
        <div class="tooltip tooltip-top tooltip-open" data-tip="Drag to desired location!">
          <Icon
            name="tabler:map-pin-filled"
            size="30px"
            class="text-warning hover:cursor-pointer"
          />
        </div>
      </template>
    </mgl-marker>

    <mgl-marker
      v-for="point in mapStore.mapPoints"
      :key="point.id"
      :coordinates="[point.long, point.lat]"
    >
      <template #marker>
        <div class="tooltip tooltip-top" :class="{ 'tooltip-open': mapStore.selectedPointId === point.id }" :data-tip="point.name">
          <Icon
            name="tabler:map-pin-filled"
            size="30px"
            class="hover:text-primary hover:cursor-pointer"
            :class="mapStore.selectedPointId === point.id ? 'text-primary' : 'text-secondary' "
            @mouseenter="mapStore.selectedPointId = point.id;"
            @mouseleave="mapStore.selectedPointId = null; "
          />
        </div>
      </template>
      <mgl-popup>
        <h3 class="text-xl">
          {{ point.name }}
        </h3>
        <p v-if="point.description">
          {{ point.description }}
        </p>
      </mgl-popup>
    </mgl-marker>
  </MglMap>
</template>
