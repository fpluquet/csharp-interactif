<script setup lang="ts">
import { computed, toRef } from "vue";
import type { Scenario } from "../types/memory";
import { useFrameCursors } from "../composables/useFrameCursors";
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
  upcomingStep,
  stepCount,
  isFirst,
  isLast,
  progress,
  next,
  prev,
  goto,
  gotoLine,
} = useScenarioPlayer(scenarioRef);

const stepLabel = computed(() => `Étape ${currentIndex.value + 1} / ${stepCount.value}`);

const explainedStep = computed(() => upcomingStep.value ?? currentStep.value);

const showConsole = computed(() =>
  props.scenario.steps.some((s) => s.consoleLines !== undefined),
);

const showFiles = computed(() =>
  props.scenario.steps.some((s) => s.files !== undefined),
);

const eofLineIndex = computed(() => props.scenario.code.length);
const lastStepIndex = computed(() => props.scenario.steps.length - 1);

const displayHighlightLines = computed(() => {
  if (isLast.value) return [eofLineIndex.value];
  return currentStep.value.highlightLines;
});

const navigableLines = computed(() => {
  const lines = new Set<number>();
  const last = lastStepIndex.value;
  for (const [i, step] of props.scenario.steps.entries()) {
    if (i === last) {
      lines.add(eofLineIndex.value);
      continue;
    }
    for (const line of step.highlightLines) lines.add(line);
  }
  return [...lines];
});

const nextHighlightLines = computed(() => {
  if (isLast.value) return [];
  const nextIndex = currentIndex.value + 1;
  if (nextIndex === lastStepIndex.value) return [eofLineIndex.value];
  return props.scenario.steps[nextIndex]?.highlightLines ?? [];
});

const nextHighlightExpr = computed(() => {
  if (currentIndex.value + 1 === lastStepIndex.value) return undefined;
  return upcomingStep.value?.highlightExpr;
});

const displayStack = computed(() => (isLast.value ? [] : currentStep.value.stack));
const displayHeap = computed(() => (isLast.value ? [] : currentStep.value.heap));
const displayRefs = computed(() => (isLast.value ? [] : currentStep.value.refs));
const displayFocus = computed(() => (isLast.value ? undefined : currentStep.value.focus));
const frameCursors = useFrameCursors(
  computed(() => props.scenario.steps),
  currentIndex,
  computed(() => props.scenario.code),
);
const pausedLines = computed(() => {
  if (isLast.value) return [];
  const nextIndex = currentIndex.value + 1;
  if (nextIndex === lastStepIndex.value) return [];
  const stack = displayStack.value;
  const live = new Set(stack.map((frame) => frame.id));
  const topId = stack.at(-1)?.id;
  const lines: number[] = [];
  for (const [id, cursor] of frameCursors.value) {
    if (id !== topId && live.has(id)) lines.push(cursor.line);
  }
  return lines;
});
const displayNarration = computed(() =>
  isLast.value ? "Le programme s'est arrêté : la mémoire a été libérée." : explainedStep.value.narration,
);
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
      @goto="goto"
    />

    <div class="scenario-player__layout">
      <div class="scenario-player__left">
        <CodePanel
          :lines="scenario.code"
          :highlight-lines="displayHighlightLines"
          :next-highlight-lines="nextHighlightLines"
          :next-highlight-expr="nextHighlightExpr"
          :navigable-lines="navigableLines"
          :paused-lines="pausedLines"
          :return-flow="explainedStep.returnFlow"
          :stack="displayStack"
          :heap="displayHeap"
          @select-line="gotoLine"
        />
        <Transition name="fade-slide" mode="out-in">
          <ReturnFlowBanner
            v-if="explainedStep.returnFlow"
            :key="`${explainedStep.id}-return`"
            :flow="explainedStep.returnFlow"
          />
          <ExceptionFlowBanner
            v-else-if="explainedStep.exceptionFlow"
            :key="`${explainedStep.id}-exception`"
            :flow="explainedStep.exceptionFlow"
          />
          <LoopFlowBanner
            v-else-if="explainedStep.loopFlow"
            :key="`${explainedStep.id}-loop`"
            :flow="explainedStep.loopFlow"
          />
          <DispatchFlowBanner
            v-else-if="explainedStep.dispatchFlow"
            :key="`${explainedStep.id}-dispatch`"
            :flow="explainedStep.dispatchFlow"
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
          :text="displayNarration"
          :step-label="stepLabel"
        />
      </div>

      <MemoryView
        :stack="displayStack"
        :heap="displayHeap"
        :refs="displayRefs"
        :focus-id="displayFocus"
        :step-id="currentStep.id"
        :cursors="frameCursors"
        :code="scenario.code"
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
