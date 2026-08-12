<script setup lang="ts">
import type { StackFrame as StackFrameType } from "../../types/memory";
import StackFrame from "./StackFrame.vue";

defineProps<{
  frames: StackFrameType[];
  focusId?: string;
}>();
</script>

<template>
  <section class="stack-panel">
    <header class="stack-panel__header">
      <p class="panel-label">Stack</p>
      <h2 class="stack-panel__title">Call stack</h2>
    </header>

    <div class="stack-panel__body">
      <TransitionGroup name="stack-frame" tag="div" class="stack-panel__frames">
        <StackFrame
          v-for="(frame, index) in [...frames].reverse()"
          :key="frame.id"
          :frame="frame"
          :focus-id="focusId"
          :is-top="index === 0"
        />
      </TransitionGroup>

      <div v-if="!frames.length" class="stack-panel__empty">
        <span>Stack vide</span>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.stack-panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
}

.stack-panel__header {
  margin-bottom: 0.85rem;
}

.stack-panel__title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 550;
  color: var(--stack);
  margin-top: 0.15rem;
}

.stack-panel__body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 0.25rem;
}

.stack-panel__frames {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.stack-panel__empty {
  display: grid;
  place-items: center;
  min-height: 8rem;
  border: 1px dashed var(--stack-border);
  border-radius: var(--radius);
  color: var(--text-dim);
  font-size: 0.9rem;
}
</style>
