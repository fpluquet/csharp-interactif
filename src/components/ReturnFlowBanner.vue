<script setup lang="ts">
import type { ReturnFlow } from "../types/memory";

defineProps<{
  flow: ReturnFlow;
}>();

const phaseLabel: Record<ReturnFlow["phase"], string> = {
  returning: "La fonction renvoie une valeur",
  replaces: "La valeur prend la place de l’appel",
  assigned: "La valeur est stockée dans la variable",
};
</script>

<template>
  <aside class="return-flow panel" :data-phase="flow.phase">
    <p class="panel-label">Retour de fonction</p>
    <p class="return-flow__caption">{{ phaseLabel[flow.phase] }}</p>

    <div class="return-flow__pipeline" aria-live="polite">
      <div
        class="chip chip--call"
        :class="{ 'is-active': flow.phase === 'returning', 'is-dim': flow.phase !== 'returning' }"
      >
        <span class="chip__label">appel</span>
        <code>{{ flow.callExpr }}</code>
      </div>

      <span class="arrow" :class="{ 'is-active': flow.phase !== 'returning' }" aria-hidden="true">→</span>

      <div
        class="chip chip--value"
        :class="{
          'is-active': flow.phase === 'replaces' || flow.phase === 'returning',
          'is-pop': flow.phase === 'replaces',
        }"
      >
        <span class="chip__label">valeur retournée</span>
        <code>{{ flow.value }}</code>
      </div>

      <template v-if="flow.targetVar">
        <span
          class="arrow"
          :class="{ 'is-active': flow.phase === 'assigned' }"
          aria-hidden="true"
        >→</span>

        <div
          class="chip chip--assign"
          :class="{ 'is-active': flow.phase === 'assigned', 'is-dim': flow.phase !== 'assigned' }"
        >
          <span class="chip__label">affectation</span>
          <code>{{ flow.targetVar }} = {{ flow.value }}</code>
        </div>
      </template>
    </div>

    <p class="return-flow__hint">
      <template v-if="flow.phase === 'returning'">
        <code>{{ flow.fromMethod }}</code> produit <strong>{{ flow.value }}</strong>.
        L’appel <code>{{ flow.callExpr }}</code> va être remplacé.
      </template>
      <template v-else-if="flow.phase === 'replaces'">
        Dans l’expression, <code>{{ flow.callExpr }}</code>
        <span class="return-flow__swap">devient</span>
        <code class="return-flow__result">{{ flow.value }}</code>.
      </template>
      <template v-else>
        <code>{{ flow.value }}</code> est copié dans
        <code>{{ flow.targetVar }}</code> sur la stack.
      </template>
    </p>
  </aside>
</template>

<style scoped lang="scss">
.return-flow {
  padding: 0.9rem 1.05rem 1rem;
  border-color: rgba(107, 163, 240, 0.35);
  background: linear-gradient(165deg, rgba(107, 163, 240, 0.12), var(--bg-panel));
}

.return-flow__caption {
  margin-top: 0.3rem;
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 550;
  color: var(--text);
}

.return-flow__pipeline {
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

  &--call.is-active {
    border-color: rgba(240, 160, 90, 0.55);
    box-shadow: 0 8px 22px rgba(240, 160, 90, 0.12);
  }

  &--value {
    border-color: rgba(107, 163, 240, 0.35);

    code {
      color: var(--accent);
      font-size: 1.25rem;
    }

    &.is-active {
      border-color: rgba(107, 163, 240, 0.7);
      background: var(--accent-soft);
      box-shadow: 0 10px 26px rgba(107, 163, 240, 0.18);
    }

    &.is-pop {
      animation: value-pop 480ms var(--ease);
    }
  }

  &--assign.is-active {
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
    color: var(--accent);
    transform: scale(1.15);
  }
}

.return-flow__hint {
  margin-top: 0.85rem;
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.45;

  code {
    color: var(--text);
    font-weight: 600;
  }

  strong {
    color: var(--accent);
  }
}

.return-flow__swap {
  margin: 0 0.25rem;
  font-weight: 700;
  color: var(--accent);
}

.return-flow__result {
  color: var(--accent) !important;
  font-size: 1.05em;
}

@keyframes value-pop {
  0% {
    transform: scale(0.88);
  }
  55% {
    transform: scale(1.06);
  }
  100% {
    transform: scale(1);
  }
}
</style>
