<script lang="ts" setup>
import type { NominatimResult } from "~~/lib/types";
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";
import { CENTER_USA } from "~~/lib/constants";
import { InsertLocation } from "~~/lib/db/schema";

const { $csrfFetch } = useNuxtApp();

const mapStore = useMapStore();

const loading = ref(false);
const router = useRouter();
const submitError = ref("");
const submitted = ref(false);
const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm({
  validationSchema: toTypedSchema(InsertLocation),
  initialValues: {
    name: "",
    description: "",
    long: (CENTER_USA as [number, number])[0],
    lat: (CENTER_USA as [number, number])[1],
  },
});

function formatNumber(value?: number) {
  if (!value) {
    return 0;
  }
  return value.toFixed(5);
}

function searchResultSelected(result: NominatimResult) {
  setFieldValue("name", result.display_name);
  mapStore.newPoint = {
    id: 1,
    name: "New Point",
    description: "",
    long: Number(result.lon),
    lat: Number(result.lat),
    centerMap: true,
  };
}

effect(() => {
  if (mapStore.newPoint) {
    setFieldValue("long", mapStore.newPoint.long);
    setFieldValue("lat", mapStore.newPoint.lat);
  }
});

onMounted(() => {
  mapStore.newPoint = {
    id: 1,
    name: "New Point",
    description: "",
    long: (CENTER_USA as [number, number])[0],
    lat: (CENTER_USA as [number, number])[1],
  };
});

const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = "";
    loading.value = true;

    await $csrfFetch("/api/locations", {
      method: "post",
      body: values,
    });
    submitted.value = true;
    navigateTo("/dashboard");
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data?.data) {
      setErrors(error.data?.data);
    }
    submitError.value = getFetchErrorMessage(error);
  }
  loading.value = false;
});

onBeforeRouteLeave(() => {
  if (!submitted.value && meta.value.dirty) {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm("Are you sure you want to leave? All unsaved changes will not be saved.");
    if (!confirm) {
      return false;
    }
  }
  mapStore.newPoint = null;
  return true;
});
</script>

<template>
  <div class="container max-w-md mx-auto p-4 pb-10 overflow-y-auto">
    <div class="my-6">
      <h1 class="text-lg">
        Add Location
      </h1>
      <p class="text-sm">
        Add a location that you have visited or want to visit. You can add a city, state, country, or point
        of interest. You can add photos to specific locations later.
      </p>
    </div>
    <div v-if="submitError" role="alert" class="alert alert-error">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{{ submitError }}</span>
    </div>
    <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
      <AppFormInput
        label="Name: "
        name="name"
        component="input"
        :error="errors.name"
        :disabled="loading"
      />
      <AppFormInput
        label="Description: "
        name="description"
        component="textarea"
        type="textarea"
        :error="errors.description"
        :disabled="loading"
      />
      <p class="text-xs text-gray-400">
        Current Coordinates: {{ formatNumber(controlledValues.lat) }}, {{ formatNumber(controlledValues.long) }}
      </p>
      <p>To set the Coordinates:</p>
      <ul class="list-disc ml-4 text-sm">
        <li>Drag the <Icon name="tabler:map-pin-filled" class="text-warning" /> marker.</li>
        <li>Double click on the map.</li>
        <li>Search for a location below.</li>
      </ul>
      <div class="flex justify-end gap-2">
        <button
          :disabled="loading"
          type="button"
          class="btn btn-outline"
          @click="router.back()"
        >
          <Icon name="tabler:arrow-left" size="24px" />Cancel
        </button>
        <button :disabled="loading" type="submit" class="btn btn-primary">
          Add
          <span v-if="loading" class="loading loading-spinner loading-sm" />
          <Icon v-else name="tabler:plus" size="24px" />
        </button>
      </div>
    </form>
    <div class="divider" />
    <AppPlaceSearch @result-selected="searchResultSelected" />
  </div>
</template>
