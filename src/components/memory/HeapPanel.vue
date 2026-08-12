<script setup lang="ts">
import type { HeapObject as HeapObjectType } from "../../types/memory";
import HeapObject from "./HeapObject.vue";

defineProps<{
  objects: HeapObjectType[];
  focusId?: string;
}>();
</script>

<template>
  <section class="heap-panel">
    <header class="heap-panel__header">
      <div>
        <p class="panel-label">Heap</p>
        <h2 class="heap-panel__title">Objets dynamiques</h2>
      </div>
      <p class="heap-panel__hint">taille variable · partagés</p>
    </header>

    <div class="heap-panel__body">
      <TransitionGroup name="heap-object" tag="div" class="heap-panel__objects">
        <HeapObject
          v-for="obj in objects"
          :key="obj.id"
          :object="obj"
          :focus-id="focusId"
        />
      </TransitionGroup>

      <div v-if="!objects.length" class="heap-panel__empty">
        <span>Heap vide</span>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.heap-panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
}

.heap-panel__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.85rem;
}

.heap-panel__title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 550;
  color: var(--heap);
  margin-top: 0.15rem;
}

.heap-panel__hint {
  font-size: 0.78rem;
  color: var(--text-dim);
}

.heap-panel__body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 0.25rem;
}

.heap-panel__objects {
  display: flex;
  flex-wrap: wrap;
  gap: 1.15rem 1.35rem;
  align-content: flex-start;
}

.heap-panel__empty {
  display: grid;
  place-items: center;
  min-height: 8rem;
  border: 1px dashed var(--heap-border);
  border-radius: var(--radius);
  color: var(--text-dim);
  font-size: 0.9rem;
}
</style>
