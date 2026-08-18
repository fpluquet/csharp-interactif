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

/**
 * Nuances d’orange plus écartées (teinte / saturation / luminosité)
 * autour de --heap, pour distinguer les flèches sans étiquettes.
 */
function orangeTone(index: number, total: number): string {
  const t = total <= 1 ? 0.5 : index / Math.max(total - 1, 1);
  const h = 18 + t * 22; // ambre → pêche
  const s = 86 - t * 18;
  const l = 42 + ((index * 3) % 5) * 4 + t * 10; // 42–72 approx.
  return `hsl(${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%)`;
}

const paths = ref<DrawnPath[]>([]);
let resizeObserver: ResizeObserver | null = null;
let raf = 0;

function round(n: number) {
  return Math.round(n * 10) / 10;
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

type RouteKind = "side-right" | "side-left" | "vertical-down" | "vertical-up";

type Anchors = {
  start: Point;
  end: Point;
  kind: RouteKind;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function byYThenX(ay: number, by: number, ax: number, bx: number) {
  return ay - by || ax - bx;
}

function pickKind(fromBox: Box, toBox: Box): RouteKind {
  const gapRight = toBox.left - fromBox.right;
  const gapLeft = fromBox.left - toBox.right;
  const overlapsX = fromBox.left < toBox.right - 4 && toBox.left < fromBox.right + 4;

  if (gapRight >= -8) return "side-right";
  if (gapLeft >= -8 && !overlapsX) return "side-left";
  if (toBox.top >= fromBox.cy - 2) return "vertical-down";
  if (toBox.bottom <= fromBox.cy + 2) return "vertical-up";
  return "side-right";
}

function spreadAlong(count: number, start: number, size: number, padCap: number) {
  const pad = Math.min(padCap, size * 0.2);
  const usable = Math.max(size - pad * 2, 1);
  return (index: number) => {
    const t = count <= 1 ? 0.5 : (index + 0.5) / count;
    return start + pad + usable * t;
  };
}

function enforceMinGap(ids: string[], values: Map<string, number>, minGap: number) {
  for (let i = 1; i < ids.length; i++) {
    const prev = values.get(ids[i - 1]);
    const cur = values.get(ids[i]);
    if (prev === undefined || cur === undefined) continue;
    if (cur < prev + minGap) values.set(ids[i], prev + minGap);
  }
}

function pickAnchors(
  fromBox: Box,
  toBox: Box,
  kind: RouteKind,
  exitY: number,
  entryY: number,
  entryX: number,
): Anchors {
  if (kind === "side-left") {
    return {
      start: { x: fromBox.left, y: exitY },
      end: { x: toBox.right, y: entryY },
      kind,
    };
  }
  if (kind === "vertical-down") {
    return {
      start: { x: fromBox.right, y: exitY },
      end: { x: entryX, y: toBox.top },
      kind,
    };
  }
  if (kind === "vertical-up") {
    return {
      start: { x: fromBox.right, y: exitY },
      end: { x: entryX, y: toBox.bottom },
      kind,
    };
  }
  return {
    start: { x: fromBox.right, y: exitY },
    end: { x: toBox.left, y: entryY },
    kind,
  };
}

/**
 * Courbe start→end.
 * Côté : une seule S-courbe à tangentes horizontales. Le paramètre
 * channelT (0..1) place la zone de virage dans le couloir — chaque
 * flèche plie à un X différent, ce qui évite le nœud central.
 */
function buildCurve(
  start: Point,
  end: Point,
  kind: RouteKind,
  channelT = 0.5,
  nest = 0,
): Omit<DrawnPath, "id" | "color"> {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  let c1: Point;
  let c2: Point;

  if (kind === "vertical-down" || kind === "vertical-up") {
    const out = clamp(36 + Math.abs(dx) * 0.25 + Math.abs(nest) * 10, 36, 88);
    const signY = kind === "vertical-down" ? 1 : -1;
    c1 = { x: start.x + out, y: start.y };
    c2 = {
      x: end.x,
      y: end.y - signY * Math.max(28, Math.abs(dy) * 0.42),
    };
  } else {
    const signX = kind === "side-left" ? -1 : 1;
    const span = Math.max(Math.abs(dx), 1);
    const t = clamp(channelT, 0.16, 0.84);
    const bend = clamp(0.2 + Math.min(Math.abs(dy) / (span + 80), 1) * 0.12, 0.18, 0.32);

    c1 = {
      x: lerp(start.x, end.x, clamp(t - bend, 0.12, 0.62)),
      y: start.y,
    };
    c2 = {
      x: lerp(start.x, end.x, clamp(t + bend, 0.38, 0.88)),
      y: end.y,
    };

    const minOut = 28;
    if (signX * (c1.x - start.x) < minOut) c1.x = start.x + signX * minOut;
    const minIn = 22;
    if (signX * (end.x - c2.x) < minIn) c2.x = end.x - signX * minIn;
    if (signX * (c2.x - c1.x) < 16) {
      const mid = (start.x + end.x) / 2;
      c1.x = mid - signX * 10;
      c2.x = mid + signX * 10;
    }
  }

  const tx = end.x - c2.x;
  const ty = end.y - c2.y;
  const tlen = Math.hypot(tx, ty) || 1;
  const headLen = 9;
  const pathEnd = {
    x: end.x - (tx / tlen) * headLen,
    y: end.y - (ty / tlen) * headLen,
  };

  const angle = (Math.atan2(ty, tx) * 180) / Math.PI;
  const d = [
    `M ${round(start.x)} ${round(start.y)}`,
    `C ${round(c1.x)} ${round(c1.y)}, ${round(c2.x)} ${round(c2.y)}, ${round(pathEnd.x)} ${round(pathEnd.y)}`,
  ].join(" ");

  return {
    d,
    tipX: round(end.x),
    tipY: round(end.y),
    angle: round(angle),
  };
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
    fromId: string;
    fromBox: Box;
    toBox: Box;
    toId: string;
    kind: RouteKind;
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
      kind: pickKind(fromBox, toBox),
    });
  }

  const exitY = new Map<string, number>();
  const bySource = new Map<string, Prepared[]>();
  for (const item of prepared) {
    const list = bySource.get(item.fromId) ?? [];
    list.push(item);
    bySource.set(item.fromId, list);
  }
  for (const list of bySource.values()) {
    list.sort((a, b) => byYThenX(a.toBox.cy, b.toBox.cy, a.toBox.cx, b.toBox.cx));
    const box = list[0].fromBox;
    const at = spreadAlong(list.length, box.top, box.height, 10);
    list.forEach((item, index) => {
      exitY.set(item.id, at(index));
    });
  }

  const byExit = [...prepared].sort(
    (a, b) => (exitY.get(a.id) ?? a.fromBox.cy) - (exitY.get(b.id) ?? b.fromBox.cy),
  );
  enforceMinGap(
    byExit.map((item) => item.id),
    exitY,
    16,
  );

  const entryY = new Map<string, number>();
  const entryX = new Map<string, number>();
  const nestOf = new Map<string, number>();
  const byTarget = new Map<string, Prepared[]>();
  for (const item of prepared) {
    const list = byTarget.get(item.toId) ?? [];
    list.push(item);
    byTarget.set(item.toId, list);
  }
  for (const list of byTarget.values()) {
    list.sort((a, b) => byYThenX(a.fromBox.cy, b.fromBox.cy, a.fromBox.cx, b.fromBox.cx));
    const box = list[0].toBox;
    const atY = spreadAlong(list.length, box.top, box.height, 14);
    const atX = spreadAlong(list.length, box.left, box.width, 18);
    const mid = (list.length - 1) / 2;
    list.forEach((item, index) => {
      const towardSource = clamp(item.fromBox.cy, box.top + 8, box.bottom - 8);
      const spreadY = clamp(atY(index), box.top + 8, box.bottom - 8);
      entryY.set(item.id, list.length <= 1 ? towardSource : (spreadY * 0.65 + towardSource * 0.35));
      entryX.set(
        item.id,
        clamp(atX(index), box.left + 12, box.right - 12),
      );
      nestOf.set(item.id, index - mid);
    });
  }

  const colorById = new Map<string, string>();
  byExit.forEach((item, index) => {
    colorById.set(item.id, orangeTone(index, byExit.length));
  });

  const sourceRank = new Map(
    [...prepared]
      .sort((a, b) => byYThenX(a.fromBox.cy, b.fromBox.cy, a.fromBox.cx, b.fromBox.cx))
      .map((item, index) => [item.id, index] as const),
  );
  const targetRank = new Map(
    [...byTarget.entries()]
      .map(([id, list]) => ({ id, cy: list[0].toBox.cy, cx: list[0].toBox.cx }))
      .sort((a, b) => byYThenX(a.cy, b.cy, a.cx, b.cx))
      .map((item, index) => [item.id, index] as const),
  );

  const next: DrawnPath[] = [];

  for (const item of prepared) {
    const anchors = pickAnchors(
      item.fromBox,
      item.toBox,
      item.kind,
      exitY.get(item.id) ?? item.fromBox.cy,
      entryY.get(item.id) ?? item.toBox.cy,
      entryX.get(item.id) ?? item.toBox.cx,
    );

    const invert = Math.abs(
      (sourceRank.get(item.id) ?? 0) - (targetRank.get(item.toId) ?? 0),
    );
    const n = Math.max(prepared.length, 1);
    const channelT = ((sourceRank.get(item.id) ?? 0) + 0.5) / n;
    const curve = buildCurve(
      anchors.start,
      anchors.end,
      anchors.kind,
      channelT,
      (nestOf.get(item.id) ?? 0) + invert * 0.28,
    );
    next.push({
      id: item.id,
      color: colorById.get(item.id) ?? orangeTone(0, 1),
      ...curve,
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
    <g v-for="path in paths" :key="`${stepId ?? 'step'}-${path.id}`">
      <path class="ref-arrows__path" :d="path.d" :stroke="path.color" />
      <!-- Pointe dessinée dans l’axe de la tangente finale -->
      <path
        class="ref-arrows__head"
        :fill="path.color"
        :transform="`translate(${path.tipX} ${path.tipY}) rotate(${path.angle})`"
        d="M0,0 L-9,-3.6 L-9,3.6 Z"
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
  stroke-width: 2.25;
  stroke-opacity: 0.92;
  stroke-linecap: butt;
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
