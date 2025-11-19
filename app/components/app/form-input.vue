<script lang="ts" setup>
const props = defineProps<{
  label: string;
  name: string;
  component: string;
  type?: "text" | "textarea" | "number";
  error?: string;
  disabled?: boolean;
}>();
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ props.label }}
    </legend>
    <Field
      :as="props.component"
      :name="props.name"
      :type="props.type"
      :disabled="disabled"
      class="w-full"
      :class="{
        'input': !props.type || props.type === 'text' || 'number',
        'textarea': props.type === 'textarea',
        'input-error': props.error }"
    />
    <p v-if="props.error" class="label text-error">
      {{ props.error }}
    </p>
  </fieldset>
</template>
