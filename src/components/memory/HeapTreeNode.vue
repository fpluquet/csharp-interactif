<script setup lang="ts">
import { computed } from "vue";
import type { HeapTree } from "../../composables/layoutHeap";
import HeapObject from "./HeapObject.vue";

defineOptions({ name: "HeapTreeNode" });

const props = defineProps<{
  node: HeapTree;
  focusId?: string;
  depth: number;
  maxCols: number;
}>();

const sideways = computed(
  () => props.node.children.length > 0 && props.depth < props.maxCols - 1,
);

const childDepth = computed(() => (sideways.value ? props.depth + 1 : props.depth));
</script>

<template>
  <div class="heap-tree" :class="{ 'heap-tree--stack': node.children.length > 0 && !sideways }">
    <div class="heap-tree__slot">
      <div class="heap-tree__sizer" aria-hidden="true">
        <HeapObject :object="node.object" placeholder />
      </div>
      <div v-if="node.live" class="heap-tree__live">
        <HeapObject :object="node.live" :focus-id="focusId" />
      </div>
    </div>
    <div v-if="node.children.length" class="heap-tree__children">
      <HeapTreeNode
        v-for="child in node.children"
        :key="child.object.id"
        :node="child"
        :focus-id="focusId"
        :depth="childDepth"
        :max-cols="maxCols"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.heap-tree {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: flex-start;
  gap: 2.6rem;
}

.heap-tree--stack {
  flex-direction: column;
  gap: 0.85rem;
}

.heap-tree__slot {
  position: relative;
  flex-shrink: 0;
}

.heap-tree__sizer {
  visibility: hidden;
  pointer-events: none;
}

.heap-tree__live {
  position: absolute;
  left: 0;
  top: 0;
}

.heap-tree__children {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
</style>
