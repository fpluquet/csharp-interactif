<script setup lang="ts">
import type { ExceptionFlow } from "../types/memory";

defineProps<{
  flow: ExceptionFlow;
}>();

const phaseLabel: Record<ExceptionFlow["phase"], string> = {
  throwing: "Une exception est levée",
  unwinding: "La stack se déroule",
  caught: "L’exception est attrapée",
};
</script>

<template>
  <aside class="exception-flow panel" :data-phase="flow.phase">
    <p class="panel-label">Exception</p>
    <p class="exception-flow__caption">{{ phaseLabel[flow.phase] }}</p>

    <div class="exception-flow__pipeline" aria-live="polite">
      <div
        class="chip chip--throw"
        :class="{
          'is-active': flow.phase === 'throwing' || flow.phase === 'unwinding',
          'is-dim': flow.phase === 'caught',
        }"
      >
        <span class="chip__label">throw</span>
        <code>{{ flow.typeName }}</code>
      </div>

      <span
        class="arrow"
        :class="{ 'is-active': flow.phase !== 'throwing' }"
        aria-hidden="true"
      >→</span>

      <div
        class="chip chip--message"
        :class="{
          'is-active': flow.phase === 'unwinding' || flow.phase === 'throwing',
          'is-dim': flow.phase === 'caught',
        }"
      >
        <span class="chip__label">message</span>
        <code>"{{ flow.message }}"</code>
      </div>

      <template v-if="flow.phase === 'caught' || flow.catchMethod">
        <span
          class="arrow"
          :class="{ 'is-active': flow.phase === 'caught' }"
          aria-hidden="true"
        >→</span>

        <div
          class="chip chip--catch"
          :class="{ 'is-active': flow.phase === 'caught', 'is-dim': flow.phase !== 'caught' }"
        >
          <span class="chip__label">catch</span>
          <code>{{ flow.catchMethod ?? "…" }}</code>
        </div>
      </template>
    </div>

    <p class="exception-flow__hint">
      <template v-if="flow.phase === 'throwing'">
        <code>throw new {{ flow.typeName }}(…)</code> interrompt l’exécution normale.
        Les frames vont être dépilées.
      </template>
      <template v-else-if="flow.phase === 'unwinding'">
        Chaque frame est retirée de la stack jusqu’à trouver un
        <code>catch</code> — ou jusqu’à quitter le programme.
      </template>
      <template v-else>
        <code>{{ flow.catchMethod }}</code> gère
        <code>{{ flow.typeName }}</code> : la stack se stabilise, l’exécution reprend.
      </template>
    </p>
  </aside>
</template>

<style scoped lang="scss">
.exception-flow {
  padding: 0.9rem 1.05rem 1rem;
  border-color: rgba(240, 113, 120, 0.45);
  background: linear-gradient(165deg, rgba(240, 113, 120, 0.14), var(--bg-panel));
}

.exception-flow__caption {
  margin-top: 0.3rem;
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 550;
  color: var(--text);
}

.exception-flow__pipeline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem;
  margin-top: 0.85rem;
}

.chip {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.45rem 0.7rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--well);
  transition:
    border-color var(--duration) var(--ease),
    transform var(--duration) var(--ease),
    opacity var(--duration) var(--ease),
    box-shadow var(--duration) var(--ease);

  code {
    font-size: 1.05rem;
    font-weight: 600;
  }

  &.is-dim {
    opacity: 0.45;
  }

  &.is-active {
    opacity: 1;
    transform: translateY(-1px);
  }

  &--throw.is-active {
    border-color: rgba(240, 113, 120, 0.7);
    background: rgba(240, 113, 120, 0.16);
    box-shadow: 0 8px 22px rgba(240, 113, 120, 0.14);

    code {
      color: var(--danger);
    }
  }

  &--message.is-active {
    border-color: rgba(240, 160, 90, 0.55);
    box-shadow: 0 8px 22px rgba(240, 160, 90, 0.1);
  }

  &--catch.is-active {
    border-color: var(--stack-border);
    background: var(--stack-soft);

    code {
      color: var(--stack);
    }
  }
}

.chip__label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-dim);
}

.arrow {
  font-size: 1.25rem;
  color: var(--text-dim);
  transition: color var(--duration) var(--ease), transform var(--duration) var(--ease);

  &.is-active {
    color: var(--danger);
    transform: scale(1.15);
  }
}

.exception-flow__hint {
  margin-top: 0.85rem;
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.45;

  code {
    color: var(--text);
    font-weight: 600;
  }
}
</style>
