<script setup lang="ts">
import { nextTick, ref, watch } from "vue";

const props = defineProps<{
  lines: string[];
}>();

const bodyRef = ref<HTMLElement | null>(null);

watch(
  () => props.lines.length,
  async () => {
    await nextTick();
    const el = bodyRef.value;
    if (el) el.scrollTop = el.scrollHeight;
  },
);
</script>

<template>
  <aside class="console panel">
    <p class="panel-label">Console</p>
    <div ref="bodyRef" class="console__body" aria-live="polite">
      <p v-if="!lines.length" class="console__empty">(vide)</p>
      <pre
        v-for="(line, i) in lines"
        :key="i"
        class="console__line"
      >{{ line }}</pre>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.console {
  display: flex;
  flex-direction: column;
  min-height: 0;
  max-height: 7.5rem;
  padding: 0.75rem 0.9rem 0.85rem;
  flex-shrink: 0;
  background: linear-gradient(165deg, var(--bg-console-top), var(--bg-console-end));
}

.console__body {
  margin-top: 0.4rem;
  overflow: auto;
  font-family: var(--font-code);
  font-size: 0.88rem;
  line-height: 1.45;
  min-height: 2.2rem;
}

.console__empty {
  color: var(--text-dim);
  font-style: italic;
}

.console__line {
  margin: 0;
  white-space: pre-wrap;
  color: var(--console-text);
}
</style>
