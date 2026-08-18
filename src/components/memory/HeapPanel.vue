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
      <p class="panel-label">Heap</p>
      <h2 class="heap-panel__title">Objets dynamiques</h2>
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

      <Transition name="memory-empty">
        <div v-if="!objects.length" class="heap-panel__empty">
          <span>Heap vide</span>
        </div>
      </Transition>
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
  margin-bottom: 0.85rem;
}

.heap-panel__title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 550;
  color: var(--heap);
  margin-top: 0.15rem;
}

.heap-panel__body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 0.25rem;
}

.heap-panel__objects {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 0.85rem;
  align-items: flex-start;
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
