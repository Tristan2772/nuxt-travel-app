<script lang="ts" setup>
import type { NominatimResult } from "~~/lib/types";
import type { FetchError } from "ofetch";

import { SearchSchema } from "~~/lib/zod-schemas";

const emit = defineEmits<{
  resultSelected: [result: NominatimResult];
}>();
const searchResults = ref<NominatimResult[]>([]);
const form = useTemplateRef("form");
const loading = ref(false);
const errorMessage = ref("");
const hasSearched = ref(false);

async function onSubmit(query: Record<string, string>) {
  try {
    loading.value = true;
    hasSearched.value = true;
    searchResults.value = [];
    errorMessage.value = "";
    const results = await $fetch("/api/search", {
      query,
    });
    searchResults.value = results;
  }
  catch (e) {
    const error = e as FetchError;
    errorMessage.value = getFetchErrorMessage(error);
  }
  loading.value = false;
}
function setLocation(result: NominatimResult) {
  emit("resultSelected", result);
  hasSearched.value = true;
  searchResults.value = [];
  errorMessage.value = "";
  if (form.value) {
    form.value.resetForm();
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <Form
      ref="form"
      v-slot="{ errors }"
      class="flex flex-col gap-2 items-center"
      :validation-schema="toTypedSchema(SearchSchema)"
      :initial-values="{
        q: '' }"
      @submit="onSubmit"
    >
      <div class="join mt-4">
        <div>
          <label class="input validator join-item">
            <Icon name="tabler:search" />
            <Field
              type="text"
              name="q"
              :disabled="loading"
              placeholder="Search for a place..."
              :class="{ 'input-error': errors.q }"
              required
            /></label>
          <div v-if="errors.q" class="validator-hint text-error">
            {{ errors.q }}
          </div>
        </div>
        <button class="btn btn-neutral join-item" :disabled="loading">
          Search
        </button>
      </div>
    </Form>
    <div v-if="!loading && errorMessage" role="alert" class="alert alert-error">
      {{ errorMessage }}
    </div>
    <div v-if="!loading && hasSearched && !searchResults.length" role="alert" class="alert alert-warning">
      No results found.
    </div>
    <div v-if="loading" class="flex justify-center">
      <div class="loading loading-lg" />
    </div>

    <div class="flex flex-col overflow-auto gap-2 max-h-72 mt-2">
      <div v-for="result in searchResults" :key="result.place_id" class="card card-sm bg-base-100">
        <div class="card-body">
          <div class="card-title">
            <h4> {{ result.display_name }}</h4>
          </div>
          <div class="justify-end card-actions">
            <button class="btn btn-warning btn-sm" @click="setLocation(result)">
              Set as Location
              <Icon name="tabler:map-pin-share" size="20px" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
