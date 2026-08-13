<script setup lang="ts">
defineProps<{
  text: string;
  stepLabel: string;
}>();
</script>

<template>
  <aside class="narration panel">
    <p class="panel-label">{{ stepLabel }}</p>
    <Transition name="fade-slide" mode="out-in">
      <p :key="text" class="narration__text">{{ text }}</p>
    </Transition>
  </aside>
</template>

<style scoped lang="scss">
.narration {
  padding: 1rem 1.15rem;
  min-height: 5.5rem;
  flex-shrink: 0;
}

.narration__text {
  margin-top: 0.4rem;
  font-size: 1.12rem;
  line-height: 1.45;
  color: var(--text);
}
</style>
