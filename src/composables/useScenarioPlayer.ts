import { computed, onMounted, onUnmounted, ref, watch, type Ref } from "vue";
import type { Scenario, Step } from "../types/memory";

export function useScenarioPlayer(scenario: Ref<Scenario>) {
  const currentIndex = ref(0);

  const stepCount = computed(() => scenario.value.steps.length);
  const currentStep = computed<Step>(
    () => scenario.value.steps[currentIndex.value] ?? scenario.value.steps[0],
  );
  /** Étape suivante : c’est elle qu’on explique (ce qui va s’exécuter). */
  const upcomingStep = computed<Step | undefined>(() => {
    if (currentIndex.value >= scenario.value.steps.length - 1) return undefined;
    return scenario.value.steps[currentIndex.value + 1];
  });
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

  /**
   * Saute à l’état où cette ligne est « à exécuter » (un cran avant
   * l’étape qui l’a déjà jouée).
   */
  function gotoLine(lineIndex: number) {
    const targets = [
      ...new Set(
        scenario.value.steps
          .map((step, index) => ({ index, step }))
          .filter(({ step }) => step.highlightLines.includes(lineIndex))
          .map(({ index }) => Math.max(0, index - 1)),
      ),
    ];
    if (!targets.length) return;

    targets.sort((a, b) => {
      const da = Math.abs(a - currentIndex.value);
      const db = Math.abs(b - currentIndex.value);
      if (da !== db) return da - db;
      return a - b;
    });

    const nearest = targets[0];
    if (nearest !== currentIndex.value) {
      currentIndex.value = nearest;
      return;
    }

    const later = targets.find((index) => index > currentIndex.value);
    if (later !== undefined) {
      currentIndex.value = later;
      return;
    }
    const earlier = [...targets].reverse().find((index) => index < currentIndex.value);
    if (earlier !== undefined) currentIndex.value = earlier;
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
    upcomingStep,
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
