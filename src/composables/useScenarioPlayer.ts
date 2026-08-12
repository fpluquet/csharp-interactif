import { computed, onMounted, onUnmounted, ref, watch, type Ref } from "vue";
import type { Scenario, Step } from "../types/memory";

export function useScenarioPlayer(scenario: Ref<Scenario>) {
  const currentIndex = ref(0);

  const stepCount = computed(() => scenario.value.steps.length);
  const currentStep = computed<Step>(
    () => scenario.value.steps[currentIndex.value] ?? scenario.value.steps[0],
  );
  const isFirst = computed(() => currentIndex.value <= 0);
  const isLast = computed(
    () => currentIndex.value >= scenario.value.steps.length - 1,
  );
  const progress = computed(() =>
    stepCount.value <= 1
      ? 1
      : currentIndex.value / (stepCount.value - 1),
  );

  function next() {
    if (!isLast.value) currentIndex.value += 1;
  }

  function prev() {
    if (!isFirst.value) currentIndex.value -= 1;
  }

  function goto(index: number) {
    if (index < 0 || index >= stepCount.value) return;
    currentIndex.value = index;
  }

  /** Saute à l’étape la plus proche qui met en évidence cette ligne de code. */
  function gotoLine(lineIndex: number) {
    const matches = scenario.value.steps
      .map((step, index) => ({ index, step }))
      .filter(({ step }) => step.highlightLines.includes(lineIndex));
    if (!matches.length) return;

    matches.sort((a, b) => {
      const da = Math.abs(a.index - currentIndex.value);
      const db = Math.abs(b.index - currentIndex.value);
      if (da !== db) return da - db;
      return a.index - b.index;
    });

    const nearest = matches[0];
    if (nearest.index !== currentIndex.value) {
      currentIndex.value = nearest.index;
      return;
    }

    // Déjà sur cette ligne : cycle vers l’occurrence suivante, sinon précédente.
    const later = matches.find((m) => m.index > currentIndex.value);
    if (later) {
      currentIndex.value = later.index;
      return;
    }
    const earlier = [...matches].reverse().find((m) => m.index < currentIndex.value);
    if (earlier) currentIndex.value = earlier.index;
  }

  function reset() {
    currentIndex.value = 0;
  }

  watch(
    () => scenario.value.id,
    () => {
      currentIndex.value = 0;
    },
  );

  function onKeydown(e: KeyboardEvent) {
    const target = e.target as HTMLElement | null;
    if (
      target &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable)
    ) {
      return;
    }

    if (e.key === "ArrowRight" || e.key === " ") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "Home") {
      e.preventDefault();
      reset();
    }
  }

  onMounted(() => window.addEventListener("keydown", onKeydown));
  onUnmounted(() => window.removeEventListener("keydown", onKeydown));

  return {
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
  };
}
