import { computed, type Ref } from "vue";
import type { HeapObject, StackFrame } from "../types/memory";

export type InlineBinding = {
  text: string;
  ref: boolean;
};

function fieldKey(label: string): string {
  return label
    .replace(/[<>]/g, "")
    .replace(/\s*\([^)]*\)/g, "")
    .trim();
}

function formatValue(raw: string): string {
  const text = raw.replace(/^→\s*/, "").trim();
  if (text.length <= 18) return text;
  return `${text.slice(0, 16)}…`;
}

function isRefValue(slot: { kind?: string; value: string }): boolean {
  return slot.kind === "ref" || slot.value.startsWith("→") || /^#/.test(slot.value.replace(/^→\s*/, ""));
}

function fieldsOf(heap: HeapObject[], objectId?: string): Map<string, InlineBinding> {
  const map = new Map<string, InlineBinding>();
  if (!objectId) return map;
  const obj = heap.find((item) => item.id === objectId);
  if (!obj) return map;
  for (const field of obj.fields) {
    const key = fieldKey(field.label);
    if (!key || !field.value) continue;
    map.set(key, { text: formatValue(field.value), ref: isRefValue(field) });
  }
  return map;
}

export function collectBindings(stack: StackFrame[], heap: HeapObject[]) {
  const locals = new Map<string, InlineBinding & { targetId?: string }>();
  const qualified = new Map<string, InlineBinding>();

  for (const frame of stack) {
    for (const slot of frame.slots) {
      if (!slot.name || slot.value === "") continue;
      const binding = {
        text: formatValue(slot.value),
        ref: isRefValue(slot),
        targetId: slot.targetId,
      };
      locals.set(slot.name, binding);
      const simple = slot.name.split(/\s+/)[0];
      if (simple && simple !== slot.name) locals.set(simple, binding);
      const dotted = slot.name.split(".");
      if (dotted.length === 2) {
        qualified.set(slot.name, binding);
        locals.set(dotted[1], binding);
      }
    }
  }

  const top = stack[stack.length - 1];
  const thisSlot = top?.slots.find((s) => s.name === "this");
  const thisFields = fieldsOf(heap, thisSlot?.targetId);

  return { locals, qualified, thisFields, heap };
}

export function lookupInlineValue(
  name: string,
  receiver: string | undefined,
  bindings: ReturnType<typeof collectBindings>,
): InlineBinding | undefined {
  if (receiver) {
    const qualified = bindings.qualified.get(`${receiver}.${name}`);
    if (qualified) return qualified;

    const owner = bindings.locals.get(receiver);
    if (owner?.targetId) {
      const field = fieldsOf(bindings.heap, owner.targetId).get(name);
      if (field) return field;
    }
  }

  const local = bindings.locals.get(name);
  if (local) return local;

  if (!receiver) return bindings.thisFields.get(name);
  return undefined;
}

export function useInlineValues(stack: Ref<StackFrame[]>, heap: Ref<HeapObject[]>) {
  return computed(() => collectBindings(stack.value, heap.value));
}
