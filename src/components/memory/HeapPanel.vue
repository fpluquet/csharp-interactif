<script setup lang="ts">
import { computed } from "vue";
import type { HeapObject as HeapObjectType } from "../../types/memory";
import HeapObject from "./HeapObject.vue";

const props = defineProps<{
  objects: HeapObjectType[];
  layout?: HeapObjectType[];
  focusId?: string;
}>();

const liveById = computed(() => new Map(props.objects.map((obj) => [obj.id, obj])));

const slots = computed(() => {
  const plan = props.layout ?? [];
  const used = new Set(plan.map((obj) => obj.id));
  const extras = props.objects.filter((obj) => !used.has(obj.id));
  return [...plan, ...extras].map((prototype) => ({
    id: prototype.id,
    live: liveById.value.get(prototype.id),
    prototype,
  }));
});
</script>

<template>
  <section class="heap-panel">
    <header class="heap-panel__header">
      <p class="panel-label">Heap</p>
      <h2 class="heap-panel__title">Objets dynamiques</h2>
    </header>

    <div class="heap-panel__body">
      <div v-if="objects.length" class="heap-panel__objects">
        <div v-for="slot in slots" :key="slot.id" class="heap-slot">
          <HeapObject
            v-if="slot.live"
            :object="slot.live"
            :focus-id="focusId"
          />
          <div v-else class="heap-slot__reserve" aria-hidden="true">
            <HeapObject :object="slot.prototype" placeholder />
          </div>
        </div>
      </div>

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

.heap-slot {
  max-width: 100%;
}

.heap-slot__reserve {
  visibility: hidden;
  pointer-events: none;
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
