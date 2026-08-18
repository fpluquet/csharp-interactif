<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { layoutHeapForest } from "../../composables/layoutHeap";
import type { HeapObject as HeapObjectType, RefLink, Step } from "../../types/memory";
import HeapTreeNode from "./HeapTreeNode.vue";

const props = defineProps<{
  objects: HeapObjectType[];
  refs?: RefLink[];
  steps?: Step[];
  focusId?: string;
}>();

const forest = computed(() =>
  layoutHeapForest(props.objects, props.refs ?? [], props.steps ?? []),
);

const bodyRef = ref<HTMLElement | null>(null);
const maxCols = ref(2);

const COL_REM = 9.5;
const GAP_REM = 2.6;

let resizeObserver: ResizeObserver | null = null;

function remPx(n: number) {
  return n * parseFloat(getComputedStyle(document.documentElement).fontSize || "16");
}

function notifyArrows() {
  window.setTimeout(() => {
    bodyRef.value?.closest(".memory-view")?.dispatchEvent(new Event("heap-layout"));
  }, 40);
}

function measureMaxCols() {
  const body = bodyRef.value;
  if (!body) return;
  const width = body.clientWidth;
  let col = remPx(COL_REM);
  for (const el of body.querySelectorAll<HTMLElement>(".heap-object")) {
    col = Math.max(col, el.offsetWidth);
  }
  const gap = remPx(GAP_REM);
  const next = Math.max(1, Math.floor((width + gap) / (col + gap)));
  if (next !== maxCols.value) {
    maxCols.value = next;
    notifyArrows();
  }
}

watch(
  () => props.objects,
  () => {
    void nextTick(() => {
      measureMaxCols();
      notifyArrows();
    });
  },
);

onMounted(() => {
  measureMaxCols();
  if (bodyRef.value && "ResizeObserver" in window) {
    resizeObserver = new ResizeObserver(() => measureMaxCols());
    resizeObserver.observe(bodyRef.value);
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});
</script>

<template>
  <section class="heap-panel">
    <header class="heap-panel__header">
      <p class="panel-label">Heap</p>
      <h2 class="heap-panel__title">Objets dynamiques</h2>
    </header>

    <div ref="bodyRef" class="heap-panel__body">
      <div v-if="objects.length" class="heap-forest">
        <HeapTreeNode
          v-for="node in forest"
          :key="node.object.id"
          :node="node"
          :focus-id="focusId"
          :depth="0"
          :max-cols="maxCols"
        />
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
  min-width: 0;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0.25rem 0.35rem 0.25rem 0.25rem;
}

.heap-forest {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.1rem;
  max-width: 100%;
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
