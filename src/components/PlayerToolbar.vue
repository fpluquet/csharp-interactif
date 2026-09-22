<script setup lang="ts">
import { computed } from "vue";
import type { Scenario } from "../types/memory";
import { PART_LABELS, PART_ORDER } from "../data/parts";

const props = defineProps<{
  scenarios: Scenario[];
  activeId: string;
  subtitle: string;
  currentIndex: number;
  stepCount: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
}>();

const emit = defineEmits<{
  select: [id: string];
  prevStep: [];
  nextStep: [];
  goto: [index: number];
}>();

const activeIndex = computed(() =>
  props.scenarios.findIndex((s) => s.id === props.activeId),
);

const isFirstScenario = computed(() => activeIndex.value <= 0);
const isLastScenario = computed(
  () => activeIndex.value >= props.scenarios.length - 1,
);

const groupedScenarios = computed(() => {
  const indexed = props.scenarios.map((scenario, index) => ({ scenario, index }));
  return PART_ORDER.map((part) => ({
    part,
    label: PART_LABELS[part],
    items: indexed.filter(({ scenario }) => scenario.part === part),
  })).filter((group) => group.items.length > 0);
});

function prevScenario() {
  if (isFirstScenario.value) return;
  emit("select", props.scenarios[activeIndex.value - 1].id);
}

function nextScenarioNav() {
  if (isLastScenario.value) return;
  emit("select", props.scenarios[activeIndex.value + 1].id);
}

function onSelectChange(event: Event) {
  emit("select", (event.target as HTMLSelectElement).value);
}
</script>

<template>
  <div class="toolbar panel" role="toolbar" aria-label="Navigation du scénario">
    <div class="toolbar__row">
      <div class="toolbar__group toolbar__group--scenario">
        <span class="toolbar__label">Scénario</span>

        <div class="toolbar__cluster">
          <button
            class="btn btn--icon"
            type="button"
            :disabled="isFirstScenario"
            title="Scénario précédent"
            @click="prevScenario"
          >
            ←
          </button>

          <label class="toolbar__select-wrap">
            <span class="sr-only">Choisir un scénario</span>
            <select
              class="toolbar__select"
              :value="activeId"
              @change="onSelectChange"
            >
              <optgroup
                v-for="group in groupedScenarios"
                :key="group.part"
                :label="group.label"
              >
                <option
                  v-for="{ scenario, index } in group.items"
                  :key="scenario.id"
                  :value="scenario.id"
                >
                  {{ String(index + 1).padStart(2, "0") }} — {{ scenario.title }}
                </option>
              </optgroup>
            </select>
          </label>

          <button
            class="btn btn--icon"
            type="button"
            :disabled="isLastScenario"
            title="Scénario suivant"
            @click="nextScenarioNav"
          >
            →
          </button>
        </div>

        <span class="toolbar__meta" aria-live="polite">
          {{ activeIndex + 1 }} / {{ scenarios.length }}
        </span>
      </div>

      <div class="toolbar__divider" aria-hidden="true" />

      <div class="toolbar__group toolbar__group--steps">
        <span class="toolbar__label">Étape</span>

        <div class="toolbar__cluster">
          <button
            class="btn btn--icon"
            type="button"
            :disabled="isFirstStep"
            title="Étape précédente (←)"
            @click="emit('prevStep')"
          >
            ←
          </button>

          <span class="toolbar__step-count">
            <strong>{{ currentIndex + 1 }}</strong>
            <span>/ {{ stepCount }}</span>
          </span>

          <button
            class="btn btn--primary"
            type="button"
            :disabled="isLastStep"
            title="Étape suivante (→ ou Espace)"
            @click="emit('nextStep')"
          >
            Suivant →
          </button>
        </div>
      </div>
    </div>

    <div class="toolbar__progress" aria-hidden="true">
      <div class="toolbar__bar" :style="{ width: `${progress * 100}%` }" />
    </div>

    <div class="toolbar__footer">
      <p class="toolbar__subtitle">{{ subtitle }}</p>

      <div class="toolbar__dots" role="tablist" aria-label="Étapes">
        <button
          v-for="i in stepCount"
          :key="i"
          type="button"
          class="dot"
          :class="{
            'is-active': i - 1 === currentIndex,
            'is-done': i - 1 < currentIndex,
          }"
          :aria-label="`Aller à l'étape ${i}`"
          :aria-current="i - 1 === currentIndex ? 'step' : undefined"
          @click="emit('goto', i - 1)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.toolbar {
  position: sticky;
  top: 0.75rem;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 0.7rem 0.9rem 0.65rem;
  background: var(--float);
  backdrop-filter: blur(12px);
  flex-shrink: 0;
}

