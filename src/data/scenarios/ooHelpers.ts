import type { HeapObject, RefLink, StackFrame, StackSlot, Step } from "../../types/memory";

export const MAIN_DONE = "La fonction Main va se terminer, le programme va s'arrêter.";

export function val(id: string, name: string, value: string): StackSlot {
  return { id, name, value, kind: "value" };
}

export function refSlot(
  id: string,
  name: string,
  address: string,
  targetId: string,
  declaredType?: string,
): StackSlot {
  return { id, name, value: `→ ${address}`, kind: "ref", targetId, declaredType };
}

export function main(slots: StackSlot[], extra: StackFrame[] = []): StackFrame[] {
  return [{ id: "frame-main", method: "Main", slots }, ...extra];
}

export function frame(id: string, method: string, slots: StackSlot[]): StackFrame {
  return { id, method, slots };
}

export function strObj(id: string, address: string, chars: string): HeapObject {
  return {
    id,
    typeLabel: "string",
    address,
    fields: [{ label: "chars", value: `"${chars}"` }],
  };
}

export function obj(
  id: string,
  typeLabel: string,
  address: string,
  fields: HeapObject["fields"],
): HeapObject {
  return { id, typeLabel, address, fields };
}

export function link(id: string, fromSlotId: string, toObjectId: string): RefLink {
  return { id, fromSlotId, toObjectId };
}

export function fieldLink(id: string, fromFieldId: string, toObjectId: string): RefLink {
  return { id, fromFieldId, toObjectId };
}

export function step(
  id: string,
  highlightLines: number[],
  narration: string,
  stack: StackFrame[],
  heap: HeapObject[],
  refs: RefLink[],
  extra: Partial<Step> = {},
): Step {
  return { id, highlightLines, narration, stack, heap, refs, ...extra };
}
