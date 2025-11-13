<script setup lang="ts">
const route = useRoute();
const error = route.query.error || "an unknown error occured";
</script>

<template>
  <div class="card bg-base-300 container mt-4 mx-auto min-h-72  text-center flex flex-col justify-center items-center gap-4">
    <div class="alert alert-error min-w-1/2 text-center" role="alert">
      <p>Whoops! Something went wrong: {{ error }}</p>
    </div>
    <NuxtLink to="/" class="btn btn-primary ">
      Home <Icon name="tabler:arrow-left" size="24px" />
    </NuxtLink>
  </div>
</template>
