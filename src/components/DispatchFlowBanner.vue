<script setup lang="ts">
import type { DispatchFlow } from "../types/memory";

defineProps<{
  flow: DispatchFlow;
}>();
</script>

<template>
  <aside class="dispatch-flow panel" :data-mode="flow.mode">
    <p class="panel-label">Résolution de {{ flow.callExpr }}</p>

    <div class="dispatch-flow__types">
      <div class="type-card">
        <span class="type-card__label">Type statique</span>
        <code>{{ flow.staticType }}</code>
        <span class="type-card__hint">déclaré (variable)</span>
      </div>
      <div class="type-card">
        <span class="type-card__label">Type dynamique</span>
        <code>{{ flow.dynamicType }}</code>
        <span class="type-card__hint">réel (objet)</span>
      </div>
    </div>

    <p class="dispatch-flow__result">
      <span v-if="flow.mode === 'static'" class="mode">Liaison statique</span>
      <span v-else class="mode mode--virtual">Liaison dynamique</span>
      → appelle
      <code>{{ flow.chosen }}</code>
      →
      <code class="dispatch-flow__value">{{ flow.result }}</code>
    </p>
  </aside>
</template>

<style scoped lang="scss">
.dispatch-flow {
  padding: 0.85rem 1.05rem 0.95rem;
}

.dispatch-flow__types {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.55rem;
  margin-top: 0.55rem;
}

.type-card {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.55rem 0.65rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: rgba(7, 16, 28, 0.35);

  code {
    font-family: var(--font-code);
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text);
  }
}

.type-card__label {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-dim);
}

.type-card__hint {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.dispatch-flow__result {
  margin-top: 0.65rem;
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.4;

  code {
    font-family: var(--font-code);
    color: var(--text);
    font-weight: 600;
  }
}

.mode {
  font-weight: 700;
  color: var(--accent);

  &--virtual {
    color: var(--stack);
  }
}

.dispatch-flow__value {
  color: var(--stack) !important;
}

.dispatch-flow[data-mode="static"] .type-card:first-child {
  border-color: rgba(107, 163, 240, 0.45);
  background: rgba(107, 163, 240, 0.1);
}

.dispatch-flow[data-mode="virtual"] .type-card:last-child {
  border-color: rgba(46, 196, 166, 0.45);
  background: rgba(46, 196, 166, 0.1);
}

@media (max-width: 520px) {
  .dispatch-flow__types {
    grid-template-columns: 1fr;
  }
}
</style>
