<script setup lang="ts">
import type { HeapObject as HeapObjectType } from "../../types/memory";

defineProps<{
  object: HeapObjectType;
  focusId?: string;
}>();
</script>

<template>
  <article
    class="heap-object"
    :class="{
      'is-focused': focusId === object.id,
      'is-orphan': object.orphan,
    }"
    :data-object-id="object.id"
  >
    <header class="heap-object__head">
      <span class="heap-object__type">{{ object.typeLabel }}</span>
      <span v-if="object.orphan" class="heap-object__badge">orphelin</span>
      <span class="heap-object__id">{{ object.address }}</span>
    </header>
    <ul class="heap-object__fields">
      <li
        v-for="(field, i) in object.fields"
        :key="field.id ?? i"
        class="field"
        :class="{ 'field--ref': field.kind === 'ref' }"
        :data-field-id="field.id"
      >
        <span class="field__label">{{ field.label }}</span>
        <span class="field__value">{{ field.value }}</span>
      </li>
    </ul>
  </article>
</template>

<style scoped lang="scss">
.heap-object {
  border: 1px solid var(--heap-border);
  border-radius: var(--radius);
  background: linear-gradient(180deg, rgba(240, 160, 90, 0.14), rgba(240, 160, 90, 0.04));
  padding: 0.75rem 0.85rem;
  min-width: 9.5rem;
  transition:
    box-shadow var(--duration) var(--ease),
    border-color var(--duration) var(--ease),
    transform var(--duration) var(--ease),
    opacity var(--duration) var(--ease);

  &.is-focused {
    border-color: var(--heap);
    box-shadow: 0 0 0 1px rgba(240, 160, 90, 0.35), 0 12px 30px rgba(240, 160, 90, 0.15);
    transform: translateY(-2px);
  }

  &.is-orphan {
    opacity: 0.72;
    border-style: dashed;
    border-color: rgba(240, 113, 120, 0.55);
    background: linear-gradient(180deg, rgba(240, 113, 120, 0.12), rgba(240, 160, 90, 0.04));
  }
}

.heap-object__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.55rem;
  flex-wrap: wrap;
}

.heap-object__type {
  font-family: var(--font-code);
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--heap);
}

.heap-object__badge {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--danger);
  background: rgba(240, 113, 120, 0.16);
  border-radius: 999px;
  padding: 0.15rem 0.45rem;
}

.heap-object__id {
  font-family: var(--font-code);
  font-size: 0.72rem;
  color: var(--text-dim);
  margin-left: auto;
}

.heap-object__fields {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.35rem 0.5rem;
  border-radius: var(--radius-sm);
  background: rgba(7, 16, 28, 0.42);
  font-family: var(--font-code);
  font-size: 0.85rem;
}

.field__label {
  color: var(--text-muted);
}

.field__value {
  color: var(--text);
  font-weight: 600;
}

.field--ref .field__value {
  color: var(--heap);
}
</style>
