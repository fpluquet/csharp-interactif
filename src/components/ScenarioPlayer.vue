<script setup lang="ts">
import { computed, toRef } from "vue";
import type { Scenario } from "../types/memory";
import { useScenarioPlayer } from "../composables/useScenarioPlayer";
import CodePanel from "./CodePanel.vue";
import ConsolePanel from "./ConsolePanel.vue";
import ExceptionFlowBanner from "./ExceptionFlowBanner.vue";
import FilesPanel from "./FilesPanel.vue";
import DispatchFlowBanner from "./DispatchFlowBanner.vue";
import LoopFlowBanner from "./LoopFlowBanner.vue";
import NarrationBar from "./NarrationBar.vue";
import PlayerToolbar from "./PlayerToolbar.vue";
import ReturnFlowBanner from "./ReturnFlowBanner.vue";
import MemoryView from "./memory/MemoryView.vue";

const props = defineProps<{
  scenarios: Scenario[];
  scenario: Scenario;
  activeId: string;
}>();

const emit = defineEmits<{
  select: [id: string];
}>();

const scenarioRef = toRef(props, "scenario");
const {
  currentIndex,
  currentStep,
  stepCount,
  isFirst,
  isLast,
  progress,
  next,
  prev,
  goto,
  gotoLine,
  reset,
} = useScenarioPlayer(scenarioRef);

const stepLabel = computed(() => `Étape ${currentIndex.value + 1} / ${stepCount.value}`);

const showConsole = computed(() =>
  props.scenario.steps.some((s) => s.consoleLines !== undefined),
);

const showFiles = computed(() =>
  props.scenario.steps.some((s) => s.files !== undefined),
);

const navigableLines = computed(() => {
  const lines = new Set<number>();
  for (const step of props.scenario.steps) {
    for (const line of step.highlightLines) lines.add(line);
  }
  return [...lines];
});

const nextHighlightLines = computed(() => {
  if (isLast.value) return [];
  return props.scenario.steps[currentIndex.value + 1]?.highlightLines ?? [];
});
</script>

<template>
  <section class="scenario-player">
    <PlayerToolbar
      :scenarios="scenarios"
      :active-id="activeId"
      :subtitle="scenario.subtitle"
      :current-index="currentIndex"
      :step-count="stepCount"
      :is-first-step="isFirst"
      :is-last-step="isLast"
      :progress="progress"
      @select="emit('select', $event)"
      @prev-step="prev"
      @next-step="next"
      @reset="reset"
      @goto="goto"
    />

    <div class="scenario-player__layout">
      <div class="scenario-player__left">
        <CodePanel
          :lines="scenario.code"
          :highlight-lines="currentStep.highlightLines"
          :next-highlight-lines="nextHighlightLines"
          :navigable-lines="navigableLines"
          :return-flow="currentStep.returnFlow"
          :stack="currentStep.stack"
          :heap="currentStep.heap"
          @select-line="gotoLine"
        />
        <Transition name="fade-slide" mode="out-in">
          <ReturnFlowBanner
            v-if="currentStep.returnFlow"
            :key="`${currentStep.id}-return`"
            :flow="currentStep.returnFlow"
          />
          <ExceptionFlowBanner
            v-else-if="currentStep.exceptionFlow"
            :key="`${currentStep.id}-exception`"
            :flow="currentStep.exceptionFlow"
          />
          <LoopFlowBanner
            v-else-if="currentStep.loopFlow"
            :key="`${currentStep.id}-loop`"
            :flow="currentStep.loopFlow"
          />
          <DispatchFlowBanner
            v-else-if="currentStep.dispatchFlow"
            :key="`${currentStep.id}-dispatch`"
            :flow="currentStep.dispatchFlow"
          />
        </Transition>
        <ConsolePanel
          v-if="showConsole"
          :lines="currentStep.consoleLines ?? []"
        />
        <FilesPanel
          v-if="showFiles"
          :files="currentStep.files ?? []"
        />
        <NarrationBar
          :text="currentStep.narration"
          :step-label="stepLabel"
        />
      </div>

      <MemoryView
        :stack="currentStep.stack"
        :heap="currentStep.heap"
        :refs="currentStep.refs"
        :focus-id="currentStep.focus"
        :step-id="currentStep.id"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.scenario-player {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: calc(100vh - 1.75rem);
  height: calc(100dvh - 1.75rem);
  max-height: calc(100vh - 1.75rem);
  max-height: calc(100dvh - 1.75rem);
  min-height: 0;
  overflow: hidden;
}

.scenario-player__layout {
  display: grid;
  grid-template-columns: minmax(280px, 0.95fr) minmax(0, 1.35fr);
  gap: 1rem;
  flex: 1 1 auto;
  min-height: 0;
  align-items: stretch;
  overflow: hidden;
}

.scenario-player__left {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-height: 0;
  height: 100%;
  overflow: hidden;

  :deep(.code-panel) {
    flex: 1 1 auto;
    min-height: 0;
  }

  :deep(.narration),
  :deep(.return-flow),
  :deep(.exception-flow),
  :deep(.loop-flow),
  :deep(.dispatch-flow),
  :deep(.console),
  :deep(.files) {
    flex-shrink: 0;
  }
}

:deep(.memory-view) {
  min-height: 0;
  height: 100%;
  overflow: hidden;
}

@media (max-width: 1050px) {
  .scenario-player {
    height: auto;
    max-height: none;
    overflow: visible;
  }

  .scenario-player__layout {
    grid-template-columns: 1fr;
    overflow: visible;
  }

  .scenario-player__left {
    overflow: visible;
    height: auto;

    :deep(.code-panel) {
      min-height: 12rem;
      max-height: min(42vh, 22rem);
    }
  }
}
</style>
