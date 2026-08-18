import type { HeapObject, RefLink } from "../types/memory";

export type HeapTree = {
  object: HeapObject;
  children: HeapTree[];
};

function addChild(childrenOf: Map<string, string[]>, from: string, to: string, heapIds: Set<string>) {
  if (from === to || !heapIds.has(from) || !heapIds.has(to)) return;
  const list = childrenOf.get(from) ?? [];
  if (list.includes(to)) return;
  list.push(to);
  childrenOf.set(from, list);
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
