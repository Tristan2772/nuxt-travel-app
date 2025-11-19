<script lang="ts" setup>
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";
import { InsertLocation } from "~~/lib/db/schema";

const { $csrfFetch } = useNuxtApp();

const loading = ref(false);
const router = useRouter();
const submitError = ref("");
const submitted = ref(false);

const { handleSubmit, errors, meta, setErrors } = useForm({
  validationSchema: toTypedSchema(InsertLocation),
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
    submitError.value = error.statusMessage || "An unknown error occurred.";
  }
  loading.value = false;
});

onBeforeRouteLeave(() => {
  if (meta.value.dirty) {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm("Are you sure you want to leave? All unsaved changes will not be saved.");
    if (!confirm) {
      return false;
    }
  }
  return true;
});
</script>

<template>
  <div class="container max-w-md mx-auto ">
    <div class="my-6 text-center">
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
      <AppFormInput
        label="Latitude: "
        name="lat"
        component="input"
        type="number"
        :error="errors.lat"
        :disabled="loading"
      />
      <AppFormInput
        label="Longtude: "
        name="long"
        component="input"
        type="number"
        :error="errors.long"
        :disabled="loading"
      />
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
  </div>
</template>