.toolbar__row {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 0;
}

.toolbar__group {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;

  &--scenario {
    flex: 1 1 auto;
  }

  &--steps {
    flex: 0 0 auto;
  }
}

.toolbar__label {
  flex-shrink: 0;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-dim);
}

.toolbar__cluster {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
}

.toolbar__select-wrap {
  min-width: 0;
  flex: 1 1 14rem;
}

.toolbar__select {
  width: 100%;
  max-width: 22rem;
  appearance: none;
  border: 1px solid var(--border);
  border-radius: 999px;
  background:
    linear-gradient(45deg, transparent 50%, var(--text-muted) 50%) calc(100% - 18px) / 6px 6px no-repeat,
    linear-gradient(135deg, var(--text-muted) 50%, transparent 50%) calc(100% - 12px) / 6px 6px no-repeat,
    var(--control);
  color: var(--text);
  font: inherit;
  font-weight: 600;
  padding: 0.5rem 2rem 0.5rem 0.9rem;
  cursor: pointer;

  &:focus {
    outline: 2px solid var(--focus-ring);
    outline-offset: 2px;
  }

  option {
    background: var(--bg-panel);
    color: var(--text);
  }
}

.toolbar__meta {
  flex-shrink: 0;
  font-family: var(--font-code);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
}

.toolbar__step-count {
  display: inline-flex;
  align-items: baseline;
  gap: 0.2rem;
  min-width: 3.6rem;
  font-size: 0.88rem;
  color: var(--text-muted);
  white-space: nowrap;

  strong {
    color: var(--text);
    font-size: 1rem;
  }
}

.toolbar__divider {
  flex-shrink: 0;
  width: 1px;
  align-self: stretch;
  margin: 0.15rem 0;
  background: var(--border);
}

.toolbar__progress {
  height: 3px;
  border-radius: 999px;
  background: var(--border-soft);
  overflow: hidden;
}

.toolbar__bar {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--stack), var(--accent));
  transition: width var(--duration) var(--ease);
}

.toolbar__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-width: 0;
}

.toolbar__subtitle {
  margin: 0;
  min-width: 0;
  flex: 1 1 auto;
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.35;
}

.toolbar__dots {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.35rem;
}

.dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--border);
  transition:
    transform var(--duration) var(--ease),
    background var(--duration) var(--ease);

  &.is-done {
    background: var(--accent-dot);
  }

  &.is-active {
    background: var(--accent);
    transform: scale(1.35);
  }
}

.btn {
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--chip);
  font-weight: 600;
  white-space: nowrap;
  transition:
    background var(--duration) var(--ease),
    border-color var(--duration) var(--ease),
    opacity var(--duration) var(--ease);

  &:hover:not(:disabled) {
    background: var(--chip-hover);
    border-color: var(--text-dim);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &--icon {
    padding: 0.45rem 0.7rem;
  }

  &--primary {
    background: var(--accent-soft);
    border-color: var(--accent-line);
    color: var(--on-accent);

    &:hover:not(:disabled) {
      background: var(--accent-fill);
    }
  }
}

@media (max-width: 980px) {
  .toolbar__row {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .toolbar__divider {
    width: auto;
    height: 1px;
    margin: 0;
  }

  .toolbar__group {
    justify-content: space-between;
  }

  .toolbar__group--steps {
    flex-wrap: wrap;
  }

  .toolbar__select {
    max-width: none;
  }
}

@media (max-width: 560px) {
  .toolbar__meta,
  .toolbar__label {
    display: none;
  }

  .toolbar__group--scenario,
  .toolbar__group--steps {
    justify-content: stretch;
  }

  .toolbar__cluster {
    flex: 1;
  }

  .toolbar__select-wrap {
    flex: 1;
  }
}
</style>
