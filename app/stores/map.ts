import type { MapPoint } from "~~/lib/types";
import type { LngLatBounds } from "maplibre-gl";

export const useMapStore = defineStore("useMapStore", () => {
  const mapPoints = ref<MapPoint[]>([]);
  const selectedPointId = ref<number | null>(null);
  const selectedPointLat = ref<number | undefined>(undefined);
  const selectedPointLong = ref<number | undefined>(undefined);

  async function init() {
    const { useMap } = await import("@indoorequal/vue-maplibre-gl");
    const { LngLatBounds } = await import("maplibre-gl");

    const myMap = useMap();

    let bounds: LngLatBounds | null = null;

    effect(() => {
      const firstPoint = mapPoints.value[0];
      if (!firstPoint)
        return;
      bounds = mapPoints.value.reduce((bounds, point) => {
        return bounds.extend([point.long, point.lat]);
      }, new LngLatBounds(
        [firstPoint.long, firstPoint.lat],
        [firstPoint.long, firstPoint.lat],
      ));

      myMap.map?.fitBounds(bounds, {
        padding: 60,
      });
    });

    effect(() => {
      if (selectedPointLong.value && selectedPointLat.value) {
        myMap.map?.flyTo({
          center: [selectedPointLong.value, selectedPointLat.value],
          speed: 0.2,
          curve: 1,
        });
      }
      else if (bounds) {
        myMap.map?.fitBounds(bounds, {
          padding: 60,
        });
      }
    });
  }
  return {
    init,
    mapPoints,
    selectedPointId,
    selectedPointLat,
    selectedPointLong,
  };
});
