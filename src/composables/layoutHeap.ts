import type { HeapObject, RefLink, StackFrame, Step } from "../types/memory";

export type HeapTree = {
  object: HeapObject;
  children: HeapTree[];
};

function visualSlots(stack: StackFrame[]) {
  return [...stack].reverse().flatMap((frame) => [...frame.slots].reverse());
}

function addChild(childrenOf: Map<string, string[]>, from: string, to: string, heapIds: Set<string>) {
  if (from === to || !heapIds.has(from) || !heapIds.has(to)) return;
  const list = childrenOf.get(from) ?? [];
  if (list.includes(to)) return;
  list.push(to);
  childrenOf.set(from, list);
}

function rankByStack(stack: StackFrame[], refs: RefLink[]): Map<string, number> {
  const slots = visualSlots(stack);
  const slotIndex = new Map(slots.map((slot, index) => [slot.id, index]));
  const rank = new Map<string, number>();
  const INF = 10_000;

  function bump(id: string, value: number) {
    rank.set(id, Math.min(rank.get(id) ?? INF, value));
  }

  slots.forEach((slot, index) => {
    if (slot.targetId) bump(slot.targetId, index);
  });
  for (const link of refs) {
    if (!link.fromSlotId) continue;
    const index = slotIndex.get(link.fromSlotId);
    if (index !== undefined) bump(link.toObjectId, index);
  }
  return rank;
}

function collectIds(forest: HeapTree[], into = new Set<string>()): Set<string> {
  for (const node of forest) {
    into.add(node.object.id);
    collectIds(node.children, into);
  }
  return into;
}

function sortRoots(forest: HeapTree[], stack: StackFrame[], refs: RefLink[]): HeapTree[] {
  const rank = rankByStack(stack, refs);
  const INF = 10_000;
  return [...forest].sort((a, b) => {
    const delta = (rank.get(a.object.id) ?? INF) - (rank.get(b.object.id) ?? INF);
    if (delta !== 0) return delta;
    return 0;
  });
}

/**
 * Forêt d’objets heap : les racines (pas d’entrée heap→heap) restent
 * à gauche, chaque champ référence place sa cible à droite du parent.
 * Un objet partagé n’est niché que sous le premier parent.
 */
export function buildHeapForest(heap: HeapObject[], refs: RefLink[]): HeapTree[] {
  if (!heap.length) return [];

  const byId = new Map(heap.map((obj) => [obj.id, obj]));
  const heapIds = new Set(byId.keys());
  const ownerOfField = new Map<string, string>();
  for (const obj of heap) {
    for (const field of obj.fields) {
      if (field.id) ownerOfField.set(field.id, obj.id);
    }
  }

  const childrenOf = new Map<string, string[]>();
  for (const obj of heap) {
    for (const field of obj.fields) {
      if (field.targetId) addChild(childrenOf, obj.id, field.targetId, heapIds);
    }
  }
  for (const link of refs) {
    if (!link.fromFieldId) continue;
    const parent = ownerOfField.get(link.fromFieldId);
    if (parent) addChild(childrenOf, parent, link.toObjectId, heapIds);
  }

  const incoming = new Map<string, number>();
  for (const kids of childrenOf.values()) {
    for (const id of kids) incoming.set(id, (incoming.get(id) ?? 0) + 1);
  }

  const claimed = new Set<string>();

  function tree(id: string): HeapTree | null {
    const object = byId.get(id);
    if (!object || claimed.has(id)) return null;
    claimed.add(id);
    const children: HeapTree[] = [];
    for (const childId of childrenOf.get(id) ?? []) {
      const child = tree(childId);
      if (child) children.push(child);
    }
    return { object, children };
  }

  const forest: HeapTree[] = [];
  for (const obj of heap) {
    if ((incoming.get(obj.id) ?? 0) > 0) continue;
    const node = tree(obj.id);
    if (node) forest.push(node);
  }
  for (const obj of heap) {
    if (claimed.has(obj.id)) continue;
    const node = tree(obj.id);
    if (node) forest.push(node);
  }
  return forest;
}

function pickLayoutStep(steps: Step[]): Step | undefined {
  let best: Step | undefined;
  for (const step of steps) {
    if (!step.heap.length) continue;
    if (
      !best ||
      step.heap.length > best.heap.length ||
      (step.heap.length === best.heap.length && step.refs.length >= best.refs.length)
    ) {
      best = step;
    }
  }
  return best;
}

/**
 * Arbre canonique du scénario : graphe de l’étape la plus complète,
 * racines ordonnées comme la stack visuelle (pile inversée).
 */
export function planHeapForest(steps: Step[]): HeapTree[] {
  const richest = pickLayoutStep(steps);
  if (!richest) return [];

  const forest = sortRoots(
    buildHeapForest(richest.heap, richest.refs),
    richest.stack,
    richest.refs,
  );
  const seen = collectIds(forest);

  for (const step of steps) {
    for (const obj of step.heap) {
      if (seen.has(obj.id)) continue;
      seen.add(obj.id);
      forest.push({ object: obj, children: [] });
    }
  }
  return forest;
}

function projectLive(node: HeapTree, live: Map<string, HeapObject>): HeapTree[] {
  const children = node.children.flatMap((child) => projectLive(child, live));
  const object = live.get(node.object.id);
  if (object) return [{ object, children }];
  return children;
}

/**
 * Place les objets du step courant dans l’arbre prévu par le scénario :
 * même structure et même ordre que la position finale, sans les nœuds
 * pas encore alloués (ou déjà disparus).
 */
export function layoutHeapForest(
  heap: HeapObject[],
  refs: RefLink[],
  steps: Step[] = [],
): HeapTree[] {
  if (!heap.length) return [];

  const plan = planHeapForest(steps);
  if (!plan.length) return buildHeapForest(heap, refs);

  const live = new Map(heap.map((obj) => [obj.id, obj]));
  const forest = plan.flatMap((root) => projectLive(root, live));
  const used = collectIds(forest);
  const leftovers = heap.filter((obj) => !used.has(obj.id));
  if (leftovers.length) forest.push(...buildHeapForest(leftovers, refs));
  return forest;
}
