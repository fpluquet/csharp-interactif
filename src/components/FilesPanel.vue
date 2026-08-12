<script setup lang="ts">
import type { VirtualFile } from "../types/memory";

defineProps<{
  files: VirtualFile[];
}>();
</script>

<template>
  <aside class="files panel">
    <p class="panel-label">Fichiers</p>
    <div v-if="!files.length" class="files__empty">(aucun fichier)</div>
    <ul v-else class="files__list">
      <li v-for="file in files" :key="file.path" class="file">
        <p class="file__path">{{ file.path }}</p>
        <pre class="file__content">{{ file.content || "(vide)" }}</pre>
      </li>
    </ul>
  </aside>
</template>

<style scoped lang="scss">
.files {
  display: flex;
  flex-direction: column;
  min-height: 0;
  max-height: 9rem;
  padding: 0.75rem 0.9rem 0.85rem;
  flex-shrink: 0;
  overflow: hidden;
}

.files__empty {
  margin-top: 0.4rem;
  color: var(--text-dim);
  font-style: italic;
  font-size: 0.9rem;
}

.files__list {
  margin-top: 0.45rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  overflow: auto;
  min-height: 0;
}

.file__path {
  font-family: var(--font-code);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 0.25rem;
}

.file__content {
  margin: 0;
  padding: 0.45rem 0.55rem;
  border-radius: var(--radius-sm);
  background: rgba(7, 16, 28, 0.55);
  border: 1px solid var(--border-soft);
  font-family: var(--font-code);
  font-size: 0.82rem;
  line-height: 1.4;
  white-space: pre-wrap;
  color: var(--text-muted);
}
</style>
