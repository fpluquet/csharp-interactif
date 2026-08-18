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
    <HeapObject :object="node.object" :focus-id="focusId" />
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

.heap-tree__children {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
</style>
