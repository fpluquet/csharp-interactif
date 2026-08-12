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

/**
 * Courbe start→end : sortie horizontale, arrivée dans l’axe de la tangente
 * (la pointe suit le dernier segment, pas un plat forcé).
 */
function buildCurve(start: Point, end: Point): Omit<DrawnPath, "id" | "color"> {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const signX = dx >= 0 ? 1 : -1;
  const adx = Math.max(Math.abs(dx), 48);

  const c1 = { x: start.x + signX * adx * 0.42, y: start.y };
  // Approche depuis la trajectoire de la courbe (pas un plat y = end.y).
  const c2 = {
    x: end.x - signX * adx * 0.36,
    y: start.y + dy * 0.78,
  };

  // Tangente finale du cubic = end − c2.
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
    fromBox: Box;
    toBox: Box;
    toId: string;
  };

  const prepared: Prepared[] = [];

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

    prepared.push({
      id: link.id,
      fromBox: toLocal(fromEl.getBoundingClientRect(), root),
      toBox: toLocal(toEl.getBoundingClientRect(), root),
      toId: link.toObjectId,
    });
  }

  // Répartit les points d’arrivée sur le bord gauche de chaque objet cible.
  const byTarget = new Map<string, Prepared[]>();
  for (const item of prepared) {
    const list = byTarget.get(item.toId) ?? [];
    list.push(item);
    byTarget.set(item.toId, list);
  }
  for (const list of byTarget.values()) {
    list.sort((a, b) => a.fromBox.cy - b.fromBox.cy);
  }

  const entryY = new Map<string, number>();
  for (const list of byTarget.values()) {
    const box = list[0].toBox;
    const pad = Math.min(14, box.height * 0.2);
    const usable = Math.max(box.height - pad * 2, 1);
    list.forEach((item, index) => {
      const t = list.length <= 1 ? 0.5 : (index + 0.5) / list.length;
      entryY.set(item.id, box.top + pad + usable * t);
    });
  }

  // Légère séparation des départs si deux slots sont très proches.
  const bySourceY = [...prepared].sort((a, b) => a.fromBox.cy - b.fromBox.cy);
  const exitY = new Map<string, number>();
  bySourceY.forEach((item, index) => {
    let y = item.fromBox.cy;
    if (index > 0) {
      const prev = bySourceY[index - 1];
      const prevY = exitY.get(prev.id) ?? prev.fromBox.cy;
      if (Math.abs(y - prevY) < 16) y = prevY + 16;
    }
    exitY.set(item.id, y);
  });

  const colorById = new Map<string, string>();
  bySourceY.forEach((item, index) => {
    colorById.set(item.id, orangeTone(index, bySourceY.length));
  });

  const next: DrawnPath[] = [];

  for (const item of prepared) {
    const start: Point = {
      x: item.fromBox.right,
      y: exitY.get(item.id) ?? item.fromBox.cy,
    };
    const end: Point = {
      x: item.toBox.left,
      y: entryY.get(item.id) ?? item.toBox.cy,
    };

    const leftToRight = end.x >= start.x - 8;
    const s = leftToRight ? start : { x: item.fromBox.left, y: start.y };
    const e = leftToRight ? end : { x: item.toBox.right, y: end.y };

    const curve = buildCurve(s, e);
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
