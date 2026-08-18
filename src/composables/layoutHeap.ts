import type { HeapObject, RefLink, StackFrame } from "../types/memory";

/**
 * Ordre visuel des slots : même convention que StackPanel / StackFrame
 * (frames et slots inversés, la pile pousse vers le haut).
 */
function visualSlots(stack: StackFrame[]) {
  return [...stack].reverse().flatMap((frame) => [...frame.slots].reverse());
}

/**
 * Place les objets heap dans le même ordre vertical que les références
 * sur la stack, pour raccourcir les flèches. Les objets joignables
 * seulement depuis un champ suivent leur parent.
 */
export function orderHeapObjects(
  heap: HeapObject[],
  stack: StackFrame[],
  refs: RefLink[],
): HeapObject[] {
  if (heap.length <= 1) return heap;

  const slots = visualSlots(stack);
  const slotIndex = new Map(slots.map((slot, index) => [slot.id, index]));
  const original = new Map(heap.map((obj, index) => [obj.id, index]));
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

  const ownerOfField = new Map<string, string>();
  for (const obj of heap) {
    for (const field of obj.fields) {
      if (field.id) ownerOfField.set(field.id, obj.id);
    }
  }

  const parentOf = new Map<string, string>();
  for (const obj of heap) {
    for (const field of obj.fields) {
      if (field.targetId && field.targetId !== obj.id && !rank.has(field.targetId)) {
        parentOf.set(field.targetId, obj.id);
      }
    }
  }
  for (const link of refs) {
    if (!link.fromFieldId) continue;
    const parent = ownerOfField.get(link.fromFieldId);
    if (parent && parent !== link.toObjectId && !rank.has(link.toObjectId)) {
      parentOf.set(link.toObjectId, parent);
    }
  }

  function resolved(id: string, seen: Set<string> = new Set()): number {
    if (rank.has(id)) return rank.get(id)!;
    const parent = parentOf.get(id);
    if (parent && !seen.has(parent)) {
      seen.add(parent);
      return resolved(parent, seen) + 0.4;
    }
    return INF + (original.get(id) ?? 0);
  }

  return [...heap].sort((a, b) => {
    const delta = resolved(a.id) - resolved(b.id);
    if (delta !== 0) return delta;
    return (original.get(a.id) ?? 0) - (original.get(b.id) ?? 0);
  });
}
