<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, useId, watch } from "vue";
import type { RefLink } from "../../types/memory";

const props = defineProps<{
  refs: RefLink[];
  stepId?: string;
}>();

type Side = "left" | "right" | "top" | "bottom";
type Point = { x: number; y: number };

type Path = {
  id: string;
  d: string;
};

const paths = ref<Path[]>([]);
const markerId = `arrowhead-${useId().replace(/:/g, "")}`;
let resizeObserver: ResizeObserver | null = null;
let raf = 0;

function round(n: number) {
  return Math.round(n * 10) / 10;
}

function getRootRect() {
  return document.querySelector(".memory-view")?.getBoundingClientRect() ?? null;
}

function toLocal(rect: DOMRect, root: DOMRect) {
  return {
    left: rect.left - root.left,
    top: rect.top - root.top,
    width: rect.width,
    height: rect.height,
    cx: rect.left - root.left + rect.width / 2,
    cy: rect.top - root.top + rect.height / 2,
  };
}

function getAnchor(
  box: ReturnType<typeof toLocal>,
  side: Side,
): Point {
  switch (side) {
    case "right":
      return { x: box.left + box.width, y: box.cy };
    case "left":
      return { x: box.left, y: box.cy };
    case "top":
      return { x: box.cx, y: box.top };
    case "bottom":
      return { x: box.cx, y: box.top + box.height };
  }
}

/** Choisit les faces d’entrée/sortie selon la position relative. */
function pickSides(
  from: ReturnType<typeof toLocal>,
  to: ReturnType<typeof toLocal>,
): { fromSide: Side; toSide: Side } {
  const dx = to.cx - from.cx;
  const dy = to.cy - from.cy;
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);

  // Légère préférence horizontale (stack → heap).
  if (absX >= absY * 0.85) {
    return dx >= 0
      ? { fromSide: "right", toSide: "left" }
      : { fromSide: "left", toSide: "right" };
  }

  return dy >= 0
    ? { fromSide: "bottom", toSide: "top" }
    : { fromSide: "top", toSide: "bottom" };
}

function controlPoint(point: Point, side: Side, pull: number): Point {
  switch (side) {
    case "right":
      return { x: point.x + pull, y: point.y };
    case "left":
      return { x: point.x - pull, y: point.y };
    case "top":
      return { x: point.x, y: point.y - pull };
    case "bottom":
      return { x: point.x, y: point.y + pull };
  }
}

/** Recule légèrement l’extrémité pour que la pointe touche le bord. */
function insetEnd(end: Point, control: Point, amount = 7): Point {
  const dx = end.x - control.x;
  const dy = end.y - control.y;
  const len = Math.hypot(dx, dy) || 1;
  return {
    x: end.x - (dx / len) * amount,
    y: end.y - (dy / len) * amount,
  };
}

function buildCurve(
  start: Point,
  end: Point,
  fromSide: Side,
  toSide: Side,
): string {
  const dist = Math.hypot(end.x - start.x, end.y - start.y);
  const pull = Math.max(28, Math.min(90, dist * 0.42));
  const c1 = controlPoint(start, fromSide, pull);
  const c2 = controlPoint(end, toSide, pull);
  const tip = insetEnd(end, c2);

  return [
    `M ${round(start.x)} ${round(start.y)}`,
    `C ${round(c1.x)} ${round(c1.y)}, ${round(c2.x)} ${round(c2.y)}, ${round(tip.x)} ${round(tip.y)}`,
  ].join(" ");
}

function buildPaths() {
  const rootEl = document.querySelector(".memory-view");
  const root = getRootRect();
  if (!rootEl || !root) {
    paths.value = [];
    return;
  }

  const next: Path[] = [];

  for (const link of props.refs) {
    const fromSelector = link.fromFieldId
      ? `[data-field-id="${link.fromFieldId}"]`
      : link.fromSlotId
        ? `[data-slot-id="${link.fromSlotId}"]`
        : null;
    if (!fromSelector) continue;

    const fromEl = rootEl.querySelector(fromSelector);
    const toEl = rootEl.querySelector(`[data-object-id="${link.toObjectId}"]`);
    if (!fromEl || !toEl) continue;

    const fromBox = toLocal(fromEl.getBoundingClientRect(), root);
    const toBox = toLocal(toEl.getBoundingClientRect(), root);
    const { fromSide, toSide } = pickSides(fromBox, toBox);
    const start = getAnchor(fromBox, fromSide);
    const end = getAnchor(toBox, toSide);

    next.push({
      id: link.id,
      d: buildCurve(start, end, fromSide, toSide),
    });
  }

  paths.value = next;
}

function scheduleBuild() {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => {
    void nextTick(buildPaths);
  });
}

watch(
  () => [props.refs, props.stepId] as const,
  () => {
    window.setTimeout(scheduleBuild, 40);
    window.setTimeout(scheduleBuild, 420);
  },
  { deep: true },
);

onMounted(() => {
  scheduleBuild();
  const root = document.querySelector(".memory-view");
  if (root && "ResizeObserver" in window) {
    resizeObserver = new ResizeObserver(() => scheduleBuild());
    resizeObserver.observe(root);
  }
  window.addEventListener("resize", scheduleBuild);
});

onUnmounted(() => {
  cancelAnimationFrame(raf);
  resizeObserver?.disconnect();
  window.removeEventListener("resize", scheduleBuild);
});
</script>

<template>
  <svg class="ref-arrows" aria-hidden="true">
    <defs>
      <marker
        :id="markerId"
        markerWidth="9"
        markerHeight="9"
        refX="7"
        refY="3.5"
        orient="auto"
        markerUnits="userSpaceOnUse"
      >
        <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--heap)" />
      </marker>
    </defs>
    <path
      v-for="path in paths"
      :key="`${stepId ?? 'step'}-${path.id}`"
      class="ref-arrows__path"
      :d="path.d"
      :marker-end="`url(#${markerId})`"
    />
  </svg>
</template>

<style scoped lang="scss">
.ref-arrows {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
  z-index: 2;
}

.ref-arrows__path {
  fill: none;
  stroke: var(--heap);
  stroke-width: 2;
  stroke-opacity: 0.9;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0;
  animation: fade-arrow 420ms var(--ease) forwards;
}

@keyframes fade-arrow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
