<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

const props = defineProps<{
  label: string;
  icon: string;
  href?: string;
  to?: RouteLocationRaw;
  showLabel: boolean;
  iconColor?: "text-accent" | "text-primary";
}>();

const route = useRoute();
</script>

<template>
  <div class="tooltip-right" :class="{ tooltip: !showLabel } " :data-tip="showLabel ? undefined : props.label">
    <NuxtLink :to="props.href || props.to" :class="{ 'bg-base-200': route.path === props.href, 'justify-start': showLabel, 'justify-center': !showLabel }" class=" flex flex-nowrap items-center gap-2 p-2 hover:bg-base-300 hover:cursor-pointer">
      <Icon :name="props.icon" size="24px" :class="iconColor" />
      <Transition name="grow">
        <span v-if="showLabel">
          {{ props.label }}
        </span>
      </Transition>
    </NuxtLink>
  </div>
</template>

<style scoped>
.grow-enter-active {
  animation: grow 200ms;
}

@keyframes grow {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
