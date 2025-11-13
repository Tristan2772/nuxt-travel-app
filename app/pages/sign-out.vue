<script lang="ts" setup>
const authStore = useAuthStore();

onMounted(() => {
  authStore.signOut();
});
</script>

<template>
  <div class="card bg-base-300 container mt-4 mx-auto min-h-72  text-center flex flex-col justify-center items-center gap-4">
    <span class="loading loading-spinner loading-xl" />
  </div>
</template>
