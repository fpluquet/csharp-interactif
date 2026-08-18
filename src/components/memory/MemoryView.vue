<script setup lang="ts">
import { computed } from "vue";
import type { FrameCursor } from "../../composables/useFrameCursors";
import { orderHeapObjects } from "../../composables/layoutHeap";
import type { HeapObject, RefLink, StackFrame } from "../../types/memory";
import StackPanel from "./StackPanel.vue";
import HeapPanel from "./HeapPanel.vue";
import RefArrows from "./RefArrows.vue";

const props = defineProps<{
  stack: StackFrame[];
  heap: HeapObject[];
  refs: RefLink[];
  focusId?: string;
  stepId?: string;
  cursors?: Map<string, FrameCursor>;
  code?: string[];
}>();

const laidOutHeap = computed(() =>
  orderHeapObjects(props.heap, props.stack, props.refs),
);
</script>

<template>
  <div class="memory-view panel">
    <div class="memory-view__legend">
      <span class="legend legend--stack">Stack · types valeur</span>
      <span class="legend legend--heap">Heap · objets / références</span>
    </div>

    <div class="memory-view__grid">
      <StackPanel :frames="stack" :focus-id="focusId" :cursors="cursors" :code="code" />
      <div class="memory-view__divider" aria-hidden="true" />
      <HeapPanel :objects="laidOutHeap" :focus-id="focusId" />
    </div>

    <RefArrows :refs="refs" :step-id="stepId" />
  </div>
</template>

<style scoped lang="scss">
.memory-view {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 1.1rem 1.2rem 1.25rem;
  overflow: hidden;
}

.memory-view__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  margin-bottom: 0.9rem;
}

.legend {
  position: relative;
  padding-left: 1rem;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--text-muted);

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.35em;
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 2px;
  }

  &--stack::before {
    background: var(--stack);
  }

  &--heap::before {
    background: var(--heap);
  }
}

.memory-view__grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 1px minmax(0, 1.15fr);
  gap: 1rem;
  flex: 1;
  min-height: 280px;
}

.memory-view__divider {
  background: linear-gradient(
    180deg,
    transparent,
    var(--border),
    transparent
  );
}

@media (max-width: 900px) {
  .memory-view__grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }

  .memory-view__divider {
    height: 1px;
    width: 100%;
    background: linear-gradient(90deg, transparent, var(--border), transparent);
  }
}
</style>
