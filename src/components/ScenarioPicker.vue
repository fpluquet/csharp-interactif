<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import type { Scenario } from "../types/memory";
import { PART_LABELS } from "../data/parts";

const props = defineProps<{
  scenarios: Scenario[];
  activeId: string;
}>();

const emit = defineEmits<{
  select: [id: string];
}>();

type PickerItem =
  | { kind: "heading"; id: string; label: string }
  | { kind: "scenario"; scenario: Scenario; index: number };

const items = computed<PickerItem[]>(() => {
  const result: PickerItem[] = [];
  let lastPart: Scenario["part"] | null = null;

  props.scenarios.forEach((scenario, index) => {
    if (scenario.part !== lastPart) {
      result.push({
        kind: "heading",
        id: `part-${scenario.part}`,
        label: PART_LABELS[scenario.part],
      });
      lastPart = scenario.part;
    }
    result.push({ kind: "scenario", scenario, index });
  });

  return result;
});
</script>

<template>
  <nav class="scenario-picker" aria-label="Scénarios">
    <template v-for="item in items" :key="item.kind === 'heading' ? item.id : item.scenario.id">
      <h3
        v-if="item.kind === 'heading'"
        class="scenario-picker__heading"
      >
        {{ item.label }}
      </h3>

      <RouterLink
        v-else
        class="scenario-card"
        :class="{ 'is-active': item.scenario.id === activeId }"
        :to="{ name: 'scenario', params: { scenarioId: item.scenario.id } }"
        @click="emit('select', item.scenario.id)"
      >
        <span class="scenario-card__index">{{ String(item.index + 1).padStart(2, "0") }}</span>
        <span class="scenario-card__body">
          <span class="scenario-card__title">{{ item.scenario.title }}</span>
          <span class="scenario-card__subtitle">{{ item.scenario.subtitle }}</span>
        </span>
      </RouterLink>
    </template>
  </nav>
</template>

<style scoped lang="scss">
.scenario-picker {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
}

.scenario-picker__heading {
  grid-column: 1 / -1;
  margin: 0.35rem 0 0;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);

  &:first-child {
    margin-top: 0;
  }
}

@media (max-width: 1100px) {
  .scenario-picker {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .scenario-picker {
    grid-template-columns: 1fr;
  }
}

.scenario-card {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  text-align: left;
  text-decoration: none;
  color: inherit;
  padding: 0.9rem 1rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: rgba(16, 28, 48, 0.72);
  transition:
    border-color var(--duration) var(--ease),
    background var(--duration) var(--ease),
    transform var(--duration) var(--ease);

  &:hover {
    border-color: var(--text-dim);
    transform: translateY(-1px);
  }

  &.is-active {
    border-color: rgba(107, 163, 240, 0.55);
    background: linear-gradient(160deg, rgba(107, 163, 240, 0.16), rgba(16, 28, 48, 0.9));
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.22);
  }
}

.scenario-card__index {
  font-family: var(--font-display);
  font-size: 1.15rem;
  color: var(--accent);
  line-height: 1;
  padding-top: 0.15rem;
}

.scenario-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.scenario-card__title {
  font-weight: 700;
  font-size: 0.98rem;
  color: var(--text);
}

.scenario-card__subtitle {
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.35;
}
</style>
