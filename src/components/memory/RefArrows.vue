<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import type { RefLink } from "../../types/memory";

const props = defineProps<{
  refs: RefLink[];
  stepId?: string;
}>();

type Point = { x: number; y: number };
type Box = {
  left: number;
  top: number;
  width: number;
  height: number;
  cx: number;
  cy: number;
  right: number;
  bottom: number;
};

type DrawnPath = {
  id: string;
  d: string;
  color: string;
  tipX: number;
  tipY: number;
  angle: number;
};

function orangeTone(index: number, total: number): string {
  const t = total <= 1 ? 0.5 : index / Math.max(total - 1, 1);
  const h = 22 + t * 16;
  const s = 82 - t * 14;
  const l = 52 + ((index * 3) % 5) * 3 + t * 8;
  return `hsl(${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%)`;
}

const paths = ref<DrawnPath[]>([]);
let resizeObserver: ResizeObserver | null = null;
let raf = 0;

function round(n: number) {
  return Math.round(n * 10) / 10;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

function getRootRect() {
  return document.querySelector(".memory-view")?.getBoundingClientRect() ?? null;
}

function toLocal(rect: DOMRect, root: DOMRect): Box {
  const left = rect.left - root.left;
  const top = rect.top - root.top;
  return {
    left,
    top,
    width: rect.width,
    height: rect.height,
    cx: left + rect.width / 2,
    cy: top + rect.height / 2,
    right: left + rect.width,
    bottom: top + rect.height,
  };
}

type Side = "right" | "left" | "top" | "bottom";

function pickSides(fromBox: Box, toBox: Box): { from: Side; to: Side } {
  const gapRight = toBox.left - fromBox.right;
  const gapLeft = fromBox.left - toBox.right;
  const overlapsX = fromBox.left < toBox.right - 4 && toBox.left < fromBox.right + 4;

  if (gapRight >= -8) return { from: "right", to: "left" };
  if (gapLeft >= -8 && !overlapsX) return { from: "left", to: "right" };
  if (toBox.top >= fromBox.cy - 2) return { from: "right", to: "top" };
  if (toBox.bottom <= fromBox.cy + 2) return { from: "right", to: "bottom" };
  return { from: "right", to: "left" };
}

function anchor(box: Box, side: Side, t: number): Point {
  const u = clamp(t, 0.18, 0.82);
  if (side === "left") return { x: box.left, y: box.top + box.height * u };
  if (side === "right") return { x: box.right, y: box.top + box.height * u };
  if (side === "top") return { x: box.left + box.width * u, y: box.top };
  return { x: box.left + box.width * u, y: box.bottom };
}

function tangentOut(side: Side, dist: number): Point {
  if (side === "right") return { x: dist, y: 0 };
  if (side === "left") return { x: -dist, y: 0 };
  if (side === "top") return { x: 0, y: -dist };
  return { x: 0, y: dist };
}

/**
 * Cubic à tangentes alignées sur les bords : S-courbe souple,
 * arrivée perpendiculaire à la cible.
 */
function buildCurve(start: Point, end: Point, from: Side, to: Side): Omit<DrawnPath, "id" | "color"> {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.hypot(dx, dy);
  const pull = clamp(Math.max(Math.abs(dx) * 0.48, Math.abs(dy) * 0.38, dist * 0.28), 28, 120);
  const a = tangentOut(from, pull);
  const b = tangentOut(to, pull * 0.85);
  const c1 = { x: start.x + a.x, y: start.y + a.y };
  const c2 = { x: end.x + b.x, y: end.y + b.y };

  const tx = end.x - c2.x;
  const ty = end.y - c2.y;
  const tlen = Math.hypot(tx, ty) || 1;
  const head = 11;
  const pathEnd = {
    x: end.x - (tx / tlen) * head,
    y: end.y - (ty / tlen) * head,
  };

  return {
    d: `M ${round(start.x)} ${round(start.y)} C ${round(c1.x)} ${round(c1.y)}, ${round(c2.x)} ${round(c2.y)}, ${round(pathEnd.x)} ${round(pathEnd.y)}`,
    tipX: round(end.x),
    tipY: round(end.y),
    angle: round((Math.atan2(ty, tx) * 180) / Math.PI),
  };
}

function spread(count: number, index: number) {
  if (count <= 1) return 0.5;
  return (index + 0.5) / count;
}

function buildPaths() {
  const rootEl = document.querySelector(".memory-view");
  const root = getRootRect();
  if (!rootEl || !root) {
    paths.value = [];
    return;
  }

  type Prepared = {
    id: string;
    fromBox: Box;
    toBox: Box;
    toId: string;
    fromId: string;
    sides: { from: Side; to: Side };
  };

  const prepared: Prepared[] = [];

  for (const link of props.refs) {
    const fromId = link.fromFieldId ?? link.fromSlotId;
    const fromSelector = link.fromFieldId
      ? `[data-field-id="${link.fromFieldId}"]`
      : link.fromSlotId
        ? `[data-slot-id="${link.fromSlotId}"]`
        : null;
    if (!fromSelector || !fromId) continue;

    const fromEl = rootEl.querySelector(fromSelector);
    const toEl = rootEl.querySelector(`[data-object-id="${link.toObjectId}"]`);
    if (!fromEl || !toEl) continue;

    const fromBox = toLocal(fromEl.getBoundingClientRect(), root);
    const toBox = toLocal(toEl.getBoundingClientRect(), root);
    prepared.push({
      id: link.id,
      fromId,
      fromBox,
      toBox,
      toId: link.toObjectId,
      sides: pickSides(fromBox, toBox),
    });
  }

  const exitT = new Map<string, number>();
  const bySource = new Map<string, Prepared[]>();
  for (const item of prepared) {
    const list = bySource.get(item.fromId) ?? [];
    list.push(item);
    bySource.set(item.fromId, list);
  }
  for (const list of bySource.values()) {
    list.sort((a, b) => a.toBox.cy - b.toBox.cy || a.toBox.cx - b.toBox.cx);
    list.forEach((item, index) => exitT.set(item.id, spread(list.length, index)));
  }

  const entryT = new Map<string, number>();
  const byTarget = new Map<string, Prepared[]>();
  for (const item of prepared) {
    const list = byTarget.get(item.toId) ?? [];
    list.push(item);
    byTarget.set(item.toId, list);
  }
  for (const list of byTarget.values()) {
    list.sort((a, b) => a.fromBox.cy - b.fromBox.cy || a.fromBox.cx - b.fromBox.cx);
    list.forEach((item, index) => {
      const alongSource =
        item.sides.to === "left" || item.sides.to === "right"
          ? clamp((item.fromBox.cy - item.toBox.top) / Math.max(item.toBox.height, 1), 0.18, 0.82)
          : clamp((item.fromBox.cx - item.toBox.left) / Math.max(item.toBox.width, 1), 0.18, 0.82);
      const evenly = spread(list.length, index);
      entryT.set(item.id, list.length <= 1 ? alongSource : evenly * 0.55 + alongSource * 0.45);
    });
  }

  const byY = [...prepared].sort((a, b) => a.fromBox.cy - b.fromBox.cy);
  const next: DrawnPath[] = [];

  byY.forEach((item, index) => {
    const start = anchor(item.fromBox, item.sides.from, exitT.get(item.id) ?? 0.5);
    const end = anchor(item.toBox, item.sides.to, entryT.get(item.id) ?? 0.5);
    next.push({
      id: item.id,
      color: orangeTone(index, byY.length),
      ...buildCurve(start, end, item.sides.from, item.sides.to),
    });
  });

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
    <g v-for="path in paths" :key="`${stepId ?? 'step'}-${path.id}`">
      <path class="ref-arrows__path" :d="path.d" :stroke="path.color" />
      <path
        class="ref-arrows__head"
        :fill="path.color"
        :transform="`translate(${path.tipX} ${path.tipY}) rotate(${path.angle})`"
        d="M0,0 L-11,-4.4 L-11,4.4 Z"
      />
    </g>
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
  stroke-width: 2.1;
  stroke-opacity: 0.9;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0;
  animation: fade-arrow 420ms var(--ease) forwards;
}

.ref-arrows__head {
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
